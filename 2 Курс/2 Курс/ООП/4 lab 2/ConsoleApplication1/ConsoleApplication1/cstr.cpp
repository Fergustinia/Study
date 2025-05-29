#include "cstr.h"
#include <algorithm>


char* CStr::generate(int length)
{
	if (length > 20 || length <= 0) length = 20;
	string = new char[length + 1];
	for (int i = 0; i < length; i++)
		string[i] = 'a' + rand() % 26;
	string[length] = '\0';
	return string;
}

CStr::CStr()
{
	int n = rand() % 20 + 1;
	string = generate(n);
}
CStr::CStr(char* str)
{
	int n = strlen(str);
	string = new char[n + 1];//выделяет память n+1 
	for (int i = 0; i < n; i++)
	{
		string[i] = str[i];
	}
	string[n] = '\0';
}
CStr::CStr(int length)
{
	if (length > 20 || length <= 0) length = 20;
	string = generate(length);
}
CStr::CStr(const CStr& obj)
{
	int n = strlen(obj.string);
	string = new char[n + 1];
	for (int i = 0; i < n; i++)
	{
		string[i] = obj.string[i];
	}
	string[n] = '\0';
}

CStr::~CStr()
{
	if (string != nullptr)
	{
		delete[] string;
	}
}

CStr& CStr::operator=(CStr& obj)
{
	int n = strlen(obj.string);   //a=b
	if (string != nullptr)
	{
		delete[] string;
	}
	string = new char[n + 1];
	for (int i = 0; i < n; i++)
	{
		string[i] = obj.string[i];
	}
	string[n] = '\0';
	return *this;
}

CStr& CStr::operator=(char* str)
{

	int n = strlen(str);
	if (string != nullptr)
	{
		delete[] string;
	}
	string = new char[n + 1];
	for (int i = 0; i < n; i++)
	{
		string[i] = str[i];
	}
	string[n] = '\0';
	return *this;

}

bool CStr::operator>(CStr& obj)    //strcmp(string, obj.string);
{
	return strcmp(string, obj.string)>0;
}

bool CStr::operator==(CStr& obj)
{

	return strcmp(string, obj.string)==0;
}

int CStr::get_len()
{
	int size = strlen(string);
	return size;
}

ostream& operator<<(ostream& os, CStr& obj)
{
	int size = strlen(obj.string);
	for (int i = 0; i < size; i++) {
		os << obj.string[i];
	}
	return os;
}





CStrArray::CStrArray(int leng)
{
	n = leng;
	arr = new CStr[n];
}

CStrArray::~CStrArray()
{
	if (arr != nullptr)
	{
		delete[] arr;
	}
}

CStr& CStrArray::operator[](int index)
{
	return arr[index];
}

void CStrArray::sortcontent()// по длине строк
{
	for (int i = 0; i < n - 1; ++i) {
		for (int j = 0; j < n - i - 1; ++j) {
			if (arr[j] > arr[j + 1]) {
				CStr time = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = time;
			}
		}
	}

}

void CStrArray::sortlength()//по содержимому строк
{
	for (int i = 0; i < n - 1; ++i) {
		for (int j = 0; j < n - i - 1; ++j) {
			if (arr[j].get_len() > arr[j + 1].get_len()) {
				CStr time  = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = time;
			}
		}
	}
}

int CStrArray::binsearch(char* str)
{
	CStr A(str);
	int beg = 0, end = n - 1, mid = (end - beg) / 2;
	if (A == arr[beg]) return beg;
	if (A == arr[end]) return end;
	while ((arr[mid] == A) == false)
	{
		if (end - beg <= 1)
		{
			return -1;
		}
		if (A > arr[mid])
		{
			beg = mid;
		}
		else
		{
			end = mid;
		}
		mid = beg + ((end - beg) / 2);
	}
	return mid;
}

bool CStrArray::checksort()
{
	for (int i = 0; i < n - 1; i++)
	{
		if (arr[i] > arr[i + 1]) {}
		else { return false; }
	}
	return true;
}
ostream& operator<<(ostream& os, CStrArray& obj)
{
	int n = sizeof(obj);
	if (n < 50)
	{
		for (int i = 0; i < obj.n; i++) {
			os << obj.arr[i] << ' ';
		}
		return os;
	}
	else
		return cout << "Массив больше 50 " << endl;
}