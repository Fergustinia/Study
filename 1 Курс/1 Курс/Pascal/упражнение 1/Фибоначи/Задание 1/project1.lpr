program project1;
var a,b,c,i,n,sum:integer;
begin
writeln('������ �᫮ 䨡�����');
readln(n);
a := 0;
b := 1;
sum:=0;
if n>2 then begin
for i := 2 to n do begin
    c := b;
    b := a + b;
    a := c;
    sum:=sum+a;
end;
writeln('��᫮ 䨡�����');
writeln(a);
writeln('�㬬� ��� �ᥫ 䨡�����');
writeln(sum)
end;
readln();
end.
