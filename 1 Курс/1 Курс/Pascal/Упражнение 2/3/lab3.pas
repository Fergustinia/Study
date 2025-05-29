program lab3;
uses SysUtils, Windows;
var CommonUserTime:int64;
    ProcessStartTime, ProcessEndTime, ProcessStartKernelTime,
    ProcessStartUserTime,
    ProcessEndKernelTime,
    ProcessEndUserTime:FILETIME;

function Test(var Mass,MassSort:array of integer; n:integer):Boolean;
    var MassCount, MassSortCount:array[-999..999] of longint;
      i:longint;
    begin
      i:=0;
      while (i<n-1) and (MassSort[i]<=MassSort[i+1]) do
            i:=i+1;
      if i < n-1
         then Test:= False
      else begin
        for i:=-999 to 999 do
        begin
          MassCount[i]:=0;
          MassSortCount[i]:=0;
        end;
        for i:=0 to n-1 do
        begin
          MassCount[Mass[i]]:=MassCount[Mass[i]]+1;
          MassSortCount[MassSort[i]]:=MassSortCount[MassSort[i]]+1;
        end;
        i:=-999;
        while (i<=999) and (MassCount[i]=MassSortCount[i])do
              i:=i+1;
        if i=1000 then Test:=True
        else Test:=False;
      end;
    end;
procedure first(var X: array of integer;
                     n:integer);
var i,z:integer;
begin
  i:=0;
 while i<n do
   if X[i]<=X[i+1] then i:=i+1
   else begin
     z:=X[i];
     X[i]:=X[i+1];
     X[i+1]:=z;
     i:=0;
   end;

end;
procedure second(var X: array of integer;       //Сортировка Вставками
                     n:integer);
var j,i,m,a:integer;
begin
  for j:=0 to n-1 do begin
    a:=j;
    for i:=j+1 to n do
      if X[a]>X[i] then a:=i;
    m:=X[j];
    X[j]:=X[a];
    X[a]:=m
  end;
end;
procedure S(var X,Y: array of integer;
                     b1,e1,e2:integer);
  var i1, i2, j:integer;
begin i1:=b1; i2:=e1+1; j:=b1;
  while (i1<=e1)and(i2<=e2) do begin
    if X[i1]<=X[i2] then
      begin Y[j]:=X[i1]; i1:=i1+1 end
    else begin Y[j]:=X[i2]; i2:=i2+1 end;
    j:=j+1
  end;
  while i1<=e1 do begin
    Y[j]:=X[i1]; i1:=i1+1; j:=j+1
  end;
  while i2<=e2 do begin
    Y[j]:=X[i2]; i2:=i2+1; j:=j+1
  end
end;
procedure sort(var X,Y: array of integer;
                b,e:integer);
  var c,i:integer;
  begin
    if b<e then begin
      c:=(b+e)div 2;
      sort(X,Y,b,c);
      sort(X,Y,c+1,e);
      S(X,Y,b,c,e);
      for i:=b to e do X[i]:=Y[i]
    end
  end;

var C,D,F:array of integer;
     testing: boolean;
     time:  int64;
     h,p,o,i,j,h1:integer;
begin
randomize;
h:=10;
writeln('Простейшая сортировка');
while (h<=1000) do begin
  SetLength(C,h);
  for i:=1 to h-1 do begin
  C[i]:=random(1000)-999;
  end;
  GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessStartKernelTime,ProcessStartUserTime);
first(C,h-1);
GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessEndKernelTime,ProcessEndUserTime);
CommonUserTime:=int64(ProcessEndUserTime)-int64(ProcessStartUserTime);
time:=CommonUserTime;
testing:=Test(C,C,h-1);
writeln('Длина массива = ',h,' Время = ',time/10000000:10:7,' Правильность ', testing);
h:=h*10;
end;
h:=10;
writeln('Сортировка вставками');
while (h<=1000) do begin
  SetLength(C,h);
  for i:=1 to h-1 do begin
  C[i]:=random(1000)-999;
  end;
  GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessStartKernelTime,ProcessStartUserTime);
second(C,h-1);
GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessEndKernelTime,ProcessEndUserTime);
CommonUserTime:=int64(ProcessEndUserTime)-int64(ProcessStartUserTime);
time:=CommonUserTime;
testing:=Test(C,C,h-1);
writeln('Длина массива = ',h,' Время = ',time/10000000:10:7,' Правильность ', testing);
h:=h*10;
end;
h:=10;
writeln('Сортировка слиянием');
while (h<=1000000) do begin
  SetLength(D,h);
  SetLength(F,h);
  for i:=1 to h-1 do begin
  D[i]:=random(1000)-999;
  end;
  GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessStartKernelTime,ProcessStartUserTime);
sort(D,F,0,h-1);
GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessEndKernelTime,ProcessEndUserTime);
CommonUserTime:=int64(ProcessEndUserTime)-int64(ProcessStartUserTime);
time:=CommonUserTime;
testing:=Test(D,D,h-1);
writeln('Длина массива = ',h,' Время = ',time/10000000:10:7,' Правильность ', testing);
h:=h*10;
end;
readln();
end.
