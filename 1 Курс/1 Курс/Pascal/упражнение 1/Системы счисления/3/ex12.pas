program ex12;
var p,n,q,r,j,i,m,nmax:longint;
a:array[1..31] of longint;
y:array[1..31] of longint;
x:array[1..31] of longint;
 begin
  j:=1;
  m:=Maxlongint;
  writeln(m);
  nmax:=0;
  write('Введите систему счисления: ');
  readln(p);
  if (p<2) or (p>10000) then begin
  writeln('Ошибка, Недопустимая система счисления');
  readln();
 exit;
 end;
  write('Введите количество чисел с основанием ',p,' ');
  readln(n);
  while m>0 do begin
  nmax:=nmax+1;
  x[nmax]:=m mod p;
  m:=m div p;
  end;
  if nmax<n then begin
    writeln('Ошибка, недопустимое число');
    readln();
    exit;
  end;

  writeln('Введите последовательность чисел');
  for i:=n downto 1 do begin
   readln(a[i]);
   if (a[i]>=p) or (a[i]<0) then begin
      writeln('Ошибка, недопустимое число');
      readln();
      readln();
      exit;
      end;
    end;

    if nmax=n then begin
     for i:=n downto 1 do begin
    if x[i]<a[i] then begin
     writeln('Ошибка, недопустимое число');
     readln();
     readln();
     exit;
     end;
   end;
 end;

 j:=a[n];
 for i:=1 to n-1 do begin
     j:=j*p+a[n-i];
  end;

  write('Введите новую систему счисления ');
  readln(q);
  if (q<2) or (q>10000) then begin
    writeln('Ошибка, введена недопустимая система счисления');
    readln();
    exit;
  end;

i:=1;
while j>0 do begin
y[i]:=j mod q;
j:=j div q;
i:=i+1;
end;

for i:=i-1 downto 1 do write(y[i],' ');
readln();
end.
