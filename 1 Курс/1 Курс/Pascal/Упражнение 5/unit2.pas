unit unit2;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Forms, Controls, Graphics, Dialogs;

type
  TForm1 = class(TForm)
  private

  public

  end;

var
  Form1: TForm1;

implementation

{$R *.lfm}
var
  i ,B , c :integer;
  Dlina:integer;
type DynMass = array of integer;
  B : DynMass;

  begin
    write('Введите пожалуйста длину массива');
    Readln(Dlina);
    end


end.

