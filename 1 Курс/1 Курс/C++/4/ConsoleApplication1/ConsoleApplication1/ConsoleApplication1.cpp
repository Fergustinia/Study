#include <iostream>
//#include <ctime>
#include <cassert>
#include <stdlib.h>
#include <time.h>
using namespace std;
int mass4[18];
int mass1[100];
int mass2[18];
void pack(int mass3[])                  // Упаковка
{
    for (int i = 0; i < 101; i++)
    {
        mass4[mass3[i]]++;
    }
}
void unpack(int mass4[18], int mass1[])             //Распаковка
{
    int j = 0;
    for (int i = 0; i < 18; i++)
    {
        while (mass4[i] > 0)
        {
            mass1[j] = i;
            j++;
            mass4[i]--;
        }
    }
}
int main()                        // Заполнение массива, сортировка, подсчет кол-ва цифр в массиве
{
    setlocale(LC_ALL, "Russian");
    cout << "Исходный массив" << endl;
    for (int i = 0; i < 100; i++)
    {
        int n = rand()%18+0;
        mass1[i] = n;
        /*cout << "mass1[" << i+1 << "] = " << mass1[i] << endl;*/
        cout << mass1[i]<<" ";
    }
    cout << endl;
    cout << "Количество цифр в массиве" << endl;
    for (int i = 0; i < 100; i++)
    {
        int j;
        for (j = i; j > 0 && mass1[j - 1] > mass1[j]; j--)
        {
            //swap(mass1[j - 1], mass1[j]);
            int x = mass1[j];
            mass1[j] = mass1[j-1];
            mass1[j-1] = x;
        }
    }
    for (int j = 0; j < 18; j++)
    {
        mass2[j] = 0;
        for (int i = 0; i < 100; i++)
        {
            if (mass1[i] == j)
            {
                mass2[j]++;
            }
        }
    }
    for (int i = 0; i < 18; i++)
    {
        /*cout <<"mass2[" << i << "] = " << mass2[i] << endl;*/
        cout << mass2[i] << " ";
    }
    cout << endl;
    cout << "Сортированный массив" << endl;
    for (int i = 0; i < 100; i++)
    {
       /* cout << "mass1[" << i+1 << "] = " << mass1[i]<<endl;*/
        cout << mass1[i] << " ";
    }
    cout << endl;
    cout << "Ура оно работает!!" << endl;
}           
