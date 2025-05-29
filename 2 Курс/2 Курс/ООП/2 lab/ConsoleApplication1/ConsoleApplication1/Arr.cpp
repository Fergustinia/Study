#include "Arr.h"
#include <iostream>
using namespace std;

Array::Array()
{
	 n = 0;
	 a = nullptr;

}

Array::Array(int m)
{
	n = m;
	a = nullptr;
}

Array::Array(int *b, int m)
{
	n = m;
	a = new int [n];
	for (int i = 0; i < n; i++)
	{
		a[i] = b[i];
	}
}

Array::Array(const Array& x)
{
	n = x.n;
	a = new int[n];
	for (int i = 0; i < n; i++)
	{
		a[i] = x.a[i];
	}
}

Array& Array::operator=(const Array& x)
{
	if (this == &x) return *this;
	if (a != nullptr) {
		delete[] a;
	}
	n = x.n;
	a = new int[n];
	for (int i = 0; i < n; i++)
	{
		a[i] = x.a[i];
	}
	return *this;
	// TODO: вставьте здесь оператор return
}

Array::~Array()
{
	if (a != nullptr) {
		delete[] a;
	}
}

void Array::Scan(int m)
{
	if (a != nullptr) {
		delete[] a;
	}
	n = m;
	a = new int [n];
	cout << "¬ведите массив размерностью "<<this->n << endl;
	for (int i = 0; i < n; i++)
	{
		cout << "¬ведите число номер " <<i+1 << endl;
		cin >> a[i];
	}
}

void Array::Print()
{
	/*if (a != nullptr)
	{
		delete[]a;
	}*/
	cout<<"" << endl;
	for(int i= 0;i<n;i++)
	{
		cout << "„исло номер " << i << a[i] << endl;
	}
}

int& Array::operator[](int i)
{
	return a[i];
	// TODO: вставьте здесь оператор return
}

int Array::FindKey(int key)
{
	for (int i = 0; i < this->n; i++)
	{
		if (key == a[i]) {
			return i;
		}
		else
		{

			return -1;
		}
	}
}

Array& Array::operator+=(int key)
{
	int* time = new int[this->n + 1];
	for (int i=0; i < n + 1; i++)
	{
		time[i] = a[i];
	}
	time[n] = key;
	if (a != nullptr)
	{
		delete[] a;
	}
	a = time;
	this->n + 1;
	return *this;
	// TODO: вставьте здесь оператор return
}

Array Array::operator+(int key)
{
	Array time(*this);
	time += key;
	return time;
}

Array& Array::operator+=(Array x)
{
	int* time = new int[n + x.n];
	for (int i = 0; i < n; i++)
	{
		time[i] = a[i];
	}
	for (int i = 0; i < x.n; i++)
	{
		time[n + i] = x.a[i];
	}
	if (a != nullptr)
	{
		delete[] a;
	}
	a = time;
	n += x.n;
	return *this;
	// TODO: вставьте здесь оператор return
}

Array Array::operator+(const Array x)
{
	Array time(*this);
	time += x;
	return time;
}

Array& Array::operator-=(int key)
{
	int del = FindKey(key);
	del -= key;
	return *this;
	// TODO: вставьте здесь оператор return
}

Array Array::operator-(int key)
{
	Array time(*this);
	time -= key;
	return time;
}

Array& Array::DelPosEq(int pos)
{
	ShiftLeft(pos);
	return *this;
	// TODO: вставьте здесь оператор return
}

Array Array::DelPosNew(int pos)
{
	if (pos < 0)
	{
		pos = this->n + pos;
	}
	Array time(*this);
	time.DelPosNew(pos);
	return *this;
}

bool Array::operator==(Array& x)
{
	if (n != x.n)
	{
		return false;
	}
	for (int i = 0; i < n; i++)
	{
		if (a[i] == x.a[i])
		{
			return true;
		}
	}
	return true;
}

bool Array::operator!=(Array& x)
{

	return !(*this !=x);
}

int Array::Max()
{
	int max = a[0];
	int pos = 0;
	for (int i = 0; i < n; i++)
	{
		if (a[i] > max)
		{
			max=a[i];
			pos = i;
		}
	}
	return pos;
}

int Array::Min()
{
	int min = a[0];
	int pos = 0;
	for (int i = 0; i < n; i++)
	{
		if(a[i]<min)
		{
			min = a[i];
			pos=i;
		}
	}

	return pos;
}

void Array::Sorting()
{
	for (int i = 0; i < n - 1; ++i) {
		for (int j = 0; j < n - i - 1; ++j) {
			if (a[j] > a[j + 1]) {
				swap(a[j], a[j + 1]);
			}
		}
	}
}

void Array::ShiftLeft(int pos)
{
	for (int i = 0; i < pos; i++)
	{
		a[i] = a[i + 1];
	}
	int* time = new int[n - 1]; // —оздаем временный массив размерностью n-1 и присваиваем значени€ массива n;
	for (int i = 0; i < n - 1; i++)
	{
		time[i] = a[i];
	}
	if (a != nullptr)
	{
		delete[] a;
	}
	a = time;
	n -= 1;
}

ostream& operator<<(ostream& r, Array& x)
{
	for (int i = 0; i < x.n; ++i) {
		r << x.a[i] << " ";
	}
	return r;
	// TODO: вставьте здесь оператор return
}

istream& operator>>(istream& r, Array& x)
{
	x.Scan(x.n);
	return r;
	// TODO: вставьте здесь оператор return
}
