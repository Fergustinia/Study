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
from typing import BinaryIO, Literal, Optional

CHUNK_SIZE = 1024 * 1024

Algorithm = Literal["bz2", "zstd"]


def eprint(*args: object, **kwargs) -> None:
    print(*args, file=sys.stderr, **kwargs)


def human_size(n: int) -> str:
    units = ["B", "KiB", "MiB", "GiB", "TiB"]
    x = float(n)
    for u in units:
        if x < 1024 or u == units[-1]:
            return f"{x:.1f} {u}" if u != "B" else f"{int(x)} {u}"
        x /= 1024
    return f"{n} B"


def progress_bar(done: int, total: Optional[int], width: int = 40) -> str:
    if total is None or total <= 0:
        return f"{human_size(done)}"
    frac = min(1.0, done / total)
    fill = int(frac * width)
    bar = "█" * fill + "░" * (width - fill)
    pct = frac * 100
    return f"[{bar}] {pct:5.1f}% {human_size(done)}/{human_size(total)}"


def update_progress(done: int, total: Optional[int], show: bool) -> None:
    if not show:
        return
    line = "\r" + progress_bar(done, total) + " " * 5
    sys.stderr.write(line)
    sys.stderr.flush()


def copy_with_progress(
    src: BinaryIO, dst: BinaryIO, total: Optional[int], show_progress: bool
) -> int:
    done = 0
    last_update = 0.0
    update_interval = 0.1

    while True:
        chunk = src.read(CHUNK_SIZE)
        if not chunk:
            break
        dst.write(chunk)
        done += len(chunk)

        if show_progress:
            now = time.time()
            if now - last_update >= update_interval:
                update_progress(done, total, show=True)
                last_update = now

    if show_progress:
        update_progress(done, total, show=True)
        eprint()

    return done


def get_dir_size(path: Path) -> int:
    total = 0
    try:
        for item in path.rglob("*"):
            if item.is_file():
                try:
                    total += item.stat().st_size
                except OSError:
                    pass
    except OSError:
        pass
    return total


def detect_algorithm(archive_path: Path) -> Algorithm:
    name_lower = archive_path.name.lower()
    if name_lower.endswith(".bz2"):
        return "bz2"
    if name_lower.endswith(".zst") or name_lower.endswith(".zstd"):
        return "zstd"
    raise ValueError(
        f"Неизвестное расширение архива: {archive_path.name}\n"
        f"Ожидается .bz2 или .zst/.zstd"
    )


def is_archive_file(path: Path) -> bool:
    name_lower = path.name.lower()
    return name_lower.endswith((".bz2", ".zst", ".zstd"))


def ensure_zstd_binary() -> str:
    zstd_path = shutil.which("zstd")
    if not zstd_path:
        raise RuntimeError(
            "Алгоритм zstd требует внешнюю утилиту 'zstd'.\n"
            "Установите zstd (например, через пакетный менеджер) или используйте .bz2"
        )
    return zstd_path


def bz2_compress_file(src: Path, dst: Path, show_progress: bool) -> None:
    total = src.stat().st_size
    with src.open("rb") as f_in, bz2.open(dst, "wb", compresslevel=9) as f_out:
        copy_with_progress(f_in, f_out, total=total, show_progress=show_progress)


def bz2_compress_dir(src_dir: Path, dst: Path, show_progress: bool) -> None:
    if show_progress:
        total_size = get_dir_size(src_dir)
        eprint(f"Упаковка директории (приблизительно {human_size(total_size)})...")

    with bz2.open(dst, "wb", compresslevel=9) as bz2_file:
        with tarfile.open(fileobj=bz2_file, mode="w|") as tar:
            tar.add(src_dir, arcname=src_dir.name)

    if show_progress:
        eprint("Готово!")


