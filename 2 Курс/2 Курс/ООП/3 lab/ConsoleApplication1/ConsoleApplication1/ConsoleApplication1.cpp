#include <iostream>
using namespace std;
//#include "lab3.h" 

//#pragma once
//#include <iostream>
//using namespace std;

template<typename T>
class Array {
private:
    T* a;
    int n;

    void ShiftLeft(int pos);

public:
    Array();
    Array(int m);
    Array(T* b, int m);
    Array(const Array<T>& x);
    Array& operator=(const Array& x);
    ~Array();

    void Scan(int m);
    void Print();
    T& operator[](int i);
    int FindKey(T key);

    Array& operator+=(T key);
    Array operator+(T key);
    Array& operator+=(const Array& x);
    Array operator+(const Array& x);
    Array& operator-=(T key);
    Array operator-(T key);

    Array& DelPosEq(int pos);
    Array DelPosNew(int pos);

    bool operator==(Array& x);
    bool operator!=(Array& x);

    int Max();
    int Min();
    void Sorting();

    friend ostream& operator<<(ostream& r, Array <T>& x);
    friend istream& operator>>(istream& r, Array <T>& x);
};

template<typename T>
Array<T>::Array() {
    n = 0;
    a = nullptr;
}

template<typename T>
Array<T>::Array(int m) {
    n = m;
    a = nullptr;
}

template<typename T>
Array<T>::Array(T* b, int m) {
    n = m;
    a = new T[n];
    for (int i = 0; i < n; i++) {
        a[i] = b[i];
    }
}

template<typename T>
Array<T>::Array(const Array<T>& x) {
    n = x.n;
    a = new T[n];
    for (int i = 0; i < n; i++) {
        a[i] = x.a[i];
    }
}

template<typename T>
Array<T>& Array<T>::operator=(const Array& x) {
    if (this == &x) return *this;
    if (a != nullptr) {
        delete[] a;
    }
    n = x.n;
    a = new T[n];
    for (int i = 0; i < n; i++) {
        a[i] = x.a[i];
    }
    return *this;
}

template<typename T>
Array<T>::~Array() {
    if (a != nullptr) {
        delete[] a;
    }
}

template<typename T>
void Array<T>::Scan(int m) {
    if (a != nullptr) {
        delete[] a;
    }
    n = m;
    a = new T[n];
    for (int i = 0; i < n; i++) {
        cout << "Введите элемент под номером " << i + 1 << endl;
        cin >> a[i];
    }

}

template<typename T>
void Array<T>::Print() {
    cout << "" << endl;
    for (int i = 0; i < n; i++) {
        cout << "Элемент номер " << i + 1 << " = " << a[i] << endl;
    }
}

template<typename T>
T& Array<T>::operator[](int i) {
    return a[i];
}

template<typename T>
int Array<T>::FindKey(T key) {
    for (int i = 0; i < this->n; i++) {
        if (key == a[i]) {
            return i;
        }
    }
    return -1;
}

template<typename T>
Array<T>& Array<T>::operator+=(T key) {
    T* time = new T[this->n + 1];
    for (int i = 0; i < n; i++) {
        time[i] = a[i];
    }
    time[n] = key;
    if (a != nullptr) {
        delete[] a;
    }
    a = time;
    this->n + 1;
    return *this;
}

template<typename T>
Array<T> Array<T>::operator+(T key) {
    Array<T> time(*this);
    time += key;
    return time;
}

template<typename T>
Array<T>& Array<T>::operator+=(const Array& x) {
    T* time = new T[n + x.n];
    for (int i = 0; i < n; i++) {
        time[i] = a[i];
    }
    for (int i = 0; i < x.n; i++) {
        time[n + i] = x.a[i];
    }
    if (a != nullptr) {
        delete[] a;
    }
    a = time;
    n += x.n;
    return *this;
}

template<typename T>
Array<T> Array<T>::operator+(const Array& x) {
    Array<T> time(*this);
    time += x;
    return time;
}

template<typename T>
Array<T>& Array<T>::operator-=(T key) {
    int del = FindKey(key);
    if (del != -1)
    {
        ShiftLeft(del);
    }
    return *this;
}

template<typename T>
Array<T> Array<T>::operator-(T key) {
    Array<T> time(*this);
    time -= key;
    return time;
}

template<typename T>
Array<T>& Array<T>::DelPosEq(int pos) {
    ShiftLeft(pos);
    return *this;
}

