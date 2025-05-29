#include <iostream>
#include <mpi.h>

using namespace std;

int main(int argc, char* argv[]) {
    int rank, size;
    int x_recv = 0;
    int x_send = 42; // Пример значения для x
    float y_recv = 0.0;
    float y_send = 3.14; // Пример значения для y

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    cout << "Process " << rank << " started." << endl;

    if (rank % 2 != 0 && rank != size - 1) {
        // Принимаем x от предыдущего процесса с нечетным рангом
        MPI_Recv(&x_recv, 1, MPI_INT, rank - 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        cout << "Process " << rank << " received x: " << x_recv << endl;
    }
    else if (rank % 2 == 0 && rank != 0) {
        // Принимаем y от предыдущего процесса с четным рангом
        MPI_Recv(&y_recv, 1, MPI_FLOAT, rank - 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        cout << "Process " << rank << " received y: " << y_recv << endl;
    }

    if (rank % 2 != 0 && rank != size - 1) {
        // Отправляем x следующему процессу с нечетным рангом
        MPI_Send(&x_send, 1, MPI_INT, rank + 1, 0, MPI_COMM_WORLD);
        cout << "Process " << rank << " sent x: " << x_send << endl;
    }
    else if (rank % 2 == 0 && rank != 0 && rank != size - 1) {
        // Отправляем y следующему процессу с четным рангом
        MPI_Send(&y_send, 1, MPI_FLOAT, rank + 1, 0, MPI_COMM_WORLD);
        cout << "Process " << rank << " sent y: " << y_send << endl;
    }

    MPI_Finalize();
    return 0;
}
