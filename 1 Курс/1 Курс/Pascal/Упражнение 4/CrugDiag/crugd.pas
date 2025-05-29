unit CrugD;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Forms, Controls, Graphics, Dialogs, StdCtrls, ExtCtrls,
  Menus;

type

  { TForm1 }

  TForm1 = class(TForm)
    DrawButton: TButton;
    ExitButton: TButton;
    NadLang2: TLabel;
    NadLang: TLabel;
    langNumEdit1: TEdit;
    LangNumLabel1: TLabel;
    LegendImage: TImage;
    CircleImage: TImage;
    TiobeLabel1: TLabel;
    OctLabel1: TLabel;
    procedure DrawButtonClick(Sender: TObject);
    procedure ExitButtonClick(Sender: TObject);
  private

  public

  end;

var
  Form1: TForm1;

implementation

{$R *.lfm}
Var
     LangColor:array[1..11] of TColor=(clGreen , clRed , clLime , clBlack, clNavy , clBlue, clPurple , clOlive, clTeal ,  clFuchsia , clMaroon );
     Languages:array[1..11] of string=('Python' ,'C' ,  'Java' , 'C++', 'C#' , 'Visual Basic', 'JavaScript' , 'SQL', 'PHP',  'R' , 'Ruby' );
        Rating:array[1..11] of real = ( 17.18   ,15.08 , 11.98 , 10.75, 4.25 ,      4.11     ,     2.74     , 1.82 , 1.69 , 1.14 , 0.85 );
     iBeg,iEnd,jBeg,jEnd:integer; //Местоположение Диаграммы

     Procedure Draw;
     var kollang , Border ,xt ,yt , step, rad, irad, jrad, i:integer;
          x1,xr,start:real;
          begin
            Border:=20;
            jBeg:=Border;
            //Рисование диаграммы
            with Form1.CircleImage.Canvas do begin
              Brush.Color:=clForm;
              FillRect(0,0,Form1.CircleImage.Width,Form1.CircleImage.Height);
              kollang:= StrToInt(Form1.LangNumEdit1.Text);

              if (Form1.CircleImage.Width-2*iBeg) >  (Form1.CircleImage.Height-2*jBeg)

                  then rad:=  Form1.CircleImage.Height-2*jBeg
                  else rad:=  Form1.CircleImage.Width-2*iBeg;
              rad:= rad div 2;

              iEnd:=iBeg+2*rad; jEnd:=jBeg+2*rad;
              irad:=iBeg+rad; jrad:=jBeg+rad;

              start:=pi/2; x1:=start;
              for i:=1 to kollang do begin
                xr:=x1-2*pi*Rating[i]/100;
                Brush.Color:=LangColor[i];
                Pie(iBeg, jBeg, iEnd , jEnd , irad+round(rad*cos(xr)),
                                              jrad-round(rad*sin(xr)),
                                              irad+round(rad*cos(x1)),
                                              jrad-round(rad*sin(x1)));
                x1:=xr;
              end;
              Brush.Color:=clGray;
              xr:=start;
                Pie(iBeg, jBeg, iEnd , jEnd , irad+round(rad*cos(xr)),
                                              jrad-round(rad*sin(xr)),
                                              irad+round(rad*cos(x1)),
                                              jrad-round(rad*sin(x1)));

                  //Рисование Легенды


                       with Form1.LegendImage.Canvas do begin
              Brush.Color:=clForm;
              FillRect(0,0,Form1.LegendImage.Width,Form1.LegendImage.Height);
              step:=round (Form1.LegendImage.Height/(kollang+1));
              xt:=Border;
              yt:=Border div 2;
              Font.Style:=[fsBold];
              for i:=1 to kollang do begin
                Font.Color:=LangColor[i];
                TextOut(xt ,yt ,  Languages[i]);
                yt:= yt + step;
                end;
              Font.Color:=clGray;
              Font.Style:=[fsBold];
              TextOut(xt, yt, 'Другие');
              end;
            end;
          end;

     { TForm1 }


     procedure TForm1.ExitButtonClick(Sender: TObject);
     begin
       Close;
     end;

procedure TForm1.DrawButtonClick(Sender: TObject);
begin

 if LangNumEdit1.Text='' Then
  begin
    Application.MessageBox('Ошибка!Не введено не единого значения!', 'Введите число');
    NadLang.Caption:='Введите число! ';
    NadLang2.Caption:='От 1 до 11 ! ';
    exit;

  end;
  Draw;
end;

end.

