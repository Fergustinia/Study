program project1;
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
procedure ProstSort(var X: array of integer;
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
procedure sortVB(var X: array of integer;
                     n:integer);
var j,i,z,k:integer;
begin
  for j:=0 to n-1 do begin
    k:=j;
    for i:=j+1 to n do
      if X[k]>X[i] then k:=i;
    z:=X[j];
    X[j]:=X[k];
    X[k]:=z
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

var mass,mass1:array of integer;
    i,m,n:integer;
    save:array[0..2] of int64;
    tests:array[0..2] of boolean;
begin
  Randomize;
   m:=10;
   while (m<=1000000) do begin
            SetLength(mass,m);
            SetLength(mass1,m);
            for i:=0 to m-1 do begin
            mass[i]:=random(1998)-999;
            end;

          // Слияние
          GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessStartKernelTime,ProcessStartUserTime);

          sort(mass,mass1,0,m-1);

          GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessEndKernelTime,ProcessEndUserTime);
          CommonUserTime:=int64(ProcessEndUserTime)-int64(ProcessStartUserTime);
          tests[0]:=Test(mass,mass,m-1);
          save[0]:=CommonUserTime;

          for i:=0 to m-1 do begin
             mass[i]:=random(1998)-999;
             end;

          if m<=100000 then begin               // Ограничитель
          // Сортировка выбором
          GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessStartKernelTime,ProcessStartUserTime);

          sortVB(mass,m-1);

          GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessEndKernelTime,ProcessEndUserTime);
          CommonUserTime:=int64(ProcessEndUserTime)-int64(ProcessStartUserTime);
          save[1]:=CommonUserTime;
          tests[1]:=Test(mass,mass,m-1);
          end;
             if m>100000 then save[1]:=-1;        // Поскольку алгоритм не работает, то выводит -1
             for i:=0 to m-1 do begin
             mass[i]:=random(1998)-999;
             end;

             if m<=1000 then begin                // Ограничитель
          //Простейшая сортировка
          GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessStartKernelTime,ProcessStartUserTime);

          ProstSort(mass,m-1);

          GetProcessTimes(GetCurrentProcess(),ProcessStartTime,ProcessEndTime,ProcessEndKernelTime,ProcessEndUserTime);
          CommonUserTime:=int64(ProcessEndUserTime)-int64(ProcessStartUserTime);
          save[2]:=CommonUserTime;
          tests[2]:=Test(mass,mass,m-1);
             end;
             if m>1000 then save[2]:=-1;         // Поскольку алгоритм не работает, то выводит -1



          writeln('                                 Массив: ',m,' ');
          writeln('Алгоритм      Слияние                           Кв.трудоемкость                           Простейший алгоритм');
          writeln('Время    ',save[0]/10000000:10:3,'сек                      ',save[1]/10000000:10:3,'сек                                ',save[2]/10000000:10:3,'сек');
          writeln('Проверка       ',tests[0],'                                ',tests[1],'                                         ',tests[2]);
          writeln(' ');
          m:=m*10;
   end;

  readln;readln;
end.
