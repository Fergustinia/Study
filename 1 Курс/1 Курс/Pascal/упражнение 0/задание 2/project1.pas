program project1;
var A:array [1..3]  of integer;
     i,n,c,b,min,j:integer;
begin
writeln('������ 3 �᫠: ');
for i:=1 to 3 do begin
   readln(n);            // ��᢮���� ������� ������ ���ᨢ� ���祭��
   A[i]:=n;
end;
for i := 1 to 2 do begin              // min ࠡ�⠥� ��� ��६����� ���ன �� ������ ��ࢮ� ��������� �������쭮� �᫮, �⠢�� ��� � ����� �����                                      // � ���ન����
  min:= i ;                           // ��宦����� �������쭮�� �᫠
  for j:= i+1 to 3 do
    if A[j] < A[min] then
       min:=j;
  if min <> i then begin
    b:=A[i];
    A[i]:=A[min];
    A[min]:=b;
  end;
end;
writeln('�뢮�: ');         // �뢮� ���ᨢ�
for i:=1 to 3 do begin
   write(' ',A[i]);
end;
readln(i);
end.

