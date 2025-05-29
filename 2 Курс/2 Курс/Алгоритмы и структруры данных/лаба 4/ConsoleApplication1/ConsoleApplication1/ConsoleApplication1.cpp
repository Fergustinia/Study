#include <iostream>
#include <algorithm>

using namespace std;

int greedy(int* weights, int* values, int n, int capacity) {
	int totalValue = 0; // Общая стоимость предметов, помещенных в рюкзак
	int remainingCapacity = capacity; // Оставшаяся вместимость рюкзака

	// Сортировка предметов по убыванию их стоимости
	for (int i = 0; i < n; ++i) {
		int index = i;
		// Находим индекс предмета с наибольшей стоимостью среди оставшихся предметов
		for (int j = i + 1; j < n; ++j) {
			if (values[j] > values[index]) {
				index = j;
			}
		}
		// Перемещаем предмет с наибольшей стоимостью в начало списка
		swap(weights[i], weights[index]);
		swap(values[i], values[index]);

		// Помещаем предмет в рюкзак, если его вес помещается
		if (weights[i] <= remainingCapacity) {
			totalValue += values[i]; // Увеличиваем общую стоимость предметов в рюкзаке
			remainingCapacity -= weights[i]; // Уменьшаем оставшуюся вместимость рюкзака
		}
	}

	return totalValue; // Возвращаем общую стоимость предметов в рюкзаке
}

// Бэктрекинг с отсечением
void backtrack(int* weights, int* values, int n, int capacity, int index, int currentWeight, int currentValue, int& maxValue) {
	// Если мы рассмотрели все предметы, проверяем, является ли текущее значение рюкзака максимальным
	if (index == n) {
		maxValue = max(maxValue, currentValue);
		return;
	}

	// Пропускаем предмет, если его вес превышает оставшуюся вместимость рюкзака
	if (currentWeight + weights[index] <= capacity) {
		// Рекурсивно вызываем функцию для добавления текущего предмета в рюкзак
		backtrack(weights, values, n, capacity, index + 1, currentWeight + weights[index], currentValue + values[index], maxValue);
	}

	// Пропускаем текущий предмет и рекурсивно вызываем функцию для следующего предмета
	backtrack(weights, values, n, capacity, index + 1, currentWeight, currentValue, maxValue);
}

//Динамическое программирование
int dynamicProgramming(int* weights, int* values, int n, int capacity) {
	// Создание двумерного массива для хранения промежуточных результатов
	int** dp = new int* [n + 1];
	for (int i = 0; i <= n; ++i) {
		dp[i] = new int[capacity + 1];
	}

	// Инициализация массива dp нулями
	for (int i = 0; i <= n; ++i) {
		for (int j = 0; j <= capacity; ++j) {
			dp[i][j] = 0;
		}
	}

	// Заполнение массива dp
	for (int i = 1; i <= n; ++i) {
		for (int j = 1; j <= capacity; ++j) {
			if (weights[i - 1] <= j) {
				// Если вес текущего предмета помещается в рюкзак,
				// выбираем максимум из вариантов: либо берем предмет, либо не берем
				dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - weights[i - 1]] + values[i - 1]);
			}
			else {
				// Если вес текущего предмета превышает вместимость рюкзака,
				// копируем значение из предыдущей строки
				dp[i][j] = dp[i - 1][j];
			}
		}
	}

	// Результат находится в правом нижнем углу массива dp
	int result = dp[n][capacity];

	for (int i = 0; i <= n; ++i) {
		delete[] dp[i];
	}
	delete[] dp;

	// Возвращаем результат
	return result;
}

int main() {
	setlocale(LC_ALL, "Russian");
	int n = 20;
	int* weights = new int[n];
	int* values = new int[n];

	srand(time(nullptr));

	// Генерация весов и стоимостей для каждого предмета
	for (int i = 0; i < n; ++i) {
		// Генерация случайного веса в диапазоне от 1 до 10
		weights[i] = rand() % 10 + 1;
		// Генерация случайной стоимости в диапазоне от 1 до 20
		values[i] = rand() % 20 + 1;
	}

	// Вычисление вместимости рюкзака (половина суммы всех весов предметов)
	int W = 0;
	for (int i = 0; i < n; ++i) {
		W += weights[i];
	}
	W /= 2;

	cout << "Веса:";
	for (int i = 0; i < n; ++i) {
		cout << " " << weights[i];
	}
	cout << endl;

	cout << "Стоимости:";
	for (int i = 0; i < n; ++i) {
		cout << " " << values[i];
	}
	cout << endl;

	cout << "Вместимость W: " << W << endl;

	cout << "Жадный алгоритм: " << greedy(weights, values, n, W) << endl;
	int maxValue = 0;
	backtrack(weights, values, n, W, 0, 0, 0, maxValue);
	cout << "Полным Перебором: " << maxValue << endl;
	cout << "Динамическое программирование: " << dynamicProgramming(weights, values, n, W) << endl;

	delete[] weights;
	delete[] values;
	return 0;
}