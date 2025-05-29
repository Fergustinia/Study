#include <iostream>
using namespace std;

template<typename T>
class Sort {
public:
   
    static int shellSort(T** arr, int n);  
    static int heapSort(T** arr, int n); 
    static bool proverka(T** arr, int n);
private:
    static void down(T** arr, int start, int end, int& sum);
};

template<typename T>
 int Sort<T>::shellSort(T** arr, int n)
{
    
        int sum = 0;
        for (int zero = n / 2; zero > 0; zero /= 2) {
            for (int i = zero; i < n; i++) {
                T* b = arr[i];
                int j;
                for (j = i; j >= zero && ++sum && *arr[j - zero] > *b; j -= zero) {
                    arr[j] = arr[j - zero];
                    
                }
                arr[j] = b;
            }
        }
        return sum;
    
}

template<typename T>
 int Sort<T>::heapSort(T** arr, int n)
{
    int sum = 0;
    for (int i = n / 2 - 1; i >= 0; i--)
        down(arr, i, n - 1, sum);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        down(arr, 0, i - 1, sum);
    }
    return sum;
}

template<typename T>
bool Sort<T>::proverka(T** arr, int n) 
{   
   
    for (int i = 1; i < n; i++) {
        if (*arr[i] < *arr[i - 1])
            return false;
     }
    return true;
    


}

template<typename T>
void Sort<T>::down(T** arr, int start, int end, int& sum)
{
    {
        int root = start;
        while (root * 2 + 1 <= end) {
            int temp = root * 2 + 1;
            int a2 = root;

            if (*arr[a2] < *arr[temp])
                a2 = temp;
            if (temp + 1 <= end && *arr[a2] < *arr[temp + 1])
                a2 = temp + 1;

            if (a2 != root) {
                swap(arr[root], arr[a2]);
                root = a2;
                sum++;
            }
            else {
                return ;
            }
        }
    }
}
