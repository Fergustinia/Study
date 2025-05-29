#include "Freq.h"
#include "SBase.h"

int main() {
    setlocale(LC_ALL, "ru");
    srand(time(0));
    // Использование класса SFile
    SFile fileReader("Test.txt");
    Freq freq1;
    freq1.Calc(fileReader);
    cout << "Частота в файле : " << endl;
    cout << freq1;
   
    
    
    //  Использование класса SKbrd
   
    SKbrd keyboardReader;
    Freq freq2;
    cout << "Введите числа с клавиатуры " << endl;
    freq2.Calc(keyboardReader);
    cout << "Частота вввода с клавиатуры:" << endl;
    cout << freq2;

    // Использование класса SQueue
    const int queueLength = 10;
    SQueue queue(queueLength);
    Freq freq3;
    freq3.Calc(queue);
    cout << "Частота случайного массива" << endl;
    cout << freq3;

    // Использование класса Diap
    Diap diap;
    diap.Calc(fileReader);
    cout << "Диапазон в файле:" << endl;
    cout << diap;


 
}


