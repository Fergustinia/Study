# programming-languages

## Архиватор (archiver.py)

Консольная утилита архиватор/распаковщик на Python 3.14, использующая только стандартную библиотеку.

### Возможности

- **Алгоритмы сжатия:**
  - `bz2` — полностью через стандартную библиотеку Python
  - `zstd` — через внешнюю утилиту `zstd` (если установлена)
  
- **Автоматическое определение алгоритма** по расширению файла (`.bz2` или `.zst/.zstd`)
- **Поддержка директорий** — автоматически использует `tarfile` для упаковки директорий
- **Режим benchmark** — показывает время выполнения операций
- **Прогресс-бар** — опциональное отображение прогресса (для файлов)

### Использование

#### Упаковка

```bash
# Упаковать директорию
python archiver.py pack ./my_folder backup.tar.bz2

# Упаковать файл
python archiver.py pack file.txt file.txt.bz2

# С benchmark
python archiver.py pack ./my_folder backup.tar.bz2 --benchmark

# С прогресс-баром
python archiver.py pack test_file.txt test_file.txt.bz2 --progress --benchmark
```

#### Распаковка

```bash
# Распаковать в текущую директорию
python archiver.py unpack backup.tar.bz2

# Распаковать в указанную директорию
python archiver.py unpack backup.tar.bz2 ./restored

# С benchmark
python archiver.py unpack backup.tar.bz2 ./restored --benchmark
```

#### Справка

```bash
python archiver.py --help
python archiver.py pack --help
python archiver.py unpack --help
```

### Тестирование

```bash
# Простой тест базовой функциональности
python simple_test.py

# Полный тест с созданием архивов
python test_archiver.py
```

### Примечания

- Для работы с `.zst` архивами требуется установленная утилита `zstd` в PATH
- Для `.bz2` используется только стандартная библиотека Python
- При упаковке директорий автоматически создаётся tar-архив внутри сжатого файла