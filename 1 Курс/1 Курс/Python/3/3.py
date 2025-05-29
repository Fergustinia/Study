B7=[300,2,11,25,-1,18,90];
a=float(7.7);
c=float(-3.5);
maxn=float();
summa=int(0);
maxn=max(B7);
if maxn>c:
    for i in range (0,7):
        B7[i]=B7[i]/a;
        B7[i]=round(B7[i],3);
else:
    for i in range(0,7):
        if B7[i]>0:
            summa=B7[i]+summa;
    print('Максимальное число на сумму положительных ',summa*maxn);
print('Массив B7=',B7)
