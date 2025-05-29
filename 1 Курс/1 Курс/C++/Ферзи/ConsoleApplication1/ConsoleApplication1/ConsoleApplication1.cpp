#include <iostream>
using namespace std;

int n, a, P[21], H[21], R[41], L[41];/*глобальные описания */
void ferzi(int k) /*функция генерации перестановок */
{
	int i, j;
	for (i = 1; i <= n; i++)
		if (H[i] == 0 && R[i - k + 21] == 0 && L[i + k] == 0)
		{
			P[k] = i; H[i] = 1; R[i - k + 21] = 1; L[i + k] = 1;
			if (k == n) /*вывод сгенерированной перестановки*/
			{
				for (j = 1; j <= n; j++) cout<< (P[j])<<" ";
				cout << ("\n");
				a++;
			}
			else ferzi(k + 1);
			H[i] = 0; R[i - k + 21] = 0; L[i + k] = 0;
		}
}
int main(void)
{
	int i;
	cin >> n;
	for (i = 1; i <= n; i++) H[i] = 0;
	for (i = 2; i <= n + n; i++)
	{
		R[i] = 0; L[i] = 0;
	}
	ferzi(1);
	cout<< a;
}