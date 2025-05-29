#include "Arr.h"
#include <iostream>
using namespace std;


int main()
{
    setlocale(LC_ALL, "Russian");

 
    Array mas1;
    mas1.Scan(5);
    mas1.Print();

    Array mas2(mas1);
    cout << "Mas2" << mas2 << endl;

  
    if (mas1 == mas2)
    {
        cout << "mas1=mas2" << endl;
    }
    else
    {
        cout << "mas1!=mas2" << endl;
    }
  

    mas1 += 6;
    cout << "mas1 ";
    mas1.Print();

   
    if (mas1 == mas2)
    {
        cout << "mas1=mas2" << endl;
    }
    else
    {
        cout << "mas1!=mas2" << endl;
    }
    

    Array mas3 = mas1 + 7;
    cout << "mas3 ";
    mas3.Print();

    mas3.DelPosEq(0);
    cout << "mas3 ";
    mas3.Print();

    Array mas4 = mas3.DelPosNew(6);
    cout << "mas4 ";
    mas4.Print();

    mas1 -= 1;
  
    if (mas1 == mas4)
    {
        cout << "mas1=mas4" << endl;
    }
    else
    {
        cout << "mas1!=mas4" << endl;
    }
   

    int size;
    cout << "Введите количество элементов массива: ";
    cin >> size;

    int* b = new int[size];

    for (int i = 0; i < size; i++)
    {
        b[i] = rand() % 100;
    }
    Array mas5(b, size);
    cout << "mas5 ";
    mas5.Print();

    int mas5Max = mas5.Max();
    int mas5Min = mas5.Min();

    cout << "mas5Max=" << mas5[mas5Max] << " №" << mas5Max << endl;
    cout << "mas5Min=" << mas5[mas5Min] << " №" << mas5Min << endl;

    mas5.Sorting();
    cout << "mas5 ";
    mas5.Print();

    Array mas6 = mas1 + mas5;
    cout << "mas6 ";
    mas6.Print();

    Array mas7(4);

    cout << "mas7 " << endl;
    for (int i = 0; i < 4; i++)
    {
        cout << "Введите элемент " << i + 1 << endl;
        cin >> mas7[i];
    }

    cout << "mas7 ";
    mas7.Print();

    if (mas7.FindKey(1) != -1)
    {
        cout << "в mas7 есть '1' " << endl;
    }
    else
    {
        cout << "в mas7 нет '1' " << endl;
    }
    if (mas7.FindKey(10) != -1)
    {
        cout << "в mas7 есть '10' " << endl;
    }
    else
    {
        cout << "в mas7 нет '10' " << endl;
    }
 

    Array mas8 = mas7 - 10;
    cout << "mas8 ";
    mas8.Print();

    mas4 += mas7;
    cout << "mas4 ";
    mas4.Print();

 
    if (mas6 == mas4)
    {
        cout << "mas4=mas6" << endl;
    }
    else
    {
        cout << "mas4!=mas6" << endl;
    }
  

    mas4 = mas6;
    cout << "mas4 ";
    mas4.Print();
}
