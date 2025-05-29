unit Unit1;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Forms, Controls, Graphics, Dialogs, StdCtrls,LResources, Buttons;

type

  { TForm1 }

  TForm1 = class(TForm)
    close1: TButton;
    Button2: TButton;
    Label1: TLabel;
    Label2: TLabel;
    Label3: TLabel;
    Label4: TLabel;
    Label5: TLabel;
    fir: TEdit;
    sec: TEdit;
    procedure close1Click(Sender: TObject);
    procedure Button2Click(Sender: TObject);
    procedure firChange(Sender: TObject);
    procedure secChange(Sender: TObject);
  private

  public

  end;

var
  Form1: TForm1;

implementation

{$R *.lfm}

{ TForm1 }

procedure TForm1.close1Click(Sender: TObject);
begin
close;
end;

procedure TForm1.Button2Click(Sender: TObject);
var  eps:real;
    y1,y2:real;
    a,k,i:integer;
begin
k:=1;
try
  y1:=StrToFloat(fir.Text) ;
  y2:=StrTOFloat(sec.Text) ;
  except
    Showmessage('Ошибка диапазона')
  end;
end;

procedure TForm1.firChange(Sender: TObject);
begin

end;

procedure TForm1.secChange(Sender: TObject);
begin

end;

end.

