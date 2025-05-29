#include <mpi.h>
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>

#define M 5

double generate_y(int k, double x) {
    return sin(pow(k, 2) + x) / (pow(k, 2) + 1) * 2 - 1; // Диапазон [-1, 1]
}

int main(int argc, char** argv) {
    int rank, size, i, j;
    double x, * y = NULL, sum_neg = 0.0, sum_neg_global = 0.0;

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    srand(time(NULL) + rank); // Уникальное зерно для каждого процесса

    x = cos((rank + 1.0) * rand() / RAND_MAX);
    printf("Process %d: Generated x = %lf\n", rank, x);

    double local_y[M]; // Локальный массив для каждого процесса

    if (rank == size - 1) {
        y = malloc(size * M * sizeof(double));
        for (i = 0; i < size; i++) {
            for (j = 0; j < M; j++) {
                y[i * M + j] = generate_y(j, x); // Генерация y зависит от k и x
            }
        }
    }

    // Рассылка данных из массива y всем процессам
    MPI_Scatter(y, M, MPI_DOUBLE, local_y, M, MPI_DOUBLE, size - 1, MPI_COMM_WORLD);

    // Вычисление суммы отрицательных элементов
    for (i = 0; i < M; i++) {
        if (local_y[i] < 0) {
            sum_neg += local_y[i];
        }
    }

    printf("Process %d: sum_neg = %lf\n", rank, sum_neg);

    // Сборка суммы отрицательных элементов на процессе 1
    MPI_Reduce(&sum_neg, &sum_neg_global, 1, MPI_DOUBLE, MPI_SUM, 1, MPI_COMM_WORLD);

    if (rank == 1) {
        printf("Sum of negative elements on process 1: %lf\n", sum_neg_global);
    }

    if (y) {
        free(y);
    }

    MPI_Finalize();
    return 0;
}
