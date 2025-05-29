#include"SList.h"
#include<iostream>
#include<ctime>
using namespace std;
int main()
{
	srand(time(nullptr));
	LC_ALL(setlocale, "RU");
	const int n = 10;
	char a;
	const char charset[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	char* randomMassiv = new char[n + 1];
	for (int i = 0; i < n; i++) { randomMassiv[i] = charset[rand() & sizeof(charset) - 1]; 
	}
	randomMassiv[n] = '\0';
	cout << randomMassiv<<endl << endl;
SList Massiv;
	Massiv.print(randomMassiv);
	
}
