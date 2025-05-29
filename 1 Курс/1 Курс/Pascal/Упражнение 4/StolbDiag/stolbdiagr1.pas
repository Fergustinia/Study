unit StolbDiagR1;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Forms, Controls, Graphics, Dialogs, ExtCtrls, StdCtrls,
  Menus, Buttons;

type

  { TForm1 }

  TForm1 = class(TForm)
    ComboBox1: TComboBox;
    ExitButton: TButton;
    ColDiagrImage: TImage;
    LegendImage: TImage;
    TiobeLabel: TLabel;
    OctLabel: TLabel;
    LangNumLabel: TLabel;
    procedure ComboBox1Change(Sender: TObject);
    procedure ExitButtonClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);
    procedure LangNumEditChange(Sender: TObject);
  private

  public

  end;

var
  Form1: TForm1;

implementation

{$R *.lfm}

{ TForm1 }

const ymin=0.0;
  Var
       LangColor:array[1..11] of TColor=(clRed , clGreen , clLime , clMaroon, clNavy , clBlue, clPurple , clOlive, clTeal ,  clFuchsia , clBlack );
       Languages:array[1..11] of string=('Python' ,'C' ,  'Java' , 'C++', 'C#' , 'Visual Basic', 'JavaScript' , 'SQL', 'PHP',  'R' , 'Ruby' );
          Rating:array[1..11] of real = ( 17.18   ,15.08 , 11.98 , 10.75, 4.25 ,      4.11     ,     2.74     , 1.82 , 1.69 , 1.14 , 0.85 );      //clMoneyGreen
       jBeg,jEnd:integer;
       ymax:real;
       kollang:integer;

    function  jy(y:real):integer; {расчёт экранных координат}
    begin
      jy:=round(((y-ymin)*(jEnd-jBeg))/(ymin-ymax)) + jEnd;
    end;

    procedure Draw;
    var
        step,Border,xl,xr,yl,i,k:integer;
         sum:real;
         begin
           Border:=10; //отсуп от основной диаграммы
           jBeg:=Border;
           jEnd:=Form1.ColDiagrImage.Height-Border;

           //Рисунок диаграммы

           with Form1.ColDiagrImage.Canvas do begin
             Brush.Color:=clForm;
             FillRect(0,0,Form1.ColDiagrImage.Width,
                      Form1.ColDiagrImage.Height);
             //Перевод в int

             sum:=0;

             for i:=1 to kollang do begin
                 sum:=sum+Rating[i];
                 //Удобно взять 100 (отображение по высоте)
             ymax:=100-sum;
             step:=round((Form1.ColDiagrImage.Width-3*Border)/(kollang+1));
             xl:=3*Border;

             for k:=1 to kollang do begin
                 xr:=xl+step;
             Brush.Color:=LangColor[k];
             FillRect(xl,jy(ymin) , xr, jy(Rating[k]));
             xl:=xl+step;
             end;

                   end;

           xr:=xl+step;

           Brush.Color:=clGray;
           FillRect(xl,jy(ymin),xr, jy(100-sum));
           Brush.Color:=clForm;
           Line(2*Border, jy(0),2*Border , jy(ymax));
           TextOut(0,jy(ymax/2), FloatToStr(round(ymax/2))+'%'); //middle
           TextOut(0,jy(0)- 4, '0%');   // down
           TextOut(0,jy(ymax), FloatToStr(round(ymax))+'%'); // top

             end;

                   // Рисунок легенды (надписей справа)

         with Form1.LegendImage.Canvas do begin
     Brush.Color:=clForm;
      FillRect(0,0,Form1.ColDiagrImage.Width,
                   Form1.ColDiagrImage.Height);
     step:=round((Form1.ColDiagrImage.Width-3*Border)/(kollang+1));
     xl:=Border;
     yl:=Border div 2;

     Font.Style:=[fsBold];
     for i:=1 to kollang do begin
     Font.Color:=LangColor[i]; //Цвета
     TextOut(xl,yl,Languages[i]);
     yl:=yl+step;
     end;

     //Надпись другие
     Font.Color:=clGray;
     Font.Style:=[fsBold];
       TextOut(xl,yl,'Другие');
         end;




        end;
procedure TForm1.ExitButtonClick(Sender: TObject);
begin
  Close;
end;

procedure TForm1.FormCreate(Sender: TObject);
begin
  ComboBox1.Items.Add('1');
  ComboBox1.Items.Add('2');
  ComboBox1.Items.Add('3');
  ComboBox1.Items.Add('4');
  ComboBox1.Items.Add('5');
  ComboBox1.Items.Add('6');
  ComboBox1.Items.Add('7');
  ComboBox1.Items.Add('8');
  ComboBox1.Items.Add('9');
  ComboBox1.Items.Add('10');
  ComboBox1.Items.Add('11');
end;

procedure TForm1.LangNumEditChange(Sender: TObject);
begin

end;

procedure TForm1.ComboBox1Change(Sender: TObject);
begin
 case ComboBox1.ItemIndex of
 0: kollang :=1 ;
 1: kollang :=2 ;
 2: kollang :=3 ;
 3: kollang :=4 ;
 4: kollang :=5 ;
 5: kollang :=6 ;
 6: kollang :=7 ;
 7: kollang :=8 ;
 8: kollang :=9 ;
 9: kollang :=10 ;
 10: kollang :=11 ;

  end;
    Draw;

end;





end.

