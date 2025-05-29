program KOSVENNOE; // kkkos;
{$CODEPAGE CP866}
const
  n=5;
var
  Words:array [0..n-1] of string = ('Lamp','PC','Fish','Bottle','Pen');
  idx:array [0..n-1]  of integer = (0,1,2,3,4);
  i:integer;
procedure SortingKosven(var index:array of integer;Sort:array of string);
var i,q,m,x:integer;

begin
    for q:=0 to n-2 do begin
        m:=q;
        for i:=q+1 to n-1 do
            if Sort[index[m]] > Sort[index[i]] then
              m:=i;
        x:=index[q];
        index[q]:=index[m];
        index[m]:=x;
    end;
end;

           begin
      writeln(''); //Изначальный
  for i:=0 to n -1 do writeln (idx[i], '    ',Words[idx[i]]);
writeln;

SortingKosven(idx,Words);
   writeln(''); // Готовый
for i:=0 to n-1 do begin
    writeln (idx[i], '    ',Words[idx[i]]);
end;
readln;
end.

//begin
//  writeln('Исходный массив          Отсортированы по индексам');
//  SortingKosven(idx,Words);
//for i:=0 to n -1 do writeln (i, '    ',Name[i], '     ', Indexation[i], '    ',Name[Indexation[i]]);
//readln;
//end.