template<typename T>
Array<T> Array<T>::DelPosNew(int pos) {
    if (pos < 0) {
        pos = this->n + pos;
    }
    Array<T> time(*this);
    time.DelPosEq(pos);
    return *this;
}
template<typename T>
bool Array<T>::operator==(Array& x) {
    if (n != x.n) {
        return false;
    }
    for (int i = 0; i < n; i++) {
        if (a[i] != x.a[i]) {
            return false;
        }
    }
    return true;
}

template<typename T>
bool Array<T>::operator!=(Array& x) {
    return !(*this == x);
}

template<typename T>
int Array<T>::Max() {
    int max = a[0];
    int pos = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] > max) {
            max = a[i];
            pos = i;
        }
    }
    return pos;
}

template<typename T>
int Array<T>::Min() {
    int min = a[0];
    int pos = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] < min) {
            min = a[i];
            pos = i;
        }
    }
    return pos;
}

template<typename T>
void Array<T>::Sorting() {
    for (int i = 0; i < n - 1; ++i) {
        for (int j = 0; j < n - i - 1; ++j) {
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
            }
        }
    }
}

template<typename T>
void Array<T>::ShiftLeft(int pos) {
    for (int i = pos; i < n - 1; i++) {
        a[i] = a[i + 1];
    }
    T* time = new T[n - 1];
    for (int i = 0; i < n - 1; i++) {
        time[i] = a[i];
    }
    delete[] a;
    a = time;
    n -= 1;
}

template<typename T>
ostream& operator<<(ostream& r, Array<T>& x) {
    for (int i = 0; i < x.n; ++i) {
        r << x.a[i] << " ";
    }
    return r;
}

template<typename T>
istream& operator>>(istream& r, Array<T>& x) {
    x.Scan(x.n);
    return r;
}




