#include"cstr.h"
#include<iostream>

using namespace std;
int main()
{
	setlocale(LC_ALL, "ru");
	const int n = 10; //размерность массива 
	CStr string;
	cout << "Первый массив " << string<<endl;
	CStr b(n);
	cout << "Второй массив " << b << endl;
	CStr c(4);
	cout << "Третий массив " << c << endl;
	CStrArray array(3);
	array[0] = string;
	array[1] = b;
	array[2] = c;
	char* time = new char[5];
	const char* h = "fdxf";
	for (int i = 0; i < 5; i++)
	{
		time[i] = h[i];
	}
	int len = strlen(h);
	time[len] = '\0';
	cout <<"Массив time " << time<<endl;
	cout <<"Массив array = " << array << endl;
	array.sortlength();
	cout << "Сортированный массив 1 = " << array << endl;
	CStrArray array2(10);
	array2[0] = b;
	array2[1] = string;
	array2[2] = time;
	cout <<"Массив array 2 = " << array2 << endl;
	array2.sortcontent();
	cout << "Сортированный массив 2 = " << array2 << endl;
	if (array.binsearch(time) == -1)
	{
		cout << "Не нашел = "<<time << endl;
	}
	else
	{
		cout << time << " Нашел под номером = " << array.binsearch(time)+1 << endl;
	}
	delete[]time,h;
	

}