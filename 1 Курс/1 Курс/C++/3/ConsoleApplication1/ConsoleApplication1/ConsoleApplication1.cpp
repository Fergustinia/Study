#include <iostream>
using namespace std;
int main()
{
    setlocale(LC_ALL, "Russian");
    int n;
    cout <<  "Enter the number of words ";
    cin >> n;
    int i=0;
    string* word = new string[n];
    while(i<1)
    { 
        i++;
        if (n > 20)
        {
            cout << "Too many words, repeat entered ";
            cin >> n;
            i--;
        }
    }
    for (i = 0; i < n; i++)
    {   
        cout << "Entered word ";
        cin >> word[i];
       /* if (strlen(word[i]))*/
        if (word[i].size() > 10)
        {
            cout << "The word is too long, repeat entered";
            i--;
        }
    }
    for (i=1;i<n; i=i+2)
    {
        cout << "Even words["<<i+1 << "]" << word[i] << endl;
    }
}