int main()
{
    setlocale(LC_ALL, "Russian");
    //------------------------------------------------
    cout <<  "Тип int" << endl;
    Array<int> Array1(5);
    Array1.Scan(5);
    Array1.Print();
  
    Array<int> Array2(Array1);
    cout << "Mas2" << Array2 << endl;


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


    int size;
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
    for (int i = 0; i < 4; i++)
    {
        cout << "Введите элемент " << i + 1 << endl;
        cin >> Array7[i];
    }

    cout << "mas7 ";
    Array7.Print();

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

    ////------------------------------------------------
    //cout << endl <<"Тип char" << endl;
    //Array<char> Array21(5);
    //Array21.Scan(5);
    //Array21.Print();

    //Array<char> Array22(Array21);
    //cout << "Mas2" << Array22 << endl;


    //if (Array21 == Array22)
    //{
    //    cout << "mas1=mas2" << endl;
    //}
    //else
    //{
    //    cout << "mas1!=mas2" << endl;
    //}


    //Array21 += 6;
    //cout << "mas1 ";
    //Array21.Print();


    //if (Array21 == Array22)
    //{
    //    cout << "mas1=mas2" << endl;
    //}
    //else
    //{
    //    cout << "mas1!=mas2" << endl;
    //}


    //Array <char>Array23 = Array21 + 7;
    //cout << "mas3 ";
    //Array23.Print();

    //Array23.DelPosEq(0);
    //cout << "mas3 ";
    //Array23.Print();

    //Array<char> Array24 = Array23.DelPosNew(6);
    //cout << "mas4 ";
    //Array24.Print();

    //Array21 -= 1;

    //if (Array21 == Array24)
    //{
    //    cout << "mas1=mas4" << endl;
    //}
    //else
    //{
    //    cout << "mas1!=mas4" << endl;
    //}


    //int size2;
    //cout << "Введите количество элементов массива: ";
    //cin >> size2;

    //char* b2 = new char[size2];

    //for (int i = 0; i < size2; i++)
    //{
    //    b2[i] = rand() % 100;
    //}
    //Array<char> Array25(b2, size2);
    //cout << "mas5 ";
    //Array25.Print();

    //int mas25Max = Array25.Max();
    //int mas25Min = Array25.Min();

    //cout << "mas5Max=" << Array25[mas5Max] << " №" << mas5Max << endl;
    //cout << "mas5Min=" << Array25[mas5Min] << " №" << mas5Min << endl;

    //Array25.Sorting();
    //cout << "mas5 ";
    //Array25.Print();

    //Array<char> Array26 = Array21 + Array25;
    //cout << "mas6 ";
    //Array26.Print();

    //Array <char>Array27(4);

    //cout << "mas7 " << endl;
    //for (int i = 0; i < 4; i++)
    //{
    //    cout << "Введите элемент " << i + 1 << endl;
    //    cin >> Array27[i];
    //}

    //cout << "mas7 ";
    //Array27.Print();

    //if (Array27.FindKey(1) != -1)
    //{
    //    cout << "в mas7 есть '1' " << endl;
    //}
    //else
    //{
    //    cout << "в mas7 нет '1' " << endl;
    //}
    //if (Array27.FindKey(10) != -1)
    //{
    //    cout << "в mas7 есть '10' " << endl;
    //}
    //else
    //{
    //    cout << "в mas7 нет '10' " << endl;
    //}


    //Array <char>Array28 = Array27 - 10;
    //cout << "mas8 ";
    //Array28.Print();

    //Array24 += Array27;
    //cout << "mas4 ";
    //Array24.Print();


    //if (Array26 == Array24)
    //{
    //    cout << "mas4=mas6" << endl;
    //}
    //else
    //{
    //    cout << "mas4!=mas6" << endl;
    //}


    //Array24 = Array26;
    //cout << "mas4 ";
    //Array24.Print();
    ////------------------------------------------------
    //cout << endl << "Тип float" << endl;
    //Array<float> Array31(5);
    //Array31.Scan(5);
    //Array31.Print();

    //Array<float> Array32(Array31);
    //cout << "Mas2" << Array32 << endl;


    //if (Array31 == Array32)
    //{
    //    cout << "mas1=mas2" << endl;
    //}
    //else
    //{
    //    cout << "mas1!=mas2" << endl;
    //}


    //Array31 += 6;
    //cout << "mas1 ";
    //Array31.Print();


    //if (Array31 == Array32)
    //{
    //    cout << "mas1=mas2" << endl;
    //}
    //else
    //{
    //    cout << "mas1!=mas2" << endl;
    //}


    //Array <float>Array33 = Array31 + 7;
    //cout << "mas3 ";
    //Array33.Print();

    //Array33.DelPosEq(0);
    //cout << "mas3 ";
    //Array33.Print();

    //Array<float> Array34 = Array33.DelPosNew(6);
    //cout << "mas4 ";
    //Array34.Print();

    //Array31 -= 1;

    //if (Array31 == Array34)
    //{
    //    cout << "mas1=mas4" << endl;
    //}
    //else
    //{
    //    cout << "mas1!=mas4" << endl;
    //}



    //cout << "Введите количество элементов массива: ";
    //cin >> size;

    //float* b3 = new float[size];

    //for (int i = 0; i < size; i++)
    //{
    //    b3[i] = rand() % 100;
    //}
    //Array<float> Array35(b3, size);
    //cout << "mas5 ";
    //Array35.Print();

    //int mas35Max = Array35.Max();
    //int mas35Min = Array35.Min();

    //cout << "mas5Max=" << Array35[mas5Max] << " №" << mas5Max << endl;
    //cout << "mas5Min=" << Array35[mas5Min] << " №" << mas5Min << endl;

    //Array35.Sorting();
    //cout << "mas5 ";
    //Array35.Print();

    //Array<float> Array36 = Array31 + Array35;
    //cout << "mas6 ";
    //Array36.Print();

    //Array <float>Array37(4);

    //cout << "mas7 " << endl;
    //for (int i = 0; i < 4; i++)
    //{
    //    cout << "Введите элемент " << i + 1 << endl;
    //    cin >> Array37[i];
    //}

    //cout << "mas7 ";
    //Array37.Print();

    //if (Array37.FindKey(1) != -1)
    //{
    //    cout << "в mas7 есть '1' " << endl;
    //}
    //else
    //{
    //    cout << "в mas7 нет '1' " << endl;
    //}
    //if (Array37.FindKey(10) != -1)
    //{
    //    cout << "в mas7 есть '10' " << endl;
    //}
    //else
    //{
    //    cout << "в mas7 нет '10' " << endl;
    //}


    //Array <float>Array38 = Array37 - 10;
    //cout << "mas8 ";
    //Array38.Print();

    //Array34 += Array37;
    //cout << "mas4 ";
    //Array34.Print();


    //if (Array36 == Array34)
    //{
    //    cout << "mas4=mas6" << endl;
    //}
    //else
    //{
    //    cout << "mas4!=mas6" << endl;
    //}


    //Array34 = Array36;
    //cout << "mas4 ";
    //Array34.Print();
    return 0;
}




