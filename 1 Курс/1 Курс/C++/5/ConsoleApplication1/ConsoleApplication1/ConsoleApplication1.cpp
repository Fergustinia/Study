#include <iostream>
#include <fstream>
using namespace std;
void main(void)
{
    int i, j, g, n;  
    float** A;
    int* X;
    scanf("%work1.txt", &n);
    X = new int[n]; 
    A = new float[n];
    for (i = 0; i < n; i++)
    {
        A[i] = new float[n + 1];
        for (j = 0; j <= n; j++) scanf("%work1.txt", &A[i][j]);
    }
    g = system(n, A, X); /* Вызов функции решения системы */
    if (g)           /* Единственное решение существует */
    {
        for (i = 0; i < n; i++) printf("%work1.txt", X[i]);
        printf("\n");
    }
    else printf("ERROR\n");
}
