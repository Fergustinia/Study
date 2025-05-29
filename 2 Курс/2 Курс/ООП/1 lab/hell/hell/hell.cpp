#include <iostream>
#include "ANGLE.h"
using namespace std;

int main()
{
setlocale(LC_ALL, "RUS");
angle angle10(10,2);
angle angle90(90,0);
angle10.read();
angle10.print();
cout<<"Угол в радианах" << endl << angle10.radian() << endl;
cout << angle10.sinus() << endl;
cout << angle10.cosinus()<<endl;
cout <<"Проверка равенства двух углов" <<endl<< angle10.operator==(angle10) ? "True" : "False";
cout << endl << "Greate: a> a1" << endl << (angle90>angle10) ? "True" : "False";
cout << endl << "Less: a< a1" << endl << angle10.operator<(angle10) ? "True" : "False";
cout << endl<< angle10.plusN() << endl;
cout <<  angle10.minusN() << endl;
cout << angle10.upN() << endl;
cout <<  angle10.downN() << endl;
cout <<  angle10.plus2() << endl;
}