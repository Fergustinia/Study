//#pragma once
#include <iostream>
using namespace std;

template<typename T>
class Array {
private:
    T* a;
    int n;

    void ShiftLeft(int pos);//Сдвиг влево на 1 элемент

public:
    Array(); // Конструктор по умолчанию. Создает объект массива без элементов.
    Array(int m);// Конструктор с целочисленным аргументом. Создает массив размера m.
   /* int ArrayChar(int n);*/
    Array(T* b, int m);// Конструктор с аргументом, инициализирующий массив значениями из массива b.
    Array(const Array<T>& x); //  Конструктор копирования.
    Array& operator=(const Array& x);// Оператор присвоения.
    ~Array();//детруктор

    void Scan(int m);
    void Print();
    T& operator[](int i);
    int FindKey(T key);

    Array& operator+=(T key); //Добавление элемента key в конец массива.
    Array operator+(T key); //Создание нового массива, включающего элемент key в конец.
    Array& operator+=(const Array& x);//Добавление всех элементов другого массива в конец текущего.
    Array operator+(const Array& x);// Создание нового массива, объединяя элементы текущего и другого массива.
    Array& operator-=(T key);// Удаление элемента key из массива.
    Array operator-(T key);// Создание нового массива, исключая элемент key.

    Array& DelPosEq(int pos);// Удаление элемента по позиции pos из массива.
    Array DelPosNew(int pos);// Создание нового массива без элемента по позиции pos.

    bool operator==(Array& x);// Проверка на равенство массивов.
    bool operator!=(Array& x);// Проверка на неравенство массивов.

    int Max();
    int Min();
    void Sorting();

    friend ostream& operator<<(ostream& r, Array& x) {
        x.Print();
        return r;
    }; 
   
    friend istream& operator>>(istream& r, Array& x) {
        int b;
        cout << "Введите длину массива:" << endl;
        r >> b; 
        x.Scan(b);
        return r;
    };
};

template<typename T>
Array<T>::Array() {
    n = 0;
    a = nullptr;
}

template<typename T>
Array<T>::Array(int m) {
    n = m;
    a = new T[m];
}

//template<typename T>
//int Array<T>::ArrayChar(int n)
//{
//    int m = n;
//    char t;
//    a = nullptr;
//    a = new T[m];
//    for(int i =0;i<m;i++)
//    {
//        cout << "Введите символ #" << i + 1 << endl;
//        cin >> t;
//        a[i] = t;
//    }
//    return 0;
//}

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
    cout << endl;
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
    this->n += 1;
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
Array<T>& Array<T>::DelPosEq(int pos) {   //sanya=sanya.DelPosEq(3)
    ShiftLeft(pos);
    return *this;
}

template<typename T>
Array<T> Array<T>::DelPosNew(int pos) {
    if (pos < 0) {
        pos = this->n + pos;
    }
    Array<T> time(*this);                  //Fedia = sanya.DelPosNew(3);
    time.DelPosEq(pos);
    return time;
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


