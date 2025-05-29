program project1;
var A:array  of integer;
     i,n,c,b,min,j:integer;
begin
   writeln('Введите количество элементов массива: ');
   read(c);
   writeln('Введите элементы массива: ');
   SetLength(A,c);
for i:=1 to c do begin
   readln(n);
   A[i]:=n;
end;
for i := 1 to c-1 do begin
  min:= i ;
  for j:= i+1 to c do
    if A[j] < A[min] then
       min:=j;
  if min <> i then begin
    b:=A[i];
    A[i]:=A[min];
    A[min]:=b;
  end;
end;
writeln('Исходный массив: ');
for i:=1 to c do begin
   write(' ',A[i]);
end;
readln(i);
end.



