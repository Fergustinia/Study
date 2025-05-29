#include<cmath>
#include <iostream>
using namespace std;
int main()

{
    setlocale(LC_ALL, "Russian");
    double x, step, min;
    cout << "Вычисление функции" << endl << endl;
    cout << "Введите минимальное число "; cin >> min;
    if (min >= 4 || min < 0) cout << "Число не входит в диапазон (0-4]";
    else
    {
        step = (4 - min) / 9;
        x = min;
        for (int i = 0; i < 10; i++)
        {
            cout << "  " << x << " = " << (sin(x) / x) << endl;
            x += step;
        }

    }
    // Фибоначчи
    cout << endl << endl;
    cout << "Числа фибоначчи" << endl << endl;
    int sum = 0, first = 0, second = 1, step2 = 0, max;
    cout << "Введите максимальное число "; cin >> max;

    while (sum <= max)
    {

        sum += second;
        second += first;
        first = second - first;
        step2++;


    }
    if (sum > max )
    {
        sum -= first;
    }     
        step2--;
    
    
    
    
    
        cout << "Сумма Фибоначчи: " << sum << endl << "Количество чисел: " << step2 << endl;
   

}