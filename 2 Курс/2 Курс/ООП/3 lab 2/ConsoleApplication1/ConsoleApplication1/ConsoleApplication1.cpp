#include <iostream>
using namespace std;
#include "array.h" 

int main()
{
    int size;
    setlocale(LC_ALL, "Russian");
   // ------------------------------------------------
    cout << "Тип int" << endl;
    Array<int> Array1(5);
    Array1.Scan(5);
    Array1.Print();

    Array<int> Array2(Array1);
    cout << "Mas2" << Array2 << endl;
   /* Array2.Print();*/

    if (Array1 == Array2)
    {
        cout << "mas1=mas2" << endl;
    }
    else
    {
        cout << "mas1!=mas2" << endl;
    }


    Array1 += 6;
    cout << "mas1 ";
    Array1.Print();


    if (Array1 == Array2)
    {
        cout << "mas1=mas2" << endl;
    }
    else
    {
        cout << "mas1!=mas2" << endl;
    }


    Array<int> Array3 = Array1 + 7;
    cout << "mas3 ";
    Array3.Print();

    Array3.DelPosEq(0);
    cout << "mas3 ";
    Array3.Print();

    Array<int> Array4 = Array3.DelPosNew(6);
    cout << "mas4 ";
    Array4.Print();

    Array1 -= 1;

    if (Array1 == Array4)
    {
        cout << "mas1=mas4" << endl;
    }
    else
    {
        cout << "mas1!=mas4" << endl;
    }


    
    cout << "Введите количество элементов массива: ";
    cin >> size;

    int* b = new int[size];

    for (int i = 0; i < size; i++)
    {
        b[i] = rand() % 100;
    }
    Array<int> Array5(b, size);
    cout << "mas5 ";
    Array5.Print();

    int mas5Max = Array5.Max();
    int mas5Min = Array5.Min();

    cout << "mas5Max=" << Array5[mas5Max] << " №" << mas5Max << endl;
    cout << "mas5Min=" << Array5[mas5Min] << " №" << mas5Min << endl;

    Array5.Sorting();
    cout << "mas5 ";
    Array5.Print();

    Array<int> Array6 = Array1 + Array5;
    cout << "mas6 ";
    Array6.Print();

    Array<int> Array7(4);

    cout << "mas7 " << endl;
    cin >> Array7;
    /*  Array7.Scan(5);*/
    

    cout << "mas7 ";
    cout<<Array7;

    if (Array7.FindKey(1) != -1)
    {
        cout << "в mas7 есть '1' " << endl;
    }
    else
    {
        cout << "в mas7 нет '1' " << endl;
    }
    if (Array7.FindKey(10) != -1)
    {
        cout << "в mas7 есть '10' " << endl;
    }
    else
    {
        cout << "в mas7 нет '10' " << endl;
    }


    Array<int> Array8 = Array7 - 10;
    cout << "mas8 ";
    Array8.Print();

    Array4 += Array7;
    cout << "mas4 ";
    Array4.Print();


    if (Array6 == Array4)
    {
        cout << "mas4=mas6" << endl;
    }
    else
    {
        cout << "mas4!=mas6" << endl;
    }


    Array4 = Array6;
    cout << "mas4 ";
    Array4.Print();

    //------------------------------------------------
    cout << endl <<"Тип char" << endl;
   /* int f;
    cout << "Введите размерность массива" << endl;
    cin >> f;*/
    Array<char> Array21(5);
    /*Array21.Array(5);*/
    Array21.Scan(5);
    Array21.Print();

    Array<char> Array22(Array21);
    cout << "Mas2" << Array22 << endl;


    if (Array21 == Array22)
    {
        cout << "mas1=mas2" << endl;
    }
    else
    {
        cout << "mas1!=mas2" << endl;
    }


    Array21 += 6;
    cout << "mas1 ";
    Array21.Print();


    if (Array21 == Array22)
    {
        cout << "mas1=mas2" << endl;
    }
    else
    {
        cout << "mas1!=mas2" << endl;
    }


    Array <char>Array23;
    Array23= Array21 + 7;
    cout << "mas3 ";
    Array23.Print();

    Array23.DelPosEq(0);
    cout << "mas3 ";
    Array23.Print();

    Array<char> Array24 = Array23.DelPosNew(6);
    cout << "mas4 ";
    Array24.Print();

    Array21 -= 1;

    if (Array21 == Array24)
    {
        cout << "mas1=mas4" << endl;
    }
    else
    {
        cout << "mas1!=mas4" << endl;
    }


    int size2;
    cout << "Введите количество элементов массива: ";
    cin >> size2;

    char* b2 = new char[size2];

    for (int i = 0; i < size2; i++)
    {
        b2[i] = rand() % 67 -90;
    }
    Array<char> Array25(b2, size2);
    cout << "mas5 ";
    Array25.Print();

    int mas25Max = Array25.Max();
    int mas25Min = Array25.Min();

    cout << "mas5Max=" << Array25[mas25Max] << " №" << mas25Max << endl;
    cout << "mas5Min=" << Array25[mas25Min] << " №" << mas25Min << endl;

    Array25.Sorting();
    cout << "mas5 ";
    Array25.Print();

    Array<char> Array26 = Array21 + Array25;
    cout << "mas6 ";
    Array26.Print();

    Array <char>Array27(4); 
    int h;
    cout << "mas7 " << endl;
    cout << "Введите размерность массива" << endl;
    cin >> h;
    cout << "mas7 ";
    /*Array27.ArrayChar(h);*/
    Array27.Print();

    if (Array27.FindKey(1) != -1)
    {
        cout << "в mas7 есть '1' " << endl;
    }
    else
    {
        cout << "в mas7 нет '1' " << endl;
    }
    if (Array27.FindKey(10) != -1)
    {
        cout << "в mas7 есть '10' " << endl;
    }
    else
    {
        cout << "в mas7 нет '10' " << endl;
    }


    Array <char>Array28 = Array27 - 10;
    cout << "mas8 ";
    Array28.Print();

    Array24 += Array27;
    cout << "mas4 ";
    Array24.Print();


    if (Array26 == Array24)
    {
        cout << "mas4=mas6" << endl;
    }
    else
    {
        cout << "mas4!=mas6" << endl;
    }


    Array24 = Array26;
    cout << "mas4 ";
    Array24.Print();
    //------------------------------------------------
    cout << endl << "Тип float" << endl;
    Array<float> Array31(5);
    Array31.Scan(5);
    Array31.Print();

    Array<float> Array32(Array31);
    cout << "Mas2" << Array32 << endl;


    if (Array31 == Array32)
    {
        cout << "mas1=mas2" << endl;
    }
    else
    {
        cout << "mas1!=mas2" << endl;
    }


    Array31 += 6;
    cout << "mas1 ";
    Array31.Print();


    if (Array31 == Array32)
    {
        cout << "mas1=mas2" << endl;
    }
    else
    {
        cout << "mas1!=mas2" << endl;
    }


    Array <float>Array33 = Array31 + 7;
    cout << "mas3 ";
    Array33.Print();

    Array33.DelPosEq(0);
    cout << "mas3 ";
    Array33.Print();

    Array<float> Array34 = Array33.DelPosNew(6);
    cout << "mas4 ";
    Array34.Print();

    Array31 -= 1;

    if (Array31 == Array34)
    {
        cout << "mas1=mas4" << endl;
    }
    else
    {
        cout << "mas1!=mas4" << endl;
    }



    cout << "Введите количество элементов массива: ";
    cin >> size;

    float* b3 = new float[size];

    for (int i = 0; i < size; i++)
    {
        b3[i] = rand() % 100;
    }
    Array<float> Array35(b3, size);
    cout << "mas5 ";
    Array35.Print();

    int mas35Max = Array35.Max();
    int mas35Min = Array35.Min();

    cout << "mas5Max=" << Array35[mas35Max] << " №" << mas35Max << endl;
    cout << "mas5Min=" << Array35[mas35Min] << " №" << mas35Min << endl;

    Array35.Sorting();
    cout << "mas5 ";
    Array35.Print();

    Array<float> Array36 = Array31 + Array35;
    cout << "mas6 ";
    Array36.Print();

    Array <float>Array37(4);

    cout << "mas7 " << endl;
    cin >> Array37;
    cout << "mas7 ";
    cout<<Array37;

    if (Array37.FindKey(1) != -1)
    {
        cout << "в mas7 есть '1' " << endl;
    }
    else
    {
        cout << "в mas7 нет '1' " << endl;
    }
    if (Array37.FindKey(10) != -1)
    {
        cout << "в mas7 есть '10' " << endl;
    }
    else
    {
        cout << "в mas7 нет '10' " << endl;
    }


    Array <float>Array38 = Array37 - 10;
    cout << "mas8 ";
    Array38.Print();

    Array34 += Array37;
    cout << "mas4 ";
    Array34.Print();


    if (Array36 == Array34)
    {
        cout << "mas4=mas6" << endl;
    }
    else
    {
        cout << "mas4!=mas6" << endl;
    }


    Array34 = Array36;
    cout << "mas4 ";
    Array34.Print();
    return 0;
}




