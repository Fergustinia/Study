unit Unit1;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Forms, Controls, Graphics, Dialogs, StdCtrls;

type

  { TCoolForm }

  TCoolForm = class(TForm)
    Button1: TButton;
    Button2: TButton;
    Edit1: TEdit;
    Edit2: TEdit;
    Label1: TLabel;
    Label2: TLabel;
    Label3: TLabel;
    Label4: TLabel;
    Label5: TLabel;
    procedure Button1Click(Sender: TObject);
    procedure Button2Click(Sender: TObject);
    procedure Edit1Change(Sender: TObject);
    procedure Edit2Change(Sender: TObject);
  private

  public

  end;

var
  CoolForm: TCoolForm;
  nach,kon: real;
  formatSettings : TFormatSettings;

implementation

{$R *.lfm}

{ TCoolForm }
procedure fun(nach,kon: Real);
var
  k,i: integer;
  f,p,eps,x: double;
  h: text;
begin
  assign(h,'Results.txt');
  Rewrite(h);
  x:=nach;
  k:=1;
  p:=1.0;
  f:=p;
  eps:=0.1;
  writeln(h,'Function F=(e^x)*(1+x)');
  while x<=(kon+0.001) do
  begin
       writeln(h,'x = ',x:3:3);
       for i:=1 to 6 do
       begin
            eps:=eps/10;
            write(h,'eps = 10^-',i,', ');
            while Abs(p)>=eps do
                  begin
                       p:=p*x*(k+1)/(k*k);
                       k:=k+1;
                       f:=f+p;
                  end;
            writeln(h,'f = ',f:10:6,', k = ',k);
       end;
       k:=1;
       p:=1.0;
       f:=p;
       writeln(h,'Check = ',Exp(x)*(1+x):10:6);
       x:=x+(kon-(nach))/10;
  end;
  close(h);
end;

procedure TCoolForm.Button1Click(Sender: TObject);
begin
  close;
end;

procedure TCoolForm.Button2Click(Sender: TObject);
begin
  if (Edit1.Text='') or (Edit2.Text='') then Showmessage('Введена пустая строка')
  else
      begin
           if nach>kon then
              begin
                   Showmessage('Error with borders');
                   close;
              end
           else
               begin
                    fun(nach,kon);
                    Label3.caption:=('Результаты записаны в файл Results.txt, можете его открыть');
                    Showmessage('Данные записаны в файл');
               end

      end
  end;

procedure TCoolForm.Edit1Change(Sender: TObject);
var
  s: string;
  r: char;
begin
  Label3.Caption:=('Результаты будут записаны в файл Results.txt');
  s:=Edit1.Text;
  DefaultFormatSettings.DecimalSeparator:='.';
  try
     if Edit1.Text<>'' then
     begin
          r:=s[1];
          if r='-' then
             begin
                  nach:=-1*sysUtils.StrToFloat(copy(s,2,Length(s)-1));
             end
          else
              nach:=sysUtils.StrToFloat(s);
          if nach<-4 then
             begin
                  Showmessage('Error with borders (nach>=-4)');
                  close;
             end;
     end
  except
  end
end;

procedure TCoolForm.Edit2Change(Sender: TObject);
var
  s: string;
  r: char;
begin
  Label3.Caption:=('Результаты будут записаны в файл Results.txt');
  s:=Edit2.Text;
  DefaultFormatSettings.DecimalSeparator:='.';
  try
     if Edit2.Text<>'' then
     begin
          r:=s[1];
          if r='-' then
             begin
                  kon:=-1*sysUtils.StrToFloat(copy(s,2,Length(s)-1));
             end
          else
              kon:=sysUtils.StrToFloat(s);
          if kon>12 then
             begin
                  Showmessage('Error with borders (kon<=12)');
                  close;
             end;
	 end
  except
  end
end;

end.