def bz2_extract(archive: Path, dest_dir: Path, show_progress: bool) -> None:
    dest_dir.mkdir(parents=True, exist_ok=True)

    with bz2.open(archive, "rb") as bz2_file:
        peek_buf = io.BufferedReader(bz2_file)
        header = peek_buf.peek(512)

        is_tar = len(header) >= 262 and header[257:262] == b"ustar"

        if is_tar:
            with tarfile.open(fileobj=peek_buf, mode="r|") as tar:
                if show_progress:
                    members = tar.getmembers()
                    total = sum(m.size for m in members if m.isfile())
                    eprint(f"Распаковка tar-архива ({len(members)} элементов)...")
                tar.extractall(dest_dir)
                if show_progress:
                    eprint("Готово!")
        else:
            out_name = (
                archive.name[:-4]
                if archive.name.lower().endswith(".bz2")
                else archive.name + ".out"
            )
            out_path = dest_dir / out_name
            total = None
            try:
                if show_progress:
                    archive_size = archive.stat().st_size
                    eprint(f"Распаковка файла (архив: {human_size(archive_size)})...")
            except OSError:
                pass

            with out_path.open("wb") as f_out:
                copy_with_progress(peek_buf, f_out, total=total, show_progress=show_progress)


def zstd_compress_file(src: Path, dst: Path) -> None:
    zstd_exe = ensure_zstd_binary()
    subprocess.run(
        [zstd_exe, "-q", "-f", "-o", str(dst), str(src)],
        check=True,
    )


def zstd_compress_dir(src_dir: Path, dst: Path) -> None:
    zstd_exe = ensure_zstd_binary()
    with subprocess.Popen(
        [zstd_exe, "-q", "-f", "-o", str(dst), "-"],
        stdin=subprocess.PIPE,
    ) as proc:
        assert proc.stdin is not None
        with tarfile.open(fileobj=proc.stdin, mode="w|") as tar:
            tar.add(src_dir, arcname=src_dir.name)
        proc.stdin.close()
        returncode = proc.wait()
        if returncode != 0:
            raise subprocess.CalledProcessError(returncode, proc.args)


def zstd_extract(archive: Path, dest_dir: Path) -> None:
    zstd_exe = ensure_zstd_binary()
    dest_dir.mkdir(parents=True, exist_ok=True)

    proc = subprocess.Popen(
        [zstd_exe, "-q", "-d", "-c", str(archive)],
        stdout=subprocess.PIPE,
    )
    assert proc.stdout is not None
    buf = io.BufferedReader(proc.stdout)

    header = buf.peek(512)
    is_tar = len(header) >= 262 and header[257:262] == b"ustar"

    try:
        if is_tar:
            with tarfile.open(fileobj=buf, mode="r|") as tar:
                tar.extractall(dest_dir)
        else:
            name = archive.name
            if name.lower().endswith(".zst"):
                name = name[:-4]
            elif name.lower().endswith(".zstd"):
                name = name[:-5]
            out_path = dest_dir / name
            with out_path.open("wb") as f_out:
                shutil.copyfileobj(buf, f_out, length=CHUNK_SIZE)
    finally:
        returncode = proc.wait()
        if returncode != 0:
            raise subprocess.CalledProcessError(returncode, proc.args)


def cmd_pack(args: argparse.Namespace) -> int:
    src = Path(args.source)
    dst = Path(args.output)

    if not src.exists():
        eprint(f"Ошибка: источник не существует: {src}")
        return 1

    try:
        algo = detect_algorithm(dst)
    except ValueError as e:
        eprint(f"Ошибка: {e}")
        return 1

    dst.parent.mkdir(parents=True, exist_ok=True)

    t0 = time.perf_counter()

    try:
        if algo == "bz2":
            if src.is_dir():
                bz2_compress_dir(src, dst, show_progress=args.progress)
            else:
                bz2_compress_file(src, dst, show_progress=args.progress)
        else:
            if src.is_dir():
                zstd_compress_dir(src, dst)
            else:
                zstd_compress_file(src, dst)

        dt = time.perf_counter() - t0
        size = dst.stat().st_size if dst.exists() else 0

        if args.benchmark:
            print(f"Упаковано: {dst} ({human_size(size)}) за {dt*1000:.1f} мс")
        else:
            print(f"Упаковано: {dst}")

        return 0

    except RuntimeError as e:
        eprint(f"Ошибка: {e}")
        return 1
    except subprocess.CalledProcessError as e:
        eprint(f"Ошибка: команда завершилась с кодом {e.returncode}")
        return 1
    except Exception as e:
        eprint(f"Ошибка: {e}")
        import traceback
        traceback.print_exc()
        return 1


