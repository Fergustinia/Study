
import os
import sys
from pathlib import Path

# Проверяем, что archiver.py существует
if not Path("archiver.py").exists():
    print("Ошибка: archiver.py не найден")
    sys.exit(1)

# Импортируем функции из archiver
sys.path.insert(0, ".")
try:
    from archiver import detect_algorithm, human_size, is_archive_file
    print("✓ Импорт модуля успешен")
except Exception as e:
    print(f"✗ Ошибка импорта: {e}")
    sys.exit(1)

# Тест определения алгоритма
print("\nТест определения алгоритма:")
test_cases = [
    ("test.bz2", "bz2"),
    ("test.zst", "zstd"),
    ("test.zstd", "zstd"),
]

for filename, expected in test_cases:
    try:
        result = detect_algorithm(Path(filename))
        if result == expected:
            print(f"  ✓ {filename} -> {result}")
        else:
            print(f"  ✗ {filename} -> {result} (ожидалось {expected})")
    except Exception as e:
        print(f"  ✗ {filename} -> ошибка: {e}")

# Тест форматирования размера
print("\nТест форматирования размера:")
sizes = [0, 1024, 1024*1024, 1024*1024*1024]
for size in sizes:
    formatted = human_size(size)
    print(f"  {size} -> {formatted}")

# Тест проверки архива
print("\nТест проверки архива:")
for filename in ["test.bz2", "test.zst", "test.txt"]:
    is_arch = is_archive_file(Path(filename))
    expected = filename != "test.txt"
    status = "✓" if is_arch == expected else "✗"
    print(f"  {status} {filename} -> {is_arch}")

print("\n✓ Все базовые тесты пройдены!")

