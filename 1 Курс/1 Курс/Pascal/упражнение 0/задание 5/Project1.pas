program Project1;
const N = 5;
var
    a: array[1..N] of integer;
    min, max, i: integer;
    b: integer;
begin
    randomize;
    for i:=1 to N do begin
        a[i] := random(100);
        writeln(a[i]);
    end;
    writeln;
    min := 1;
    max := 1;
    for i:=2 to N do begin
        if a[i] < a[min] then
            min := i
        else
            if a[i] > a[max] then
                max := i;
    end;
    b := a[min];
    a[min] := a[max];
    a[max] := b;
    for i:=1 to N do
        writeln(a[i]);
    readln()
end.



