program Project1;
var f1,f2,f3,i,n,z: integer;
begin
writeln('Введите кол-во чисел');
read(n);
f1:=0;
f2:=1;
z := 1;
writeln('[1] = ',f1);
writeln('[2] = ',f2);
for i:=3 to n do begin
    f3 := f1 + f2;
    f1 := f2;
    f2 := f3;
    z := z+f3;
    writeln('[', i,'] = ', f3)
end;
writeln('otvet = ' ,z);
readln(f1);
end.


