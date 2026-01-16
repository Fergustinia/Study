#!/usr/bin/env python3
from __future__ import annotations

import argparse
import bz2
import io
import os
import shutil
import subprocess
import sys
import tarfile
import time
from pathlib import Path
from typing import BinaryIO, Optional

CHUNK = 1024 * 1024  # 1 MiB


def eprint(*args: object) -> None:
    print(*args, file=sys.stderr)


def human(n: int) -> str:
    units = ["B", "KiB", "MiB", "GiB", "TiB"]
    x = float(n)
    for u in units:
        if x < 1024 or u == units[-1]:
            return f"{x:.1f} {u}" if u != "B" else f"{int(x)} {u}"
        x /= 1024
    return f"{n} B"


def progress_line(done: int, total: Optional[int], width: int = 30) -> str:
    if not total or total <= 0:
        return f"{human(done)}"
    frac = min(1.0, done / total)
    fill = int(frac * width)
    bar = "#" * fill + "-" * (width - fill)
    return f"[{bar}] {frac*100:5.1f}% ({human(done)}/{human(total)})"


def copy_stream(src: BinaryIO, dst: BinaryIO, total: Optional[int], progress: bool) -> int:
    done = 0
    last = 0.0
    while True:
        buf = src.read(CHUNK)
        if not buf:
            break
        dst.write(buf)
        done += len(buf)
        if progress:
            now = time.time()
            if now - last >= 0.1:
                print("\r" + progress_line(done, total), end="", file=sys.stderr)
                last = now
    if progress:
        print("\r" + progress_line(done, total) + " " * 5, file=sys.stderr)
    return done


def dir_total_size(p: Path) -> int:
    total = 0
    for f in p.rglob("*"):
        if f.is_file():
            try:
                total += f.stat().st_size
            except OSError:
                pass
    return total


def detect_algo_by_target(target_archive: Path) -> str:
    n = target_archive.name.lower()
    if n.endswith(".bz2"):
        return "bz2"
    if n.endswith(".zst") or n.endswith(".zstd"):
        return "zstd"
    raise ValueError("Target archive must end with .bz2 or .zst/.zstd")


def is_archive(path: Path) -> bool:
    n = path.name.lower()
    return n.endswith(".bz2") or n.endswith(".zst") or n.endswith(".zstd")


def ensure_zstd_available() -> str:
    exe = shutil.which("zstd")
    if not exe:
        raise RuntimeError(
            "Для .zst требуется внешняя утилита 'zstd' в PATH. "
            "Установите zstd (например, через пакетный менеджер) или используйте .bz2."
        )
    return exe


# ---------------- bz2 path (stdlib) ----------------

def bz2_compress_file(src: Path, dst_archive: Path, progress: bool) -> None:
    total = src.stat().st_size
    with src.open("rb") as f_in, bz2.open(dst_archive, "wb", compresslevel=9) as f_out:
        copy_stream(f_in, f_out, total=total, progress=progress)


def bz2_compress_dir(src_dir: Path, dst_archive: Path, progress: bool) -> None:
    approx_total = dir_total_size(src_dir) or None
    with bz2.open(dst_archive, "wb", compresslevel=9) as f_out:
        # tar streaming into bz2
        with tarfile.open(fileobj=f_out, mode="w|") as tf:
            # store directory as a top-level folder
            tf.add(src_dir, arcname=src_dir.name)
    # Progress for tar->bz2 precisely is non-trivial; we can at least show approximate on file reads,
    # but tarfile writes directly. Поэтому для bz2-директории прогресс лучше выключать или оставить как есть.


def bz2_extract(archive: Path, dest_dir: Path, progress: bool) -> None:
    dest_dir.mkdir(parents=True, exist_ok=True)
    with bz2.open(archive, "rb") as f_in:
        buf = io.BufferedReader(f_in)

        head = buf.peek(512)
        is_tar = len(head) >= 262 and head[257:262] == b"ustar"

        if is_tar:
            with tarfile.open(fileobj=buf, mode="r|") as tf:
                tf.extractall(dest_dir)
        else:
            out_name = archive.name[:-4] if archive.name.lower().endswith(".bz2") else (archive.name + ".out")
            out_path = dest_dir / out_name
            with out_path.open("wb") as f_out:
                copy_stream(buf, f_out, total=None, progress=progress)


# ---------------- zstd path (via external 'zstd' binary, stdlib subprocess) ----------------

def zstd_compress_file(src: Path, dst_archive: Path) -> None:
    zstd = ensure_zstd_available()
    # zstd -q -f -o out in
    subprocess.run([zstd, "-q", "-f", "-o", str(dst_archive), str(src)], check=True)


