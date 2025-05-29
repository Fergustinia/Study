program project1;
var A:array [1..3]  of integer;
     i,n,c,b,min,j:integer;
begin
writeln('Введите элементы массива: ');
for i:=1 to 3 do begin
   readln(n);            // Присвоение каждому элементу массива значение
   A[i]:=n;
end;
for i := 1 to 2 do begin              // min работает как переменная которой мы задаем первое найденное минимальное число, ставим его в первую строчку                                      // и вычеркиваем
  min:= i ;                           // Нахождение минимального числа
  for j:= i+1 to 3 do
    if A[j] < A[min] then
       min:=j;
  if min <> i then begin
    b:=A[i];
    A[i]:=A[min];
    A[min]:=b;
  end;
end;
writeln('Исходный массив: ');         // Вывод массива
for i:=1 to 3 do begin
   write(' ',A[i]);
end;
readln(i);
end.

