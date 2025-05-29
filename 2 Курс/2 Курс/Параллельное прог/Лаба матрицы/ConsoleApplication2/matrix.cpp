//#pragma once
#include <iostream>
//#include <mpi.h>
//#include "matr.h"
using namespace std;

class mat
{
    int a;
    int b;
    int** A;

public:
    mat();
    mat(int n);
    double create();
    double print(int i);
    int** genA();
};


mat::mat() {
}

mat::mat(int n) {
    b = n;


}
double mat::create() {
    a = b;
    A = new int* [a];
    for (int i = 0; i < b; i++) {
        A[i] = new int[a];
        for (int j = 0; j < b; j++)
        {
            A[i][j] = i * 2 + j * 3;
        }
    }
    return 0;
}
double mat::print(int i)
{
    a = i;
    for (int i = 0; i < a; i++)
    {
        cout << "Process #" << a << " " << A[a][i] << " ";
    }
    return 0;
}

int** mat::genA()
{
    return A;
}


int main(int argc, char* argv[]) {
    int rank, size;
    const int a = 5;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);
    mat mat10(a);
    int** A;
    A = mat10.genA();
    if (rank==0)
    {
        mat10.create();
        
        for (int i = 0; i < size; i++)
        {
            for (int j = 0; j < a; j++) {
                MPI_Send(&A[i][j], 1, MPI_INT, i + 1, 0, MPI_COMM_WORLD);             
            }
        }
    }
    if (rank != 0)
    {
        for (int i = 0; i < size; i++)
        {
            for (int j = 0; j < a; j++) {
                MPI_Recv(&A[i][j], 1, MPI_INT, 0, 0, MPI_COMM_WORLD,&status);
            }
            mat10.print(i);
        }
    }
    MPI_Finalize();
    return 0;
}
