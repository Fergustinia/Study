program project1;
var A:array  of integer;
     i,n,c,b:integer;
begin
   writeln('������ ������⢮ ����⮢ ���ᨢ�: ');
   read(c);
   SetLength(A,c);
   writeln('������ ������ ���ᨢ�: ');
for i:=1 to c do begin
   read(n);
   A[i]:=n;
end;
writeln('��室�� ���ᨢ: ');
for i:=1 to c do begin
   write(A[i],' ');
end;
readln(i);
end.



