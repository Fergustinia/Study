#include<iostream>
using namespace std;
class SList
{
private:
	struct string
	{
		char* data;
		string* next;
		string(char* str) :data(str), next(nullptr) {}
	};
	string* head;
	string* tail;
	char* slist;
public:
	SList();
	~SList();
	void print(char* a)
	{
		cout << a << endl;
	}
	bool check();
	void add();
	void merge();
	
};
class HashTable
{
private:
	SList* table;
public:
	HashTable();
	~HashTable();
	int HashFunction(int key);
	int Hash_add(int key,SList);
	int Hashmerge();
};