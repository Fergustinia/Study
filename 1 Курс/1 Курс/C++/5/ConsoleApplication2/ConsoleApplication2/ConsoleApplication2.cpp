#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <fstream>
using namespace std;

int main() 
{
	setlocale(LC_ALL, "ru");
	FILE* F1;
	int i, ar, v, z, j, k, N, M;
	int** A;
	float eps, c;
	F1 = fopen("C:\\Users\\ВЫХУХОЛЬ\\Рабочий стол\\Code\\test.txt", "r");
	ofstream F2("C:\\Users\\ВЫХУХОЛЬ\\Рабочий стол\\Code\\out.txt");
	fscanf(F1, "%d", &M);
	fscanf(F1, "%d", &N);
	N++;
	eps = 0, 00000001;

	A = new int* [M];
	for (i = 0; i < M; i++)
	{
		A[i] = new int[N];
	}

	for (i = 0; i < M; i++)
	{
		for (j = 0; j < N; j++)
		{
			fscanf(F1, "%d", &k);
			A[i][j] = k;
		}
	}


	for (int ar = 0, i = 0; (i < N) && (ar < M); i++)
	{

		v = ar; /*выбор ведущего элемента: A[v][i]*/
		for (j = ar + 1; j < M; j++)
			if (abs(A[j][i]) > abs(A[v][i])) v = j;
		if (abs(A[v][i]) >= eps)
		{
			if (v != ar) /*перестановка r–й строки с v–й*/
				for (j = i; j < N; j++)
				{
					z = A[ar][j]; A[ar][j] = A[v][j]; A[ar][j] = z;
				}
			for (int k = ar + 1; k < M; k++) /*вычитание строк*/
			{
				c = A[k][i] / A[i][i];
				for (j = i; j < N; j++) A[k][j] -= c * A[i][j];
			}
			ar++;
		}
	}

	for (i = 0; i < M; i++)
	{
		for (j = 0; j < N; j++)
		{
			F2 << A[i][j] << " ";
		}
		F2 << endl;
	}
	fclose(F1);
	F2.close();
	string path = "result";
	ofstream fout;
	if (!fout.is_open())
	{
		i = i;
	}
	else
	{
		for (int i = 0; i < M; i++) {
			for (int j = 0; j <= N; j++) {

				fout << A[i][j] << endl;;
			}
		}
	}
	fout.close();
}