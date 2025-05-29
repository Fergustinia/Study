#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <stdio.h>
using namespace std;
const double eps = 0.000001;

int StepMatrixRang(int m, int n, double** Matrix)
{
	int k = 0;
	int s = 0;
	int ind;
	double max = 0;
	int rang = 0, rangEx = 0;

	while (k < m)
	{
		for (int i = k; i < m; i++)
		{
			printf("%d ", s);
			if ((abs(Matrix[i][s]) > max) && (abs(Matrix[i][s]) != 0))
			{
				max = abs(Matrix[i][s]);
				ind = i;
			}
		}

		if ((abs(max) < eps) && (s < n - 1))
		{
			s++;
			max = 0;
			ind = -1;
			rang = rangEx; //ранг основной
		}
		else if ((abs(max) < eps) && (s == n - 1))
		{
			break;
		}
		else
		{
			if ((ind != k) && (ind > 0))
			{
				for (int j = s; j < n; j++)
				{
					double z = Matrix[ind][j]; Matrix[ind][j] = Matrix[k][j]; Matrix[k][j] = z;
				}
			}

			for (int i = k; i < m; i++)
			{
				double d = Matrix[i][s];
				if ((abs(d) > eps))
				{
					for (int j = s; j < n; j++)
					{
						Matrix[i][j] = (Matrix[i][j] / d);
					}
				}
			}

			for (int i = k + 1; i < m; i++)
			{
				for (int j = s; j < n; j++)
				{
					Matrix[i][j] = Matrix[i][j] - Matrix[k][j];
				}
			}

			//проверка на нулевую строку
			int kol_null = 0;
			for (int i = k + 1; i < m; i++)
			{
				kol_null = 0;
				for (int j = s; j < n; j++)
				{
					if (abs(Matrix[i][j]) < eps) kol_null++;
				}
				if (kol_null == (n - s))
				{
					for (int t = s; t < n; t++)
					{
						double z = Matrix[m - 1][t]; Matrix[m - 1][t] = Matrix[i][t]; Matrix[i][t] = z;
					}
					m--;
				}
			}

			k++;
			rangEx++;
			max = 0;
			ind = -1;
			if (s != n - 1) s++;

		}
	}

	if (rang == 0) rang = rangEx;

	if ((rang != rangEx) && (rang != 0))
	{
		printf("Система несовместна, решений нет!");
		printf("\nrang=%d, rangEx=%d\n", rang, rangEx);
		return 0;
	}
	else return rang;

}
void main()
{
	setlocale(LC_ALL, "rus");
	int M, N, flag;
	scanf("%d%d", &M, &N);
	double** Matrix = new double* [M];
	double* Answer = new double[N];
	for (int i = 0; i < M; i++) Matrix[i] = new double[N + 1];
	for (int i = 0; i < M; i++)
	{
		for (int j = 0; j < N + 1; j++)
		{
			scanf("%lf", &Matrix[i][j]);
		}
	}

	int rang;
	//к ступенчатому виду.
	rang = StepMatrixRang(M, N + 1, Matrix);
	if (rang != 0)
	{
		printf("finilly matrix: \n");
		for (int i = 0; i < M; i++)
		{
			for (int j = 0; j < N + 1; j++)
			{
				printf("%lf   ", Matrix[i][j]);
			}
			printf("\n");
		}
		printf("Rang = %d", rang);

		//printf("Answers: ");
		//for (int i = 0;i < M;i++) printf("%lf;", Answer[i]);
	}
	else
	{
		printf("finilly matrix: \n");
		for (int i = 0; i < M; i++)
		{
			for (int j = 0; j < N + 1; j++)
			{
				printf("%lf   ", Matrix[i][j]);
			}
			printf("\n");
		}
	}

	printf("\n");
}