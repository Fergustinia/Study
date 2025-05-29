#include <stdio.h>
#include <mpi.h>
int main(int argc, char **argv)
{ int rank, size, rc;
  MPI_Comm comm;
  rc= MPI_Init(&argc, &argv);
  comm=MPI_COMM_WORLD;
  rc= MPI_Comm_size(MPI_COMM_WORLD, &size);
  rc= MPI_Comm_rank(MPI_COMM_WORLD, &rank);
  printf( "size =  %d rank =  %d\n", size, rank);
  rc= MPI_Finalize();
  return 0;
}