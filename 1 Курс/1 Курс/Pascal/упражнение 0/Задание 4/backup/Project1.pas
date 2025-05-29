// Найти остаток и целую часть числа
program Project1;
var a,b,c:integer;
begin
  writeln('Введите числитель ');
  read(a);
  writeln('Введите знаменатель');
  read(b);
  c:=0;
  begin
if a>b then
  while a>=b do begin
    a:=a-b;
    c:=c+1;
  end;
   writeln('Целое число ',c);
    writeln('Дробная часть ',a);
else
write('Ошибка')
end;
readln(a);
end.
