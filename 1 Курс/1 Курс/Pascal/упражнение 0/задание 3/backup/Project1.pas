// с помощью координат и радиуса определить лежат ли координаты в центре круга
program Project1;
var a,b,c,d,f:integer;
begin
writeln('Введите координаты точки ');
readln(a,b);
writeln('Введите координаты центра ');
readln(d,f);
writeln('Введите радиус ');
read(b);
if  sqr(b)>=sqr((d-a)+(f-b)) then
       begin write('Точка в ценрте круга') end
else
       begin write('Точка не в центре круга') end;
Readln(a);
end.

