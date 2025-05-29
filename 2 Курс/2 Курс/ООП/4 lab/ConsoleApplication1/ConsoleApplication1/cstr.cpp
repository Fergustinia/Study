#include "cstr.h"

using namespace std;
char* CStr::generate(int n)
{
	char Alpha[] = "abcdefghijklmnopqrstuvwxyz";
	char* A = new char[n + 1];
	for (int i = 0; i < n; ++i) {
		A[i] = Alpha[rand() % 26];
	}
	A[n] = '\0';
	return A;
}

CStr::CStr()
{
	int n = rand() % 1 - 20;
	string = generate(n);
}

CStr::CStr(char* str)
{
	
	int n = strlen(str);
	string = new char[n + 1];
	for (int i = 0; i < n; i++)
	{
		string[i] = str[i];
	}
	string[n] = '\0';

}

CStr::CStr(int n)
{
	if (n < 20)
	{
		n = 20;
	}
	
	string = generate(n);
}

CStr::CStr(const CStr& n)
{

	int m = strlen(n.string);
	string = new char[m + 1];
	for (int i = 0; i < m; i++)
	{
		string[i] = n.string[i];
	}
	string[m] = '\0';
}
CStr::~CStr()
{
	delete[] string;
}	

CStr& CStr::operator=(CStr& a)
{
	int n = strlen(a.string);
	if (string != nullptr)
	{
		delete[] string;
	}
	string = new char[n + 1];
	for (int i = 0; i < n; i++) string[i] = a.string[i];
	string[n] = '\0';
	return *this;
	// TODO: вставьте здесь оператор return
}



CStr& CStr::operator=(char* a)
{
	int n = strlen(a);
	if (string != nullptr)
	{
		delete[] string;
	}
	string = new char[n + 1];
	for (int i = 0; i < n; i++)
	{
		string[i] = a[i];
	}
	string[n] = '\0';
	return *this;
	// TODO: вставьте здесь оператор return
}

bool CStr::operator==(CStr& a)
{
	int size = strlen(string);
	int size2 = strlen(a.string);
	if (size == size2)
	{
		for (int i = 0; i < size; i++)
		{
			if (string[i] != a.string[i])
			{
				return false;
			}
		}
		return true;
	}
	return false;
}

bool CStr::operator>(CStr& a)
{
	int size = strlen(string);
	int size2 = strlen(a.string);
	if (size >= size2)
	{
		if (size > size2) return true;
		else
		{
			for (int i = 0; i < size; i++)
			{
				if (string[i] < a.string[i])
				{
					return false;
				}
			}
			return true;
		}
	}
	return false;
}

int CStr::get_length()
{
	int n = strlen(string);
	return n;
}

ostream& operator<<(ostream& r, CStr& a)
{
	r << a << endl;
	return r;
	// TODO: вставьте здесь оператор return
}





CStrArray::CStrArray(int n)
{
	array = new CStr[n];
}

CStrArray::~CStrArray()
{

	if (array != nullptr)
	{
		delete[] array;
	}
}

CStr& CStrArray::operator[](int index)
{
	return array[index];
	// TODO: вставьте здесь оператор return
}



void CStrArray::sort_by_content()
{
	int n = sizeof(array);
	for (int i = 1; i < n; i++)
	{
		int j = i - 1;
		while (j >= 0 && array[j] > array[j + 1])
		{
			swap(array[j], array[j + 1]);
			j--;
		}
	}
	
}

void CStrArray::sort_by_length()
{
	for (int i = 0; i < n - 1; ++i) {
		for (int j = 0; j < n - i - 1; ++j) {
			if (array[j].get_length() > array[j + 1].get_length()) {
				CStr z = array[j];
				array[j] = array[j + 1];
				array[j + 1] = z;
			}
		}
	}

	
}

int CStrArray::bin_search( char* a)
{
	CStr Arr(a);
	int beg = 0, end = n - 1, mid = (end - beg) / 2;
	if (Arr == array[beg]) return beg;
	if (Arr == array[end]) return end;
	while ((array[mid] == Arr) == false)
	{
		if (end - beg <= 1)
		{
			cout << "Ёлемент не найден.";
			return -1;
		}
		if (Arr > array[mid])
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

bool CStrArray::check_sort()
{
	for (int i = 0; i < n - 1; i++)
	{
		if (array[i] > array[i + 1]) {}
		else { return false; }
	}
	return true;
}
ostream& operator<<(ostream& r, CStrArray& a)
{
	r << a << endl;
	return r;
	// TODO: вставьте здесь оператор return
}