unit mmmemo3;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Forms, Controls, Graphics, Dialogs, StdCtrls;

type

  { TForm1 }

  TForm1 = class(TForm)
    EditText: TEdit;
    Label1: TLabel;
    LinearButton: TButton;
    ExitButton: TButton;
    BoxList: TListBox;
    procedure Button1Click(Sender: TObject);
    procedure ExitButtonClick(Sender: TObject);
    procedure LinearButtonClick(Sender: TObject);
  private

  public

  end;

var
  Form1: TForm1;

implementation

{$R *.lfm}


type indexation = ^list;
    list = record
    data :integer;
    address:indexation;
  end;



var
  n:integer;


  //Процедура Линейного списка
  procedure Gener_Line_List(kol:integer);
  var i:integer;
    index_start,index_next,head_1:indexation;
    sstring:TStringList;
  begin
    randomize;
    sstring:=TStringList.Create;

    new(index_start);
    head_1:= index_start;
    index_start^.data:=(Random(999-(-999)+1)+(-999));
    index_start^.address:= nil;

    for i:=2 to kol do
    begin
      new(index_next);
      index_next^.data:=(Random(999-(-999)+1)+(-999));
      index_next^.address:=nil;
      index_start^.address:=index_next;
      index_start:=index_next;
    end;

    for i:=1 to kol do
    begin
      sstring.Add(intTostr(head_1^.data));
      head_1:=head_1^.address;
    end;

    Form1.BoxList.Items.Assign(sstring);


  end;

  { TForm1 }

  procedure TForm1.ExitButtonClick(Sender: TObject);
  begin
    close;
  end;

  procedure TForm1.Button1Click(Sender: TObject);
  begin

  end;

procedure TForm1.LinearButtonClick(Sender: TObject);
begin

    n:=StrToInt(EditText.Text);
     Gener_Line_List(n);
  end;

end.






