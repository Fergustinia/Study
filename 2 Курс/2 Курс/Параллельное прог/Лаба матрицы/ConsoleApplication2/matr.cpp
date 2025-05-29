#include "matr.h"
#include <iostream>
using namespace std;

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
	for (int i = 0;i < a; i++)
	{
		cout << "Process #"<<a<<" " << A[a][i] << " ";
	}
	return 0;
}

int** mat::genA()
{
	return A;
}
