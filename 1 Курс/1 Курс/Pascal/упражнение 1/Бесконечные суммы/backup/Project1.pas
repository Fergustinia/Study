program Project1;
var max,b,min,step,num,deg,vari,sum :real;
    i,f:integer;
begin
writeln('Введите начальную точку в диапазоне -0.40:0.72');
readln(min);
writeln('Введите конечную точку точку в диапазоне -0.40:0.72');
readln(max);
step:=(max-min)/9;
sum:=0;
deg:=min;
i:=1;
if (min<-0.40) or (min>0.72) or (max<-0.40) or (max>0.72) then
  writeln('Неправильный диапазон')
else begin
while i<=10 do begin
      b:=deg/i;
      sum:=sum+b;
      writeln('Число =',min:1:2,'  Число интераций =  ',i,'   Значение переменной=',b:1:6,'   Сумма = ',sum:1:6);
      min:=min+step;
      i:=i+1;
      for f:=1 to i do
            deg:=deg*min
end;
end;
readln();
end.

