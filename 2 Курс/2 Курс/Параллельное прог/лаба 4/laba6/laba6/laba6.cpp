#include <iostream>
#include <mpi.h>
#include <cmath>
#include <iomanip>


using namespace std;

double f(double x) {
    // Подынтегральная функция
    return (1.4 + sqrt(x + pow(exp(1), x))) / (x + 0.7);
}

int main(int argc, char** argv)
{
    double ans = 10.0735117837278;  // Ожидаемый результат интеграла
    int rank, size;
    const double a = 0, b = 5.1;
    const int n = 10000000;  // Общее количество подинтервалов
    double h = (b - a) / n;  // Шаг интегрирования
    double local_integral = 0.0;  // Локальная сумма интеграла
    double* Result = 0;

    // Инициализация MPI
    MPI_Init(&argc, &argv);
    MPI_Comm comm = MPI_COMM_WORLD;
    MPI_Comm_size(comm, &size);
    MPI_Comm_rank(comm, &rank);

    if (rank == 0) {
        Result = new double[size];
    }

    // Начало времени измерения
    double start_time = MPI_Wtime();

    // Распределение работы между процессами
    for (int i = rank; i < n; i += size) {
        double x_mid = a + (i + 0.5) * h;  // Средняя точка подинтервала
        local_integral += f(x_mid);
    }

    local_integral *= h;  // Умножаем на шаг интегрирования

    // Собираем результаты со всех процессов на процесс 0
    MPI_Gather(&local_integral, 1, MPI_DOUBLE, Result, 1, MPI_DOUBLE, 0, comm);

    if (rank == 0) {
        double total_integral = 0.0;
        for (int i = 0; i < size; ++i) {
            total_integral += Result[i];
        }

        // Вывод результатов
        cout << "Number of processes: " << size << endl;
        cout << "Calculated Integral: " << setprecision(13) << total_integral << endl;
        cout << "Difference from expected: " << setprecision(13) << fabs(ans - total_integral) << endl;
        cout << "Time taken: " << MPI_Wtime() - start_time << " seconds" << endl;

        delete[] Result;
    }

    // Завершение MPI
    MPI_Finalize();
    return 0;
}
