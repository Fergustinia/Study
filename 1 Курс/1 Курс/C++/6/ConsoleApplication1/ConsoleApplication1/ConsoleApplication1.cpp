#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include "stdio.h"

using namespace std;

float eps = 0.000001;
float** A;
int* L;
int b;
//приводит к ступенчатому виду и выводит ранг
int dev(int n, int m)
{
	int i, v, u, k, j, z, c, r;
	i = 0;
	if (n < m) r = n; else r = m;
	while (i < r)
		//выбор ведущего элемента A[v][u] по строчкам
	{
		v = i; /*u = i;*/
		for (j = i; j < m; j++)
			/*for (k = i; k < n; k++)*/
				if (abs(A[j][i]) > abs(A[v][i])) 
				{
					v = j; /*u = k;*/
				}
		if (abs(A[v][i]) < eps) r = i;
		else
		{
			//перестановка строк
			if (v != i)
				for (j = i; j <= n; j++)
				{
					z = A[i][j]; A[i][j] = A[v][j]; A[v][j] = z;
				}

			/*if (u != i)
			{
				for (k = 0; k < m; k++)
				{
					z = A[k][i]; A[k][i] = A[k][u]; A[k][u] = z;
				}
				z = L[i]; L[i] = L[u]; L[u] = z;
			}*/
			c = A[i][i]; //деление i-й строки на A[i][i]
			for (j = i; j <= n; j++) A[i][j] /= c;
			//вычитание уравнений
			for (k = i+1; k < m; k++)
				/*if (k != i)*/
				{
					c = A[k][i];
					for (j = i; j <= n; j++) A[k][j] -= c * A[i][j];
				}
			i++;
		}
	}
	return r;
}
int main(void)
{
	int i, j, k, m, r, n;

	float* X;
	FILE* F1, * F2;
	F1 = fopen("C:\\Users\\ВЫХУХОЛЬ\\Desktop\\Code\\C++\\6\\ConsoleApplication1\\test.txt", "r");
	F2 = fopen("C:\\Users\\ВЫХУХОЛЬ\\Desktop\\Code\\C++\\6\\ConsoleApplication1\\out.txt", "w");
	fscanf(F1, "%d", &m);
	fscanf(F1, "%d", &n);
	A = new float* [m];
	X = new float[n];
	for (i = 0; i < m; i++)
	{
		A[i] = new float[n + 1];
		for (j = 0; j <= n; j++) fscanf(F1, "%f", &A[i][j]);
	}
	L = new int[n];
	for (i = 0; i < n; i++) L[i] = i; //задание индексного массива L

	//проверка решения системы уравнений
	r = dev(n, m);
	for (j = 0; j < m; j++)
	{
		for (i = 0; i <= n; i++)
		{
			fprintf(F2, "%f ", A[j][i]);
		}
		fprintf(F2, "\n");
	}
	i = r;
	while (i < m && abs(A[i][n]) < eps) i++;
	if (i < m) //решение системы не существует
	{
		cout << "Inconsistent system";
		fprintf(F2, "%s ", "Inconsistent system");
	}
	//решение системы единственное
	else if (r == n)
	{
		for (j = 0; j < n; j++) 
			X[j] = A[j][n];
			fprintf(F2, "\n, \n");
		for (j = 0; j < n; j++)
			{
				fprintf(F2, "%f ", X[j]);
				cout << X[j] << " ";
			}
		}
	//общее решение
	else
	{
		for (k = r; k < n; k++)
		{
			X[L[k]] = 0;//свободные члены
			fprintf(F2, "%s", "x");
			fprintf(F2, "%d ", L[k] + 1); //вывод свободных членов
			cout << "x" << L[k] + 1 << " ";
		}
		fprintf(F2, "%s ", "free");
		fprintf(F2, "\n");
		cout <<"free" << endl;

		for (j = 0; j < r; j++)
		{
			X[L[j]] = A[j][n];
			for (k = r; k < n; k++)
				X[L[j]] -= A[j][k] * X[L[k]];
		}

		for (j = 0; j < n; j++)
		{
			fprintf(F2, "%f ", X[j]);
			cout << X[j]<<" ";
		}
	}
	fclose(F1);
	fclose(F2);
}