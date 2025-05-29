program Project1;
var A:array  of integer;
     i,c,sum,b:integer;
begin
   writeln('Введите  число фибоначи: ');
   read(c);
   SetLength(A,c);
   sum:=1;
   b:=2;
if c>=3 then begin
   for i:=4 to c-1 do begin
   A[i]:=i-3;
   sum:=A[i]+sum;
   b:=b+sum[i];
end;
end;
if c=2 then begin
     write('Число фибоначи равно=1');
   end;
if c=1 then begin
     writeln('Число фибоначи равно=0');
   end;
if c>2 then begin
   writeln('Число фибоначи');
   writeln(sum);
   writeln(b);
end;

readln(i);
end.
