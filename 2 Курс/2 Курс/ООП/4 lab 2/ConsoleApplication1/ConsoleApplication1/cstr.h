#pragma once
#include <iostream>
using namespace std;

class CStr
{
	char* string; 
	char* generate(int length); 
public:
	CStr();
	CStr(char* str); //конструктор по заданному массиву
	CStr(int length);
	CStr(const CStr& obj); //конструктор копирования
	~CStr(); //деструктор
	CStr& operator=(CStr& obj);
	CStr& operator=(char* str);
	bool operator > (CStr& obj);
	bool operator == (CStr& obj);
	int get_len();
	friend ostream& operator<<(ostream& stream, CStr& obj);
};

class CStrArray
{
	CStr* arr;//создаем указатель на тип данных CStr
	int n;
public:
	CStrArray(int leng);
	~CStrArray();
	CStr& operator[](int index);
	void sortcontent();
	void sortlength();
	int binsearch(char* str);
	bool checksort();
	friend ostream& operator<<(ostream& stream, CStrArray& obj);
};
