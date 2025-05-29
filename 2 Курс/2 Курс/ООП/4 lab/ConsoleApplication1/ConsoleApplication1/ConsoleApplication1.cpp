#include"cstr.h"
#include<iostream>
#include<string>
using namespace std;
int main()
{
	setlocale(LC_ALL, "ru");
	const int n = 3; //размерность массива 
	CStr string;
	cout <<"Первый массив" << string;
	CStr b;
	CStr c;
	CStrArray array(3);
	/*array[0] = string;
	array[1] = b;
	array[2] = c;
	cout << array<<endl;*/

}