def cmd_unpack(args: argparse.Namespace) -> int:
    archive = Path(args.archive)
    dest_dir = Path(args.dest)

    if not archive.exists():
        eprint(f"Ошибка: архив не существует: {archive}")
        return 1

    if not is_archive_file(archive):
        eprint(f"Ошибка: файл не является архивом: {archive}")
        return 1

    try:
        algo = detect_algorithm(archive)
    except ValueError as e:
        eprint(f"Ошибка: {e}")
        return 1

    t0 = time.perf_counter()

    try:
        if algo == "bz2":
            bz2_extract(archive, dest_dir, show_progress=args.progress)
        else:
            zstd_extract(archive, dest_dir)

        dt = time.perf_counter() - t0

        if args.benchmark:
            print(f"Распаковано в: {dest_dir} за {dt*1000:.1f} мс")
        else:
            print(f"Распаковано в: {dest_dir}")

        return 0

    except RuntimeError as e:
        eprint(f"Ошибка: {e}")
        return 1
    except subprocess.CalledProcessError as e:
        eprint(f"Ошибка: команда завершилась с кодом {e.returncode}")
        return 1
    except Exception as e:
        eprint(f"Ошибка: {e}")
        import traceback
        traceback.print_exc()
        return 1


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="archiver",
        description=(
            "Консольная утилита архиватор/распаковщик.\n"
            "Использует только стандартную библиотеку Python.\n"
            "Алгоритмы: bz2 (stdlib) и zstd (через внешнюю утилиту zstd).\n"
            "Алгоритм определяется автоматически по расширению: .bz2 или .zst/.zstd"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    subparsers = parser.add_subparsers(dest="command", help="Команда", required=True)

    pack_parser = subparsers.add_parser(
        "pack",
        help="Упаковать файл или директорию в архив",
        description="Упаковывает файл или директорию в архив. "
        "Если источник - директория, используется tarfile.",
    )
    pack_parser.add_argument(
        "source",
        type=str,
        help="Источник: файл или директория для архивации",
    )
    pack_parser.add_argument(
        "output",
        type=str,
        help="Целевой архив (расширение .bz2 или .zst/.zstd)",
    )
    pack_parser.add_argument(
        "--benchmark",
        action="store_true",
        help="Вывести время выполнения операции",
    )
    pack_parser.add_argument(
        "--progress",
        action="store_true",
        help="Показать прогресс-бар (для файлов и некоторых режимов)",
    )
    pack_parser.set_defaults(func=cmd_pack)

    unpack_parser = subparsers.add_parser(
        "unpack",
        help="Распаковать архив",
        description="Распаковывает архив в указанную директорию.",
    )
    unpack_parser.add_argument(
        "archive",
        type=str,
        help="Путь к архиву (.bz2 или .zst/.zstd)",
    )
    unpack_parser.add_argument(
        "dest",
        type=str,
        nargs="?",
        default=".",
        help="Директория назначения (по умолчанию: текущая директория)",
    )
    unpack_parser.add_argument(
        "--benchmark",
        action="store_true",
        help="Вывести время выполнения операции",
    )
    unpack_parser.add_argument(
        "--progress",
        action="store_true",
        help="Показать прогресс-бар (для некоторых режимов)",
    )
    unpack_parser.set_defaults(func=cmd_unpack)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    if not hasattr(args, "func"):
        parser.print_help()
        return 1

    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())

