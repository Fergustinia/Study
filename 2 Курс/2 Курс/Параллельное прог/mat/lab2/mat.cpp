#include "mpi.h"
#include <iostream>
using namespace std;
int main(int argc, char* argv[])
{
    const int n = 4;
    int A[n][n], B[n], sum[n], c = 0, sum2[n];
    int rank, size, tag = 2;
    MPI_Init(&argc, &argv);
    MPI_Comm comm;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);
    comm = MPI_COMM_WORLD;
    MPI_Status status;
    if (rank == 0)
    {
        for (int i = 0; i < n; i++)
        {
            B[i] = 1 + i;
            sum[i] = 0;
            cout << "B = " << B[i] << endl;
            for (int j = 0; j < n; j++)
            {
                A[i][j] = i + j;
                cout << "A[" << i << "][" << j << "] = " << A[i][j] << endl;

            }
        }
        for (int i = 1; i != size; i++)
        {
            cout << rank << "rank send B " << endl;
            MPI_Send(&B, n, MPI_INT, i, tag, comm);
        }
        for (int i = 1; i != size; i++)
        {
            cout << rank << "rank Send A " << endl;
            MPI_Send(&A, n * n, MPI_INT, i, tag, comm);
            for (int i = 0; i < n; i++)
            {
                MPI_Recv(&c, 1, MPI_INT, i + 1, tag, comm, &status);
                cout << "rank = " << rank << " number " << c << endl;
            }

        }

        if (rank != 0)
        {
            cout << rank << "rank recv B and A " << endl;
            MPI_Recv(&B, n, MPI_INT, 0, tag, comm, &status);
            MPI_Recv(&A, n * n, MPI_INT, 0, tag, comm, &status);
            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < n; j++)
                {
                    c += A[i][j] * B[j];

                }

                MPI_Send(&c, 1, MPI_INT, 0, tag, comm);
                c = 0;
            }

        }

        MPI_Finalize();
        return 0;
    }
}