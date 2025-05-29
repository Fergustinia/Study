using Microsoft.Win32;
using System;
using System.Text;
using System.Windows;
using System.Threading.Tasks;
using Xceed.Words.NET;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Layout;
using iText.Layout.Element;

namespace DocConverter
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private async void WordToPdf_Click(object sender, RoutedEventArgs e)
        {
            await ConvertDocument(true);
        }

        private async void PdfToWord_Click(object sender, RoutedEventArgs e)
        {
            await ConvertDocument(false);
        }

        private async Task ConvertDocument(bool isWordToPdf)
        {
            try
            {
                var filter = isWordToPdf ?
                    ("Word Files|*.docx", "pdf") :
                    ("PDF Files|*.pdf", "docx");

                var inputFile = ShowOpenDialog(filter.Item1);
                if (string.IsNullOrEmpty(inputFile)) return;

                var outputFile = ShowSaveDialog(
                    isWordToPdf ? "PDF Files|*.pdf" : "Word Files|*.docx",
                    System.IO.Path.ChangeExtension(inputFile, $".{filter.Item2}")
                );

                if (string.IsNullOrEmpty(outputFile)) return;

                StatusText.Text = "Конвертация...";

                await Task.Run(() =>
                {
                    if (isWordToPdf)
                        ConvertWordToPdf(inputFile, outputFile);
                    else
                        ConvertPdfToWord(inputFile, outputFile);
                });

                StatusText.Text = "Готово!";
                MessageBox.Show("Конвертация завершена!", "Успех",
                    MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                StatusText.Text = "Ошибка";
                MessageBox.Show($"Ошибка: {ex.Message}", "Ошибка",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void ConvertWordToPdf(string inputPath, string outputPath)
        {
            using (var doc = DocX.Load(inputPath))
            using (var writer = new PdfWriter(outputPath))
            using (var pdf = new PdfDocument(writer))
            using (var document = new Document(pdf))
            {
                document.Add(new Paragraph(doc.Text));
            }
        }

        private void ConvertPdfToWord(string inputPath, string outputPath)
        {
            var text = new StringBuilder();

            using (var reader = new PdfReader(inputPath))
            using (var pdfDoc = new PdfDocument(reader))
            {
                for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
                {
                    text.Append(PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i)));
                }
            }

            using (var doc = DocX.Create(outputPath))
            {
                doc.InsertParagraph(text.ToString());
                doc.Save();
            }
        }

        private string ShowOpenDialog(string filter)
        {
            var dialog = new OpenFileDialog()
            {
                Filter = filter,
                Title = "Выберите файл для конвертации"
            };
            return dialog.ShowDialog() == true ? dialog.FileName : null;
        }

        private string ShowSaveDialog(string filter, string defaultFileName)
        {
            var dialog = new SaveFileDialog()
            {
                Filter = filter,
                FileName = defaultFileName,
                Title = "Сохранить файл"
            };
            return dialog.ShowDialog() == true ? dialog.FileName : null;
        }
    }
}