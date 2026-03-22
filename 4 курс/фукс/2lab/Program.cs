using System;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;

namespace KnapsackProblem
{
    public class Item
    {
        public int Weight { get; set; }
        public int Value { get; set; }
        public int Index { get; set; }
        public double Ratio => (double)Value / Weight;

        public Item(int weight, int value, int index)
        {
            Weight = weight;
            Value = value;
            Index = index;
        }

        public override string ToString()
        {
            return $"Предмет {Index}: вес={Weight}, стоимость={Value}, уд.стоимость={Ratio:F2}";
        }
    }

    public class KnapsackResult
    {
        public int TotalValue { get; set; }
        public bool[] Taken { get; set; }
        public double TimeMs { get; set; }  // Изменено с long на double
        public string AlgorithmName { get; set; }

        public void Print(Item[] items)
        {
            Console.WriteLine($"{AlgorithmName}:");
            Console.WriteLine($"  Суммарная стоимость: {TotalValue}");

            int totalWeight = 0;
            var selectedItems = new List<string>();

            for (int i = 0; i < Taken.Length; i++)
            {
                if (Taken[i])
                {
                    selectedItems.Add($"{i} (в:{items[i].Weight}, ц:{items[i].Value})");
                    totalWeight += items[i].Weight;
                }
            }

            Console.WriteLine($"  Выбранные предметы: {string.Join(", ", selectedItems)}");
            Console.WriteLine($"  Общий вес: {totalWeight}");
            Console.WriteLine($"  Время: {TimeMs:F3} мс");
            Console.WriteLine();
        }
    }

    public class GreedyKnapsack
    {
        public static KnapsackResult Solve(Item[] items, int capacity)
        {
            var stopwatch = Stopwatch.StartNew();

            // Сортируем предметы по убыванию удельной стоимости
            var sortedItems = items.OrderByDescending(i => i.Ratio).ToArray();

            var taken = new bool[items.Length];
            int totalValue = 0;
            int currentWeight = 0;

            foreach (var item in sortedItems)
            {
                if (currentWeight + item.Weight <= capacity)
                {
                    currentWeight += item.Weight;
                    totalValue += item.Value;
                    taken[item.Index] = true;
                }
            }

            stopwatch.Stop();

            return new KnapsackResult
            {
                TotalValue = totalValue,
                Taken = taken,
                TimeMs = stopwatch.Elapsed.TotalMilliseconds,  // Теперь double
                AlgorithmName = "ЖАДНЫЙ АЛГОРИТМ"
            };
        }
    }

    public class DynamicProgrammingKnapsack
    {
        public static KnapsackResult Solve(Item[] items, int capacity)
        {
            var stopwatch = Stopwatch.StartNew();

            int n = items.Length;
            int[,] dp = new int[n + 1, capacity + 1];

            // Заполняем таблицу DP
            for (int i = 1; i <= n; i++)
            {
                for (int w = 0; w <= capacity; w++)
                {
                    if (items[i - 1].Weight <= w)
                    {
                        dp[i, w] = Math.Max(
                            dp[i - 1, w],// Не берем
                            dp[i - 1, w - items[i - 1].Weight] + items[i - 1].Value //Берем
                        );
                    }
                    else
                    {
                        dp[i, w] = dp[i - 1, w];
                    }
                }
            }

            // Восстанавливаем ответ
            var taken = new bool[n];
            int totalValue = dp[n, capacity];
            int remainingCapacity = capacity;

            for (int i = n; i > 0 && totalValue > 0; i--)
            {
                if (dp[i, remainingCapacity] != dp[i - 1, remainingCapacity])
                {
                    taken[i - 1] = true;
                    totalValue -= items[i - 1].Value;
                    remainingCapacity -= items[i - 1].Weight;
                }
            }

            stopwatch.Stop();

            return new KnapsackResult
            {
                TotalValue = dp[n, capacity],
                Taken = taken,
                TimeMs = stopwatch.Elapsed.TotalMilliseconds,  // Теперь double
                AlgorithmName = "ДИНАМИЧЕСКОЕ ПРОГРАММИРОВАНИЕ"
            };
        }
    }

    public class BacktrackingKnapsack
    {
        private readonly Item[] _items;
        private readonly int _capacity;
        private int _bestValue;
        private bool[] _bestSolution;
        private bool[] _current;
        private long _nodesVisited;
        private Stopwatch _stopwatch;

        public BacktrackingKnapsack(Item[] items, int capacity)
        {
            _items = items;
            _capacity = capacity;
            _bestValue = 0;
            _bestSolution = new bool[items.Length];
            _current = new bool[items.Length];
            _nodesVisited = 0;
        }

        public KnapsackResult Solve()
        {
            _stopwatch = Stopwatch.StartNew();

            // Предварительный подсчет максимального потенциала
            int totalPotential = _items.Sum(i => i.Value);

            Backtrack(0, 0, 0, totalPotential);

            _stopwatch.Stop();

            Console.WriteLine($"  Узлов просмотрено: {_nodesVisited}");

            return new KnapsackResult
            {
                TotalValue = _bestValue,
                Taken = _bestSolution,
                TimeMs = _stopwatch.Elapsed.TotalMilliseconds,  // Теперь double
                AlgorithmName = "ПОЛНЫЙ ПЕРЕБОР (БЭКТРЕКИНГ)"
            };
        }

