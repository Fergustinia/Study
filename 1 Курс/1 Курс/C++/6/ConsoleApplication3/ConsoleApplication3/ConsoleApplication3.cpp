#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <stdio.h>
using namespace std;

const double eps = 0.0000000000000001;

void swap(double* a, double* b)
{
	double c = *a;
	*a = *b;
	*b = c;
}

int StepMatrix(int m, int n, double** Matrix, int* L)
{
	int i = 0;
	int r, p, v, u;
	if ((n - 1) < m) r = n - 1;
	else r = m;
	double c;

	while (i < r)
	{
		/* take element */
		v = i; u = i;
		for (int j = i; j < m; j++)
		{
			for (int k = i; k < n - 1; k++)
			{
				if (abs(Matrix[j][k]) > abs(Matrix[v][u]))
				{
					v = j;
					u = k;
				}
			}
		}

		if (abs(Matrix[v][u]) < eps) r = i;
		else
		{

			/* swap stroks */
			if (v != i)
			{
				for (int j = i; j < n; j++)
				{
					swap(Matrix[i][j], Matrix[v][j]);
				}
			}

			/* swap columns */
			if (u != i)
			{
				for (int k = 0; k < m; k++)
				{
					swap(Matrix[k][i], Matrix[k][u]);
				}
				p = L[i]; L[i] = L[u]; L[u] = p;
			}

			/* to the 1 */
			c = Matrix[i][i];
			for (int j = i; j < n; j++) Matrix[i][j] /= c;

			/* subtraction */
			for (int k = 0; k < m; k++)
			{
				if (k != i)
				{
					c = Matrix[k][i];
					for (int j = i; j < n; j++) Matrix[k][j] -= c * Matrix[i][j];
				}
			}

			i++;
		}
	}
	return r;
}

void main()
{
	int M, N;
	/* files */
	FILE* f, * Answ;
	f = fopen("test.txt", "rt");
	fscanf(f, "%d", &M);
	fscanf(f, "%d", &N);

	/* Matrix and vectors */
	double** Matrix = new double* [M];
	double* Answer = new double[N];
	int* L = new int[N];
	for (int i = 0; i < M; i++) Matrix[i] = new double[N + 1];
	for (int i = 0; i < M; i++)
	{
		for (int j = 0; j < N + 1; j++)
		{
			fscanf(f, "%lf", &Matrix[i][j]);
		}
	}
	for (int i = 0; i < N; i++) L[i] = i;

	/* step view + return rank of main matrix  */
	int r;
	r = StepMatrix(M, N + 1, Matrix, L);

	/* step view output to file */
	Answ = fopen("answers.txt", "wt");
	fprintf(Answ, "step view of the matrix: \n");
	for (int i = 0; i < M; i++)
	{
		for (int j = 0; j < N + 1; j++)
		{
			fprintf(Answ, "%3.3f   ", Matrix[i][j]);
		}
		fprintf(Answ, "\n");
	}

	/* solutions */
	int i;
	i = r;
	while ((i < M) && (abs(Matrix[i][N]) < eps)) i++;
	if (i < M) fprintf(Answ, "The system is incompatible!");
	else if (r == N)
	{
		for (int j = 0; j < N; j++)
		{
			Answer[L[j]] = Matrix[j][N];
		}
		for (int j = 0; j < N; j++) fprintf(Answ, "x%d=%3.3f; ", j + 1, Answer[j]);
	}
	else
	{
		printf("The system is indefinite, enter any value for each free variable:\n");
		for (int j = r; j < N; j++)
		{
			printf("x%d=", L[j] + 1);
			scanf("%lf", &Answer[L[j]]);
			fprintf(Answ, "x%d - is free; ", L[j] + 1);
		}
		for (int j = 0; j < r; j++)
		{
			Answer[L[j]] = Matrix[j][N];
			for (int k = r; k < N; k++)
			{
				Answer[L[j]] -= Matrix[j][k] * Answer[L[k]];
			}
		}
		for (int j = 0; j < N; j++) fprintf(Answ, "x%d=%lf; ", j + 1, Answer[j]);
	}



	fclose(Answ);
	fclose(f);

	delete[] Answer;
	delete[] L;
	for (int i = 0; i < M; i++) delete[] Matrix[i];
	delete[] Matrix;

	printf("The answers are written in a file answers.txt");
	printf("\n");
}
