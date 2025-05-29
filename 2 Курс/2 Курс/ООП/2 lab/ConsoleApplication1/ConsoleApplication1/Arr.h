#pragma once
#include <iostream>
using namespace std;
class Array
{
	void ShiftLeft(int pos);		 //����� �����, ������� � ������� pos+1
	int* a;
	int n;
public:
	Array(); 				//����������� �� ���������
	Array(int m);
	//����������� � ����� ���������� (m � ����� ��������� � �������)

	Array(int* b, int m);	//����������� � ����������, 
	//m � ����� ��������� � ������� b

	Array(const Array & x);					//����������� �����������
	Array& operator = (const Array & x);    	//�������� ����������
	~Array();								//����������

	void Scan(int m);				//���� ������� �� m �����
	void Print();					//����� �������
	int& operator [] (int i);			//���������� �������� �� �������
	int FindKey(int key);			//����� �������� key � ������� 
	//(���������� ������ key ��� -1)

	Array& operator += (int key);
	//��������� key � ����� ������� a
	Array operator + (int key);
	//��������� ������ b = a + key 
	//(key ����������� � �����)
	Array& operator += (Array x);
	//���������� ������� � ����� ������� a
	Array operator + (const Array x);
	//��������� ������ y=a+x
	Array& operator -= (int key);
	//�������� �������� key
	Array operator - (int key);
	//��������� ����� ������ b = a - key

	Array& DelPosEq(int pos);
	//�������� �������� � ������� pos
	Array DelPosNew(int pos);
	//��������� ����� ������ b, � ������� 
	//������ ������� � ������� pos

	bool operator == (Array& x); 		//�������� ��������� ��������
	bool operator != (Array& x);			//�������� ����������� ��������

	int Max();			//���������� ��������� � �������, ���������� 
	//������ ������������� ��������
	int Min();   			// ���������� �������� � �������
	void Sorting();		//���������� �������

	friend ostream& operator << (ostream & r, Array & x);
	friend istream& operator >> (istream & r, Array & x);
		
};