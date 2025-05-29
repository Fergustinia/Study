program project1;
uses math;
const N = 10000;
var x1,x2,x3,i,a,b,d,j,t,k,sum:integer;
    S:array [1..10000] of integer;
    E:array [1..10000] of integer;
begin
sum:=0;
t:=N;
j:=1;
k:=1;
writeln('Введите систему счисления, в которой будет введеное число');
readln(x1);
if (x1<2) or (x1>10000) then begin
write('Ошибка');
end
else begin
writeln('Введите число');
readln(x2);
while x2<>0 do  begin
    E[k]:= x2 mod x1;
    x2:=x2 div x1;
    k+= 1;
end;
for i:=1 to 10000 div 2 do begin
        b := E[i];
        E[i] := E[N-i+1];
        E[N-i+1] := b;
end;
//for t:=t downto j do begin
//    for
//    sum:=sum+l;
end;
writeln('Введите систему счисления в которую надо перевести число');
readln(x3);
b:=1;
i:=1;
    while sum<>0 do  begin
    S[i]:= sum mod x3;
    sum:=sum div x3;
    i+= 1;
end;
for b:=i-1 downto 1 do write(S[b],' ');
readln(x1);
end.

