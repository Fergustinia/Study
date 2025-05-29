#include <iostream>
#include <mpi.h>

using namespace std;

int main(int argc, char *argv[]) {
    int rank, size;
    int x=1;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);
    
if (rank==0)
{
	MPI_Send(&x, 1, MPI_INT,rank+1, 0, MPI_COMM_WORLD);
	cout<<x<<"rank"<<rank<<endl;
}
else if (rank==size-1)

{
	MPI_Recv(&x, 1, MPI_INT,rank-1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        cout<<x<<endl<<"rank"<<rank;	
}
else {
	MPI_Recv(&x, 1, MPI_INT,rank-1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
	x+=1;
    	MPI_Send(&x, 1, MPI_INT,rank+1, 0, MPI_COMM_WORLD);
	cout<<x<<"rank"<<rank<<endl;;
	
}

   
    MPI_Finalize();
    return 0;
}
