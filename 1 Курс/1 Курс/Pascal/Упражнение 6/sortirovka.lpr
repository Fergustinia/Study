program sortirovka;
{$CODEPAGE CP866}
const
  n=6;
var
  text:array [0..n-1] of string = ('����','����','����','�������','���','��ப�');
  num:array [0..n-1]  of integer = (0,1,2,3,4,5);
  i:integer;
procedure Sorting(var S:array of integer;Sort:array of string);
var i,q,m,x:integer;
begin
for q:=0 to n-2 do begin
    m:=q;
    for i:=q+1 to n-1 do
        if Sort[m] > Sort[S[i]] then
           m:=i;
    x:=S[q];
    S[q]:=s[m];
    S[m]:=x;
end;
end;
begin
writeln('������');
for i:=0 to n-1 do writeln (num[i], ' ',text[num[i]]);
writeln;
Sorting(num,text);
writeln('��ᢥ���� ���஢��');
for i:=0 to n-1 do begin
    writeln (num[i], ' ',text[i]);
end;
readln;
end.



