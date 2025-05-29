#include<iostream>
using namespace std;
class CStr
{
	char* string;
	char* generate(int n);
public:
	CStr();
	CStr(char* str);
	CStr(int n);
	CStr(const CStr& n);
	~CStr();
	CStr& operator=(CStr& a); // a = b
	CStr& operator=(char* a); //	
	bool operator==(CStr& a);
	bool operator>(CStr& a);
	int get_length();
	friend ostream& operator<<(ostream& stream, CStr& a);
};
class CStrArray
{
	CStr* array;
	int n;
public:
	CStrArray(int n);
	~CStrArray();
	CStr& operator[](int index);
	void sort_by_content();
	void sort_by_length(); // сортировка по строкам
	int bin_search(char* a); //Почему int когда bool, а так же, нужны ли операторы сравнения
	bool check_sort();
	friend ostream& operator<<(ostream& stream, CStrArray& a);
};