        private void Backtrack(int index, int currentWeight, int currentValue, int remainingPotential)
        {
            _nodesVisited++;

            // Проверка на улучшение лучшего решения
            if (currentValue > _bestValue)
            {
                _bestValue = currentValue;
                Array.Copy(_current, _bestSolution, _items.Length);
            }

            // Базовый случай: все предметы рассмотрены
            if (index >= _items.Length) return;

            // Оптимизация: проверка возможности улучшить решение
            if (currentValue + remainingPotential <= _bestValue) return;

            // Вариант 1: не брать текущий предмет
            Backtrack(index + 1, currentWeight, currentValue,
                     remainingPotential - _items[index].Value);

            // Вариант 2: взять текущий предмет (если помещается)
            if (currentWeight + _items[index].Weight <= _capacity)
            {
                _current[index] = true;
                Backtrack(index + 1,
                         currentWeight + _items[index].Weight,
                         currentValue + _items[index].Value,
                         remainingPotential - _items[index].Value);
                _current[index] = false;
            }
        }
    }

    class Program
    {
        static Random random = new Random();

        static Item[] GenerateItems(int n, int maxWeight, int maxValue)
        {
            var items = new Item[n];
            for (int i = 0; i < n; i++)
            {
                int weight = random.Next(1, maxWeight + 1);
                int value = random.Next(1, maxValue + 1);
                items[i] = new Item(weight, value, i);
            }
            return items;
        }

        static void PrintItems(Item[] items)
        {
            foreach (var item in items)
            {
                Console.WriteLine($"  {item}");
            }
        }

        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            // Тестирование для разных размеров
            int[] sizes = { 10, 15, 20, 25, 30 };

            foreach (int n in sizes)
            {
                Console.WriteLine(new string('=', 70));
                Console.WriteLine($"ТЕСТ ДЛЯ n = {n}");
                Console.WriteLine(new string('=', 70));

                // Генерация данных
                int maxWeight = 50;
                int maxValue = 100;

                // Подбираем вместимость так, чтобы помещалось примерно половина предметов
                int capacity = (n * maxWeight) / 3;

                Item[] items = GenerateItems(n, maxWeight, maxValue);

                Console.WriteLine("Сгенерированные предметы:");
                PrintItems(items);
                Console.WriteLine($"Вместимость рюкзака: {capacity}");
                Console.WriteLine();

                // Жадный алгоритм
                var greedyResult = GreedyKnapsack.Solve(items, capacity);
                greedyResult.Print(items);

                // Динамическое программирование
                var dpResult = DynamicProgrammingKnapsack.Solve(items, capacity);
                dpResult.Print(items);

                // Полный перебор (бэктрекинг)
                Console.WriteLine("ПОЛНЫЙ ПЕРЕБОР (БЭКТРЕКИНГ):");
                var backtracking = new BacktrackingKnapsack(items, capacity);
                var btResult = backtracking.Solve();
                btResult.Print(items);

                // Проверка корректности
                if (btResult.TotalValue == dpResult.TotalValue)
                {
                    Console.WriteLine("✓ Бэктрекинг нашел оптимальное решение (совпадает с DP)");
                }
                else
                {
                    Console.WriteLine("✗ ОШИБКА: бэктрекинг не совпадает с DP!");
                }
                Console.WriteLine();
            }

            // Демонстрация неоптимальности жадного алгоритма
            Console.WriteLine(new string('=', 70));
            Console.WriteLine("ДЕМОНСТРАЦИЯ НЕОПТИМАЛЬНОСТИ ЖАДНОГО АЛГОРИТМА:");
            Console.WriteLine(new string('=', 70));

            var specialItems = new Item[]
            {
                new Item(30, 100, 0),  // уд. стоимость 3.33
                new Item(20, 60, 1),   // уд. стоимость 3.0
                new Item(20, 60, 2)    // уд. стоимость 3.0
            };
            int specialCapacity = 40;

            Console.WriteLine("Предметы:");
            PrintItems(specialItems);
            Console.WriteLine($"Вместимость: {specialCapacity}");
            Console.WriteLine();

            Console.WriteLine("Жадный алгоритм выберет предмет 0 (30, 100) -> стоимость 100");
            Console.WriteLine("Оптимальное решение: предметы 1 и 2 (20+20=40, 60+60=120) -> стоимость 120");
            Console.WriteLine();

            var specialGreedy = GreedyKnapsack.Solve(specialItems, specialCapacity);
            var specialDP = DynamicProgrammingKnapsack.Solve(specialItems, specialCapacity);

            specialGreedy.Print(specialItems);
            specialDP.Print(specialItems);

            Console.WriteLine("Нажмите любую клавишу для выхода...");
            Console.ReadKey();
        }
    }
}