#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

using namespace std;

// Функция для проверки условия сходимости метода простой итерации
bool checkConvergence(const vector<vector<double>>& A) {
    int n = A.size();

    // Проверка диагонального преобладания
    for (int i = 0; i < n; ++i) {
        double diagonalSum = 0.0;
        for (int j = 0; j < n; ++j) {
            if (j != i) {
                diagonalSum += fabs(A[i][j]);
            }
        }
        if (fabs(A[i][i]) <= diagonalSum) {
            return false; // Не выполняется условие диагонального преобладания
        }
    }

    return true;
}

// Функция для решения СЛАУ методом простой итерации
vector<double> jacobiMethod(const vector<vector<double>>& A, const vector<double>& b, int maxIterations, double tolerance) {
    int n = A.size();
    vector<double> x(n, 0.0); // Инициализация начального приближения

    if (!checkConvergence(A)) {
        cerr << "Условие сходимости не выполняется. Метод может не сойтись." << endl;
        return x;
    }

    for (int iter = 0; iter < maxIterations; ++iter) {
        vector<double> x_new(n, 0.0); // Инициализация нового вектора x

        for (int i = 0; i < n; ++i) {
            double sum = 0.0;
            for (int j = 0; j < n; ++j) {
                if (j != i) {
                    sum += A[i][j] * x[j];
                }
            }
            x_new[i] = (b[i] - sum) / A[i][i];
        }

        // Проверка на сходимость
        double error = 0.0;
        for (int i = 0; i < n; ++i) {
            error += fabs(x_new[i] - x[i]);
        }

        if (error < tolerance) {
            cout << "Метод сошелся на итерации " << iter + 1 << endl;

            // Оценка точности
            vector<double> trueSolution = { 1, 2, 3 }; // Предположим, что точное решение известно
            double solutionError = 0.0;
            for (int i = 0; i < n; ++i) {
                solutionError += pow(x_new[i] - trueSolution[i], 2);
            }
            solutionError = sqrt(solutionError);

            cout << "Норма разности с точным решением: " << solutionError << endl;

            // Программная проверка правильности найденного решения
            cout << "Проверка правильности решения:" << endl;
            for (int i = 0; i < n; ++i) {
                double equationResult = 0.0;
                for (int j = 0; j < n; ++j) {
                    equationResult += A[i][j] * x_new[j];
                }
                cout << "Уравнение " << i + 1 << ": " << equationResult << " = " << b[i] << endl;
            }

            return x_new;
        }

        x = x_new; // Обновление текущего приближения
    }

    cerr << "Метод не сошелся за заданное количество итераций." << endl;
    return x; // Возврат текущего приближения
}

int main() {
    // Пример использования метода простой итерации на произвольной системе
    vector<vector<double>> A = { {4, -1, 0},
                                {-1, 4, -1},
                                {0, -1, 4} };

    vector<double> b = { 15, 10, 10 };

    int maxIterations = 1000;
    double tolerance = 1e-6;

    // Проверка условия сходимости
    if (checkConvergence(A)) {
        // Решение системы методом простой итерации
        vector<double> result = jacobiMethod(A, b, maxIterations, tolerance);

        // Программное формирование матрицы коэффициентов
        cout << "Матрица коэффициентов A:" << endl;
        for (int i = 0; i < A.size(); ++i) {
            for (int j = 0; j < A[i].size(); ++j) {
                cout << setw(5) << A[i][j] << " ";
            }
            cout << endl;
        }

        // Исследование скорости сходимости в зависимости от заданной точности
        cout << "Исследование скорости сходимости:" << endl;
        for (double tol = 1e-1; tol >= 1e-10; tol *= 0.1) {
            cout << "Точность: " << tol << endl;
            jacobiMethod(A, b, maxIterations, tol);
            cout << endl;
        }
    }

    return 0;
}
