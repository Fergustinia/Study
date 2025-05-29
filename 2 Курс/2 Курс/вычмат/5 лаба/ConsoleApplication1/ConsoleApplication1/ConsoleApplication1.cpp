#include <iostream>
#include <cmath>
#include "new.h"

#define _USE_MATH_DEFINES

using namespace std;

double f(double x)
{
	return(5*x - 8*log(x) - 8);
}

int main()
{
	setlocale(LC_ALL, "Rus");

	double x0 = 0.5;
	double x = 4;
	double b, a = 0;

	for (int i = 1; i < 3; i = i + 1)
	{	
		b = x;
		x = x - ((x - x0) * f(x)) / (f(x) - f(x0));
		x0 = b;
	
	} 
	cout << "Корень: " << x << endl;
	
	
}