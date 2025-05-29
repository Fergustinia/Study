unit Unit1;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Forms, Controls, Graphics, Dialogs, StdCtrls,LResources, Buttons,math;

type

  { TI }

  TI = class(TForm)
    CL: TButton;
    close1: TButton;
    Button2: TButton;
    Label1: TLabel;
    Label2: TLabel;
    Label3: TLabel;
    Label4: TLabel;
    fir: TEdit;
    Label5: TLabel;
    Label6: TLabel;
    Func: TLabel;
    Iter: TLabel;
    sec: TEdit;
    procedure CLClick(Sender: TObject);
    procedure close1Click(Sender: TObject);
    procedure Button2Click(Sender: TObject);
  private

  public

  end;

var
  I: TI;

implementation

{$R *.lfm}

{ TI }

procedure TI.close1Click(Sender: TObject);
begin
close;
end;

procedure TI.CLClick(Sender: TObject);

begin

end;

procedure TI.Button2Click(Sender: TObject);
var
    y1,y2,exp:real;
    k,i,j:integer;
begin
k:=1;
i:=1;
exp:=0;
j:=1;
//try
//  y1:=StrToFloat(fir.Text) ;
//  y2:=StrTOFloat(sec.Text) ;
//  except
//    Showmessage('Error')
//  end;
while y2>y1 do begin
  exp:=power(y2,i);
  y2:=(1-k*exp)*j;
  i:=i+1;
  k:=k+1;
  j:=j*(-1);
end;
Func.Caption:=FloatToStr(exp);
Iter.Caption:=intToStr(k);
end;
initialization


end.

