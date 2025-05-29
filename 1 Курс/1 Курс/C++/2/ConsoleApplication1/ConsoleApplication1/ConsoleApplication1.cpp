#include <iostream>
using namespace std;
int main()
{
    setlocale(LC_ALL, "Russian");
    int Mass1[10];                          //статический массив, индексная адресация;
    int i;
    for ( i = 0; i < 10; i++)
    {
        Mass1[i] = i * i;
        cout << Mass1[i] << "  ";
    }
    cout << endl;

    int Mass2[10];                          //статический массив, адресация  с помощью указателя (косвенная адресация);
    int *s=Mass2;
    for ( i = 0; i < 10; i++, s++)
    {
        *s = i * i;  
        cout << *s  << "  ";
    }
    cout << endl;
    
    int *mass3 ;                            //динамический массив, индексная адресация;
    mass3 = new int[10];
    for (i = 0; i < 10; i++) 
    {
        mass3[i] = i * i;
        cout << mass3[i] << "  ";
    }
    cout << endl;

    int*mass4;                              //динамический массив, адресация  с помощью указателя (косвенная адресация)
    mass4 = new int[10];
    int *k = mass4;  
    for (i = 0; i < 10; i++, k++)
    {
        *k = i * i;
        cout << *k << "  ";
    }
    /*S = new struct el;
    for (i = 0; i < 10; i++)
    {

    };*/

}
        