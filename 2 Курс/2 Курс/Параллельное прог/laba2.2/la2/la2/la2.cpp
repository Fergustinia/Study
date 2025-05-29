#include <mpi.h>
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>


#define rAND_MAX 32767

double generate_y(int rank, double x) {
    int k = rank + 1;
    double y = sin(pow(k, 2) + x) / (pow(k, 2) + 1) * 2 - 1; // Диапазон [-1, 1]
    printf("Process %d: Generated y = %lf\n", rank, y);
    return y;
}

int main(int argc, char** argv) {
    int rank, size, i, m = 5,n,tag=2;
    double x, sum_neg = 0.0, sum_neg_global = 0.0;
    const n = size * m;
    MPI_Init(&argc, &argv);
    MPI_Comm comm;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    srand(time(NULL) + rank); // Используем уникальное зерно для каждого процесса
    double y[n];
    double z[m];
    // Generate x for each process
    x = cos((rank + 1.0) * rand() / rAND_MAX);
    printf("Process %d: Generated x = %lf\n", rank, x);
    //MPI_Send(&x, 1, MPI_INT, rank, tag, comm);
    
    if (rank == size - 1)// Calculate y for each process
    {
        
        for (i = 0; i < n; i++) {
            y[i] = generate_y(rank, x);
        }

        // Scatter y array to all processes
        
        MPI_Scatter(y, n, MPI_DOUBLE, z, m, MPI_DOUBLE, 0, MPI_COMM_WORLD);
    }
    // Calculate sum of negative elements
    for (i = 0; i < m; i++) {
        if (z[i] < 0) {
            sum_neg += z[i];
        }
    }

    printf("Process %d: sum_neg = %lf\n", rank, sum_neg);

    // Reduce sum_neg to process 1
    MPI_Reduce(&sum_neg, &sum_neg_global, 1, MPI_DOUBLE, MPI_SUM, 1, MPI_COMM_WORLD);

    if (rank == 1) {
        printf("Sum of negative elements: %lf\n", sum_neg_global);
    }

    MPI_Finalize();
    return 0;
}