def zstd_compress_dir(src_dir: Path, dst_archive: Path) -> None:
    zstd = ensure_zstd_available()
    # tar stream -> zstd stream -> file
    # tar -cf - dir | zstd -q -f -o out
    # but we must use tarfile (stdlib), not system tar
    with subprocess.Popen([zstd, "-q", "-f", "-o", str(dst_archive), "-"],
                          stdin=subprocess.PIPE) as p:
        assert p.stdin is not None
        with tarfile.open(fileobj=p.stdin, mode="w|") as tf:
            tf.add(src_dir, arcname=src_dir.name)
        p.stdin.close()
        rc = p.wait()
        if rc != 0:
            raise subprocess.CalledProcessError(rc, p.args)


def zstd_extract(archive: Path, dest_dir: Path) -> None:
    zstd = ensure_zstd_available()
    dest_dir.mkdir(parents=True, exist_ok=True)

    # Decompress to stdout, then decide if tar (peek) and either extract tar or write single file
    p = subprocess.Popen([zstd, "-q", "-d", "-c", str(archive)],
                         stdout=subprocess.PIPE)
    assert p.stdout is not None
    buf = io.BufferedReader(p.stdout)

    head = buf.peek(512)
    is_tar = len(head) >= 262 and head[257:262] == b"ustar"

    if is_tar:
        with tarfile.open(fileobj=buf, mode="r|") as tf:
            tf.extractall(dest_dir)
    else:
        # write single file named by archive without .zst/.zstd
        name = archive.name
        lower = name.lower()
        if lower.endswith(".zst"):
            name = name[:-4]
        elif lower.endswith(".zstd"):
            name = name[:-5]
        out_path = dest_dir / name
        with out_path.open("wb") as f_out:
            shutil.copyfileobj(buf, f_out, length=CHUNK)

    rc = p.wait()
    if rc != 0:
        raise subprocess.CalledProcessError(rc, p.args)


# ---------------- main logic ----------------

def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        prog="archiver",
        description="Консольный архиватор/распаковщик (Python stdlib). .bz2 — через bz2, .zst — через внешнюю утилиту zstd.",
    )
    parser.add_argument("source", type=Path, help="Источник: файл/директория для архивации ИЛИ архив для распаковки")
    parser.add_argument("target", type=Path, help="Целевой архив (.bz2/.zst) для архивации ИЛИ директория назначения для распаковки")
    parser.add_argument("--benchmark", action="store_true", help="Показать время выполнения операции")
    parser.add_argument("--progress", action="store_true", help="Показать прогресс (для некоторых режимов)")

    args = parser.parse_args(argv)
    src: Path = args.source
    tgt: Path = args.target

    if not src.exists():
        eprint(f"Ошибка: источник не существует: {src}")
        return 2

    # Режим определяется расширением ЦЕЛЕВОГО архива
    # Если target — .bz2/.zst => архивируем source в target
    # Иначе если source — .bz2/.zst => распаковываем source в target (как директорию)
    t0 = time.perf_counter()

    try:
        algo = detect_algo_by_target(tgt)
        mode = "compress"
    except ValueError:
        if is_archive(src):
            mode = "extract"
            algo = "bz2" if src.name.lower().endswith(".bz2") else "zstd"
        else:
            eprint("Ошибка: режим не определён.")
            eprint("Для архивации target должен быть file.bz2 или file.zst.")
            eprint("Для распаковки source должен быть file.bz2 или file.zst, а target — каталог назначения.")
            return 2

    try:
        if mode == "compress":
            tgt.parent.mkdir(parents=True, exist_ok=True)
            if algo == "bz2":
                if src.is_dir():
                    bz2_compress_dir(src, tgt, progress=args.progress)
                else:
                    bz2_compress_file(src, tgt, progress=args.progress)
            else:
                # zstd
                if src.is_dir():
                    zstd_compress_dir(src, tgt)
                else:
                    zstd_compress_file(src, tgt)

            if args.benchmark:
                dt_ms = (time.perf_counter() - t0) * 1000
                size = tgt.stat().st_size if tgt.exists() else 0
                print(f"OK: created {tgt} ({human(size)}) in {dt_ms:.1f} ms")
            else:
                print(f"OK: created {tgt}")

        else:
            # extract
            dest_dir = tgt
            if algo == "bz2":
                bz2_extract(src, dest_dir, progress=args.progress)
            else:
                zstd_extract(src, dest_dir)

            if args.benchmark:
                dt_ms = (time.perf_counter() - t0) * 1000
                print(f"OK: extracted to {dest_dir} in {dt_ms:.1f} ms")
            else:
                print(f"OK: extracted to {tgt}")

        return 0

    except RuntimeError as ex:
        eprint(f"Ошибка: {ex}")
        return 3
    except subprocess.CalledProcessError as ex:
        eprint(f"Ошибка: внешняя команда завершилась с кодом {ex.returncode}")
        return 4
    except Exception as ex:
        eprint(f"Ошибка: {ex}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
