#pragma once
class mat
{
	int a;
	int b;
	int** A;

public:
	mat();
	mat(int n);
	double create();
	double print(int i);
	int** genA();
};