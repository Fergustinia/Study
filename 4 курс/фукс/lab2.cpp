#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
#include <chrono>

using namespace std;
using namespace chrono;

struct Item {
    int weight;
    int value;
    int index;
    double ratio;
    
    Item(int w, int v, int i) : weight(w), value(v), index(i) {
        ratio = (double)value / weight;
    }
};

// Жадный алгоритм (сортировка по удельной стоимости)
pair<int, vector<bool>> greedyKnapsack(const vector<Item>& items, int capacity) {
    vector<Item> sortedItems = items;
    sort(sortedItems.begin(), sortedItems.end(), 
         [](const Item& a, const Item& b) { return a.ratio > b.ratio; });
    
    vector<bool> taken(items.size(), false);
    int totalValue = 0;
    int currentWeight = 0;
    
    for (const auto& item : sortedItems) {
        if (currentWeight + item.weight <= capacity) {
            currentWeight += item.weight;
            totalValue += item.value;
            taken[item.index] = true;
        }
    }
    
    return {totalValue, taken};
}

// Динамическое программирование (целочисленные веса)
pair<int, vector<bool>> dynamicProgramming(const vector<Item>& items, int capacity) {
    int n = items.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
    
    // Заполнение таблицы DP
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (items[i-1].weight <= w) {
                dp[i][w] = max(dp[i-1][w], 
                              dp[i-1][w - items[i-1].weight] + items[i-1].value);
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    
    // Восстановление ответа
    vector<bool> taken(n, false);
    int totalValue = dp[n][capacity];
    int w = capacity;
    
    for (int i = n; i > 0 && totalValue > 0; i--) {
        if (dp[i][w] != dp[i-1][w]) {
            taken[i-1] = true;
            totalValue -= items[i-1].value;
            w -= items[i-1].weight;
        }
    }
    
    return {dp[n][capacity], taken};
}

// Полный перебор с бэктрекингом
class BacktrackingKnapsack {
private:
    const vector<Item>& items;
    int capacity;
    int bestValue;
    vector<bool> bestSolution;
    vector<bool> current;
    long long nodesVisited;
    
    void backtrack(int idx, int currentWeight, int currentValue, int remainingPotential) {
        nodesVisited++;
        
        // Проверка на улучшение лучшего решения
        if (currentValue > bestValue) {
            bestValue = currentValue;
            bestSolution = current;
        }
        
        // Базовый случай: все предметы рассмотрены
        if (idx >= items.size()) return;
        
        // Оптимизация: проверка возможности улучшить решение
        if (currentValue + remainingPotential <= bestValue) return;
        
        // Вариант 1: не брать текущий предмет
        backtrack(idx + 1, currentWeight, currentValue, 
                 remainingPotential - items[idx].value);
        
        // Вариант 2: взять текущий предмет (если помещается)
        if (currentWeight + items[idx].weight <= capacity) {
            current[idx] = true;
            backtrack(idx + 1, 
                     currentWeight + items[idx].weight,
                     currentValue + items[idx].value,
                     remainingPotential - items[idx].value);
            current[idx] = false;
        }
    }
    
public:
    BacktrackingKnapsack(const vector<Item>& it, int cap) 
        : items(it), capacity(cap), bestValue(0), nodesVisited(0) {
        current.resize(items.size(), false);
    }
    
    pair<int, vector<bool>> solve() {
        // Предварительный подсчет максимального потенциала
        int totalPotential = 0;
        for (const auto& item : items) {
            totalPotential += item.value;
        }
        
        auto start = high_resolution_clock::now();
        backtrack(0, 0, 0, totalPotential);
        auto end = high_resolution_clock::now();
        
        auto duration = duration_cast<microseconds>(end - start);
        cout << "  Узлов просмотрено: " << nodesVisited << endl;
        cout << "  Время бэктрекинга: " << duration.count() / 1000.0 << " мс" << endl;
        
        return {bestValue, bestSolution};
    }
};

// Генерация тестовых данных
vector<Item> generateItems(int n, int maxWeight, int maxValue, int capacity) {
    vector<Item> items;
    int totalWeight = 0;
    
    for (int i = 0; i < n; i++) {
        int weight = rand() % maxWeight + 1;
        int value = rand() % maxValue + 1;
        items.emplace_back(weight, value, i);
        totalWeight += weight;
    }
    
    // Корректируем вместимость рюкзака так, чтобы помещалось примерно половина грузов
    // (это будет сделано в main)
    
    return items;
}

// Вспомогательная функция для вывода результатов
void printResults(const string& algorithm, const pair<int, vector<bool>>& result, 
                 const vector<Item>& items, double timeMs) {
    cout << algorithm << ":" << endl;
    cout << "  Суммарная стоимость: " << result.first << endl;
    cout << "  Выбранные предметы: ";
    int totalWeight = 0;
    for (size_t i = 0; i < result.second.size(); i++) {
        if (result.second[i]) {
            cout << i << " (в:" << items[i].weight << ", ц:" << items[i].value << ") ";
            totalWeight += items[i].weight;
        }
    }
    cout << endl;
    cout << "  Общий вес: " << totalWeight << endl;
    cout << "  Время: " << fixed << setprecision(3) << timeMs << " мс" << endl;
    cout << endl;
}

int main() {
    setlocale(LC_ALL, "Russian");
    srand(time(nullptr));
    
    // Тестирование для разных размеров
    vector<int> sizes = {10, 15, 20, 25, 30};
    
    for (int n : sizes) {
        cout << string(60, '=') << endl;
        cout << "ТЕСТ ДЛЯ n = " << n << endl;
        cout << string(60, '=') << endl;
        
        // Генерация данных
        int maxWeight = 50;
        int maxValue = 100;
        
        // Подбираем вместимость так, чтобы помещалось примерно половина предметов
        int capacity = (n * maxWeight) / 3;  // Эмпирическая формула
        
        vector<Item> items = generateItems(n, maxWeight, maxValue, capacity);
        
        cout << "Сгенерированные предметы:" << endl;
        for (const auto& item : items) {
            cout << "  Предмет " << item.index << ": вес=" << item.weight 
                 << ", стоимость=" << item.value 
                 << ", уд. стоимость=" << fixed << setprecision(2) << item.ratio << endl;
        }
        cout << "Вместимость рюкзака: " << capacity << endl;
        cout << endl;
        
        // Жадный алгоритм
        auto start = high_resolution_clock::now();
        auto greedyResult = greedyKnapsack(items, capacity);
        auto end = high_resolution_clock::now();
        double greedyTime = duration_cast<microseconds>(end - start).count() / 1000.0;
        printResults("ЖАДНЫЙ АЛГОРИТМ", greedyResult, items, greedyTime);
        
        // Динамическое программирование
        start = high_resolution_clock::now();
        auto dpResult = dynamicProgramming(items, capacity);
        end = high_resolution_clock::now();
        double dpTime = duration_cast<microseconds>(end - start).count() / 1000.0;
        printResults("ДИНАМИЧЕСКОЕ ПРОГРАММИРОВАНИЕ", dpResult, items, dpTime);
        
        // Полный перебор (бэктрекинг)
        cout << "ПОЛНЫЙ ПЕРЕБОР (БЭКТРЕКИНГ):" << endl;
        BacktrackingKnapsack bt(items, capacity);
        auto btResult = bt.solve();
        
        int btWeight = 0;
        for (size_t i = 0; i < btResult.second.size(); i++) {
            if (btResult.second[i]) btWeight += items[i].weight;
        }
        
        cout << "  Суммарная стоимость: " << btResult.first << endl;
        cout << "  Выбранные предметы: ";
        for (size_t i = 0; i < btResult.second.size(); i++) {
            if (btResult.second[i]) {
                cout << i << " (в:" << items[i].weight << ", ц:" << items[i].value << ") ";
            }
        }
        cout << endl;
        cout << "  Общий вес: " << btWeight << endl;
        cout << endl;
        
        // Проверка корректности (оптимальность решения)
        if (btResult.first == dpResult.first) {
            cout << "✓ Бэктрекинг нашел оптимальное решение (совпадает с DP)" << endl;
        } else {
            cout << "✗ ОШИБКА: бэктрекинг не совпадает с DP!" << endl;
        }
        cout << endl;
    }
    
    // Дополнительный тест для демонстрации неоптимальности жадного алгоритма
    cout << string(60, '=') << endl;
    cout << "ДЕМОНСТРАЦИЯ НЕОПТИМАЛЬНОСТИ ЖАДНОГО АЛГОРИТМА:" << endl;
    cout << string(60, '=') << endl;
    
    vector<Item> specialItems;
    specialItems.emplace_back(30, 100, 0);  // уд. стоимость 3.33
    specialItems.emplace_back(20, 60, 1);   // уд. стоимость 3.0
    specialItems.emplace_back(20, 60, 2);   // уд. стоимость 3.0
    int specialCapacity = 40;
    
    cout << "Предметы:" << endl;
    for (const auto& item : specialItems) {
        cout << "  Предмет " << item.index << ": вес=" << item.weight 
             << ", стоимость=" << item.value 
             << ", уд. стоимость=" << fixed << setprecision(2) << item.ratio << endl;
    }
    cout << "Вместимость: " << specialCapacity << endl << endl;
    
    auto greedySpecial = greedyKnapsack(specialItems, specialCapacity);
    auto dpSpecial = dynamicProgramming(specialItems, specialCapacity);
    
    cout << "Жадный алгоритм выберет предмет 0 (30, 100) -> стоимость 100" << endl;
    cout << "Оптимальное решение: предметы 1 и 2 (20+20=40, 60+60=120) -> стоимость 120" << endl;
    cout << endl;
    printResults("ЖАДНЫЙ АЛГОРИТМ", greedySpecial, specialItems, 0);
    printResults("ОПТИМАЛЬНОЕ РЕШЕНИЕ (DP)", dpSpecial, specialItems, 0);
    
    return 0;
}