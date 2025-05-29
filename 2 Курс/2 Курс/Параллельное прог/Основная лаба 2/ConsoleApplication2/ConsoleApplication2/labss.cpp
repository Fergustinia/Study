#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <mpi.h>
#include <iostream>

#define M 5
using namespace std;

int main(int argc, char* argv[]) {
    int rank, size;
 
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);
    const int n = M * size - 1;
    int y[n]; 
    int x[n]; 
    int z[n];

    if (rank == size - 1)
    {
        rc = MPI_Scatter(x, n, MPI_INT, y, n, MPI_INT, 0, MPI_COMM_WORLD);
        for (int i = 0; i < n; i++) {
            y[i] = sin((i ^ 2) + x[i]) / (i ^ 2 + 1);

        }
        rc = MPI_Scatter(y, n, MPI_INT, x, n, MPI_INT, 0, MPI_COMM_WORLD);
    }
    for (int i = 0; i < n; i++) {
        x[i] = cos((rank + 1.0) * rand() / RAND_MAX);
    }

    MPI_Scatter(y, n, MPI_INT, z, n, MPI_INT, 0, MPI_COMM_WORLD);
    double sum = 0; 


    for (int i = 0; i < M; i++) {
        if (z[i] < 0) {
            sum += z[i];
        }
    }
    MPI_Scatter(z, n, MPI_INT, z, n, MPI_INT, 1, MPI_COMM_WORLD);
    if (rank == 1)
    {

        cout << "Вывод"<<sum<<endl;
    }

    MPI_Finalize();
    return 0;
}
