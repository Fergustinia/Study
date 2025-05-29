program project1;
var A:array  of integer;
     i,n,c,b:integer;
begin
   writeln('Введите количество элементов массива: ');
   read(c);
   SetLength(A,c);
   writeln('Введите элементы массива: ');
for i:=1 to c do begin
   read(n);
   A[i]:=n;
end;
writeln('Исходный массив: ');
for i:=1 to c do begin
   write(A[i],' ');
end;
readln(i);
end.



