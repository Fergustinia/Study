#include <mpi.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[]) {
    int rank, size;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int x = rank;
    int local_sum = x;
    int global_sum = 0;
    int temp;
    int partner;

    // Каскадное суммирование
    for (int step = 1; step < size; step *= 2) {
        if (rank % (2 * step) == 0) {
            partner = rank + step;
            if (partner < size) {
                MPI_Recv(&temp, 1, MPI_INT, partner, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
                local_sum += temp;
            }
            else {
                // Если партнёр для приёма выходит за пределы, общаемся с MPI_PROC_NULL
                MPI_Recv(&temp, 1, MPI_INT, MPI_PROC_NULL, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
            }
        }
        else if (rank % step == 0) {
            partner = rank - step;
            if (partner >= 0) {
                MPI_Send(&local_sum, 1, MPI_INT, partner, 0, MPI_COMM_WORLD);
            }
            else {
                // Если партнёр для отправки выходит за пределы, общаемся с MPI_PROC_NULL
                MPI_Send(&local_sum, 1, MPI_INT, MPI_PROC_NULL, 0, MPI_COMM_WORLD);
            }
            break; // После отправки данных этот процесс завершает свою работу в суммировании
        }
    }

    // Только корневой процесс (rank 0) будет знать результат
    if (rank == 0) {
        global_sum = local_sum;
        printf("Total sum is %d\n", global_sum);
    }

    MPI_Finalize();
    return 0;
}
