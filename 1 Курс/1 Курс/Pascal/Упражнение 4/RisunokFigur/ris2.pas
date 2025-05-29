unit ris2;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Forms, Controls, Graphics, Dialogs, ExtCtrls, StdCtrls,
  Menus, Buttons;

type

  { TForm1 }

  TForm1 = class(TForm)
    Cleanimages: TButton;
    ClickDraw: TButton;
    ExitBTN: TButton;
    Kartinka: TImage;
    procedure CleanimagesClick(Sender: TObject);
    procedure ClickDrawClick(Sender: TObject);
    procedure ExitBTNClick(Sender: TObject);
    procedure KartinkaClick(Sender: TObject);
  private

  public

  end;

var
  Form1: TForm1;

implementation

{$R *.lfm}

{ TForm1 }


procedure Draw;
begin
    with
    Form1.Kartinka.Canvas do begin
       Brush.Style:=bsSolid; //Сплошная заливка\\ Style-  Стиль (тип) заполнения области
       Brush.Color:=clForm;
       FillRect (0,0,Form1.Kartinka.Width,Form1.Kartinka.Height);
       //Круг
       Pen.Color:=clGreen;
       Pen.Width:=3;
       Brush.Color:=clRed;
       EllipseC(75,75,25,25);
       //Прямоугольник
       Pen.Color:=clRed;
       Pen.Width:=3;
       Brush.Color:=clGreen;
       Brush.Style:=bsCross;
       Rectangle(110,50,210,100);
       //Линия
       Pen.Color:=clBlack;
       Pen.Width:=3;
       Line(10,120,Form1.Kartinka.Width-20,120);
       //Текст
       Font.Color:=clBlue;
       Font.Name:='Courier';
       Font.Size:=30;
       Font.Style:=[fsBold];
       TextOut(40,130,'рисунок');

    end;
end;

procedure Cleaning;
begin
    with
    Form1.Kartinka.Canvas do begin
       Brush.Style:=bsSolid; //Сплошная заливка
       Brush.Color:=clForm;
       FillRect (0,0,Form1.Kartinka.Width,Form1.Kartinka.Height);
     //Ellipse(75,75,25,25);

    end;
end;


procedure TForm1.ExitBTNClick(Sender: TObject);
begin
  close;
end;

procedure TForm1.ClickDrawClick(Sender: TObject);
begin
     Draw;
end;

procedure TForm1.CleanimagesClick(Sender: TObject);
begin
  Cleaning ;//Form1.Kartinka.bsClear;// Kartinka.Clear;  //Form1.Kartinka:=nil;
end;

procedure TForm1.KartinkaClick(Sender: TObject);
begin

end;

end.

