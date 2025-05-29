unit MemmoPRG;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Forms, Controls, Graphics, Dialogs, StdCtrls, Menus;

type

  { TForm1 }

  TForm1 = class(TForm)
    LineButton: TButton;
    Button2: TButton;
    Edit1: TEdit;
    ExitButton: TButton;
    Memo1: TMemo;
    procedure ExitButtonClick(Sender: TObject);
  private

  public

  end;

var
  Form1: TForm1;

implementation


{$R *.lfm}

{ TForm1 }
Procedure GenerLinerSpisk;

  //Const
  //   n=5;
Var
    b : array [-999..999] of Longint;
  //n:integer;
 // Readln(n);
 // a : array [1..n] of integer;



var a:array [1..100] of integer;
    x,i,j,n,f: integer;
begin
write ('размер масива => '); read (n);
for i:=1 to n do begin
write ('Введите член ',i,'-ого значения => '); read (a[i]); end;
  for i:=2 to n do begin
  x:=a[i];
  j:=i-1;
while (j>0) and (x<a[j]) do begin
  a[j+1]:=a[j];
  j:=j-1;
  end;
  a[j+1]:=x;
  end;
for i:=1 to n do
write ('a[',i,']=',a[i],'  ');
end;

//  var MassCount, MassSortCount : array [-999..999] of Longint;
//     i: Longint;
//begin
//    i:=0;
//
//    while (i< n-1) and (MassSort[i] <= MassSort[i+1]) do
//          i:= i+1;
//
//    if i < n-1
//       then Test:= False
//    else  begin
//        //
//        for i:= -999 to 999 do
//         begin
//           MassCount[i]:=0;
//           MassSortCount[i]:=0;
//          end;
//        //
//        for i:=0 to n-1 do
//        begin
//          MassCount[Mass[i]]:= MassCount [Mass[i]]+1;
//           MassSortCount[MassSort[i]]:=MassSortCount[MassSort[i]]+1;
//        end;
//       i:=-999;
//       while (i<=999) and (MassCount[i]= MassSortCount[i]) do
//             i:= i+1;
//       if i = 1000 then Test :=True
//       else Test:= False;
//  end;
//end;


   //randomize();
   //
   //    for i:=0 to n-1 do begin
   //        Mass[a] := random(999*2) - 999;
   //    end;





procedure TForm1.ExitButtonClick(Sender: TObject);
begin
  Close;
end;

end.

