program Project1;
var A:array  of integer;
     i,c,sum,b:integer;
begin
   writeln('������  �᫮ 䨡����: ');
   read(c);
   SetLength(A,c);
   sum:=1;
   b:=2;
if c>=3 then begin
   for i:=4 to c-1 do begin
   A[i]:=i-3;
   sum:=A[i]+sum;
   b:=b+sum;
end;
end;
if c=2 then begin
     write('��᫮ 䨡���� ࠢ��=1');
   end;
if c=1 then begin
     writeln('��᫮ 䨡���� ࠢ��=0');
   end;
if c>2 then begin
   writeln('��᫮ 䨡����');
   writeln(sum);
   writeln(b);
end;

readln(i);
end.
