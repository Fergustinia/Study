
import os
import shutil
import subprocess
import sys
from pathlib import Path


def run_cmd(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess:
    """Запуск команды с выводом."""
    print(f"$ {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)
    if check and result.returncode != 0:
        print(f"Ошибка: команда завершилась с кодом {result.returncode}", file=sys.stderr)
        sys.exit(1)
    return result


def main():
    # Создаём тестовую директорию
    test_dir = Path("test_data")
    if test_dir.exists():
        shutil.rmtree(test_dir)
    test_dir.mkdir()

    # Создаём тестовые файлы
    (test_dir / "file1.txt").write_text("Hello, World!\n" * 100)
    (test_dir / "file2.txt").write_text("Test content\n" * 50)
    (test_dir / "subdir").mkdir()
    (test_dir / "subdir" / "file3.txt").write_text("Nested file\n" * 30)

    print("=" * 70)
    print("Тест 1: Упаковка директории в .bz2")
    print("=" * 70)
    run_cmd([sys.executable, "archiver.py", "pack", str(test_dir), "test.tar.bz2", "--benchmark"])

    print("\n" + "=" * 70)
    print("Тест 2: Распаковка .bz2 архива")
    print("=" * 70)
    restored_dir = Path("restored_bz2")
    if restored_dir.exists():
        shutil.rmtree(restored_dir)
    run_cmd([sys.executable, "archiver.py", "unpack", "test.tar.bz2", str(restored_dir), "--benchmark"])

    # Проверка содержимого
    print("\n" + "=" * 70)
    print("Проверка содержимого:")
    print("=" * 70)
    original_file1 = (test_dir / "file1.txt").read_text()
    restored_file1 = (restored_dir / test_dir.name / "file1.txt").read_text()
    if original_file1 == restored_file1:
        print("✓ file1.txt совпадает")
    else:
        print("✗ file1.txt НЕ совпадает!")
        sys.exit(1)

    print("\n" + "=" * 70)
    print("Тест 3: Упаковка файла в .bz2 с прогресс-баром")
    print("=" * 70)
    test_file = test_dir / "file1.txt"
    run_cmd([sys.executable, "archiver.py", "pack", str(test_file), "test_file.bz2", "--progress", "--benchmark"])

    print("\n" + "=" * 70)
    print("Тест 4: Распаковка файла .bz2")
    print("=" * 70)
    run_cmd([sys.executable, "archiver.py", "unpack", "test_file.bz2", "restored_file", "--benchmark"])

    # Проверка
    original = test_file.read_text()
    restored = (Path("restored_file") / "file1.txt").read_text()
    if original == restored:
        print("✓ Распакованный файл совпадает")
    else:
        print("✗ Распакованный файл НЕ совпадает!")
        sys.exit(1)

    print("\n" + "=" * 70)
    print("Тест 5: Проверка справки")
    print("=" * 70)
    run_cmd([sys.executable, "archiver.py", "--help"], check=False)
    run_cmd([sys.executable, "archiver.py", "pack", "--help"], check=False)
    run_cmd([sys.executable, "archiver.py", "unpack", "--help"], check=False)

    print("\n" + "=" * 70)
    print("Все тесты пройдены успешно! ✓")
    print("=" * 70)

    # Очистка (опционально)
    if "--keep" not in sys.argv:
        print("\nОчистка тестовых файлов...")
        for path in ["test.tar.bz2", "test_file.bz2", "restored_file", "restored_bz2"]:
            p = Path(path)
            if p.exists():
                if p.is_dir():
                    shutil.rmtree(p)
                else:
                    p.unlink()


if __name__ == "__main__":
    main()

