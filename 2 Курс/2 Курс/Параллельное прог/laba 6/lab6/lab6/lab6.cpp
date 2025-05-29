#include <iostream>
#include <omp.h>
#include <cmath>
#include <iomanip>

using namespace std;

double f(double x) {
    // Подынтегральная функция
    return (1.4 + sqrt(x + pow(exp(1), x))) / (x + 0.7);
}

int main(int argc, char** argv) {
    double ans = 10.0735117837278;  // Ожидаемый результат интеграла
    const double a = 0, b = 5.1;
    const int n = 10000000;  // Общее количество подинтервалов
    double h = (b - a) / n;  // Шаг интегрирования
    double total_integral = 0.0;  // Общая сумма интеграла

    // Начало времени измерения
    double start_time = omp_get_wtime();

    // Распределение работы между потоками
#pragma omp parallel for reduction(+:total_integral)
    for (int i = 0; i < n; ++i) {
        double x_mid = a + (i + 0.5) * h;  // Средняя точка подинтервала
        total_integral += f(x_mid);
    }

    total_integral *= h;  // Умножаем на шаг интегрирования

    // Вывод результатов
    cout << "Calculated Integral: " << setprecision(13) << total_integral << endl;
    cout << "Difference from expected: " << setprecision(13) << fabs(ans - total_integral) << endl;
    cout << "Time taken: " << omp_get_wtime() - start_time << " seconds" << endl;

    return 0;
}
