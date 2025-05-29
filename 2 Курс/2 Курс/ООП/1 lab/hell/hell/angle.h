#pragma once
class angle
{
	int deg;
	int min;
public:
	angle();
	angle(int d, int m);
	void print();
	void read();
	double radian();
	double sinus();
	double cosinus();
	bool operator == (angle a);
	bool operator > (angle a);
	bool operator<(angle a);
	double plusN();
	double minusN();
	double upN();
	double downN();
	double plus2();
};

