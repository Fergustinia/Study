#include "angle.h"
#define _USE_MATH_DEFINES
#include <math.h>
#include<iostream>
using namespace std;
angle::angle()
{
	deg = 0;
	min = 0;
}

angle::angle(int d, int m)
{
	deg=(d+m / 60)%360;
	min=m%60;
}

void angle::print()
{
	cout << "угол = " << deg << "∞" << min << "'" << endl;
}

void angle::read()
{
	int a=0;
	cout << "введите градусы" << endl;
	cin >> deg;
	cout << "¬ведите в минутах" << endl;
	cin >> min;
	while (min>60)
	{
		min -= 60;
		a += 1;
	}
	deg = deg%360+a;
}

double angle::radian()
{
	//double d;
	//d = ((deg + min / 60)*180)/M_PI;
	
	
	return ((deg + min / 60) * M_PI) / 180;
}

double angle::sinus()
{
	cout << "Cинус угла" << endl;
	return sin(this->radian());
}

double angle::cosinus()
{
	cout << "косинус угла" << endl;
	return cos(this->radian());
}

bool angle::operator ==(angle a)
{
	if ((this->deg == a.deg) and (this->min == a.min))
	{
		return true;
	}
	else
		return false;
}
bool angle::operator > (angle a)
{
	if (this->deg > a.deg) {
		return true;
	}
	if ((this->deg == a.deg) and (this->min > a.min)) {
		return true;
	}
	else
		return false;
}
bool angle::operator<(angle a)
{
	if (this->deg < a.deg) {
		return true;
	}
	if ((this->deg == a.deg) and (this->min < a.min)) {
		return true;
	}
	else
		return false;
}
double angle::plusN()
{
	int d, m, min1,deg1;
	cout << endl << "¬ведите число дл€ увеличени€ градусов" << endl;
	cin >> d;
	cout << "¬ведите число дл€ увеличени€ минут" << endl;
	cin >> m;
	min1=this->min;
	min1 += m;
	deg1 = this->deg;
	deg1 = (deg1 + d + min1 / 60);
	cout << "”величенный угол " << deg1 << endl;
	return deg, min;
}

double angle::minusN()
{
	int d, m,min1, deg1;
	cout << "¬ведите число дл€ уменьшени€ градусов" << endl;
	cin >> d;
	cout << "¬ведите число дл€ уменьшени€ минут" << endl;
	cin >> m;
	min1 = this->min;
	min1 -= m;
	deg1 = this->deg;
	deg1 = (deg1 - d + min1 / 60);
	cout << "”меньшенный угол " << deg1 << "∞" << min1 << endl;
	return deg, min;
}
double angle::upN()
{
	int d, m,deg1,min1;
	cout << "¬ведите число дл€ увеличени€ градусов в n раз" << endl;
	cin >> d;
	cout << "¬ведите число дл€ увеличени€ минут в n раз" << endl;
	cin >> m;
	min1 = this->min;
	min1 *= m;
	deg1 = this->deg;
	deg1 = (deg1 * d + min1 / 60);
	cout<<"”меньшенный угол" << deg1 << "∞" << min1 << endl;
	return deg, min;
}
double angle::downN()
{
	int d, m,deg1,min1;
	cout << "¬ведите число дл€ уменьшени€ градусов в n раз" << endl;
	cin >> d;
	cout << "¬ведите число дл€ уменьшени€ минут в n раз" << endl;
	cin >> m;
	min1 = this->min;
	min1 /= m;
	deg1 = this->deg;
	deg1 = (deg1 / d + min1 / 60);
	cout << "”меньшенный угол в N раз" << deg<<"∞"<<min << endl;
	return deg, min;
}

double angle::plus2()
{
	int deg1, min1;
	cout << "введите в градусах второй угол" << endl;
	cin >> deg1;
	cout << "¬ведите в минутах второй угол" << endl;
	cin >> min1;
	deg1 %= 360;
	min1 %= 60;
	deg1 = this->deg + deg1 + min / 60 + min1 / 60;
	min1 = (this->min + min1);
	cout<<"—умма углов" << deg1 << "∞" << min1 << endl;
	return deg, min;
}



