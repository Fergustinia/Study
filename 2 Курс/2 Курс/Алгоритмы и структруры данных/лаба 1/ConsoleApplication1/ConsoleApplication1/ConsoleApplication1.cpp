#include "sort.h"
#include <iostream>
using namespace std;

int main() {
    setlocale(LC_ALL, "ru");
    const int n = 1'000'000;
    Sort<int> Sort1;
   /* cout << sizeof(n) << endl;*/
    
    int* A = new int[n];
    for (int i = 0; i < n; i++) {
        A[i] = i;
    }

    
    int* B = new int[n];
    for (int i = 0; i < n; i++) {
        B[i] = n - i;
    }

    int* ran = new int[n];
    for (int i = 0; i < n; i++) {
        ran[i] = rand();
    }

    int** pA = new int* [n];
    int** pB = new int* [n];
    int** pran = new int* [n];

    for (int i = 0; i < n; i++) {
        pA[i] = &A[i];                                                                                  
        pB[i] = &B[i];
        pran[i] = &ran[i];
    }
    /*for (int i = 0; i < n; i++) {

        A[i] = Sort1.shell_sort(A,n);
    }*/
    cout <<"Первый массив сортировка шелла кол-во сравнений " << Sort1.shellSort(pA, n) << endl;
    cout << "Второй массив сортировка шелла кол-во сравнений " << Sort1.shellSort(pB, n) << endl;
    cout <<"Третий массив сортировка шелла кол-во сравнений " << Sort1.shellSort(pran, n) << endl;
    cout << "Первый массив сортировка пирамидой кол-во сравнений " << Sort1.shellSort(pran, n) << endl;
    cout << "Второй массив сортировка пирамидой кол-во сравнений " << Sort1.heapSort(pB, n) << endl;
    cout << "Третий массив сортировка пирамидой кол-во сравнений " << Sort1.heapSort(pran, n) << endl;
    cout <<"Проверка Шелла на сортировку " << Sort1.proverka(pA, n) << endl;
    cout <<"Проверка кучи на сортировку " << Sort1.proverka(pB, n) << endl;

    delete[] A,B,ran,pA,pB,pran;
    

    return 0;
}
