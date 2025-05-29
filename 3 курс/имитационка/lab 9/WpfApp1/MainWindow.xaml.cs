using System;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;

namespace ChiSquareDRV
{
    public partial class MainWindow : Window
    {
        private readonly double[] values = { 1, 2, 3, 4 };
        private readonly double[] probs = { 0.25, 0.25, 0.25, 0.25 };

        public MainWindow()
        {
            InitializeComponent();
            SampleSizeComboBox.SelectedIndex = 0;
        }

        private void RunSimulation_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                int N = int.Parse((SampleSizeComboBox.SelectedItem as ComboBoxItem).Content.ToString());
                var result = SimulateDRV(values, probs, N);
                ResultsTextBlock.Text = result;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Ошибка: {ex.Message}");
            }
        }

        private string SimulateDRV(double[] values, double[] probs, int N)
        {
            Random rand = new Random();
            double[] cumulativeProbs = new double[probs.Length];
            cumulativeProbs[0] = probs[0];
            for (int i = 1; i < probs.Length; i++)
                cumulativeProbs[i] = cumulativeProbs[i - 1] + probs[i];

            double[] samples = new double[N];
            for (int i = 0; i < N; i++)
            {
                double r = rand.NextDouble();
                for (int j = 0; j < cumulativeProbs.Length; j++)
                {
                    if (r <= cumulativeProbs[j])
                    {
                        samples[i] = values[j];
                        break;
                    }
                }
            }

            int[] frequencies = new int[values.Length];
            for (int i = 0; i < N; i++)
            {
                int index = Array.IndexOf(values, samples[i]);
                frequencies[index]++;
            }

            double[] empProbs = frequencies.Select(f => (double)f / N).ToArray();

            double Ex = values.Zip(probs, (x, p) => x * p).Sum();
            double Dx = values.Zip(probs, (x, p) => p * x * x).Sum() - Ex * Ex;

            double empEx = samples.Average();
            double empDx = samples.Select(x => x * x).Average() - empEx * empEx;

            double deltaE = Math.Abs(empEx - Ex);
            double deltaD = Math.Abs(empDx - Dx);
            double relDeltaE = deltaE / Math.Abs(Ex);
            double relDeltaD = deltaD / Math.Abs(Dx);

            double chiSquare = 0;
            for (int i = 0; i < values.Length; i++)
            {
                double expected = N * probs[i];
                chiSquare += (frequencies[i] - expected) * (frequencies[i] - expected) / expected;
            }

            int degreesOfFreedom = values.Length - 1;
            double criticalValue = GetChiSquareCriticalValue(degreesOfFreedom, 0.05);

            StringBuilder sb = new StringBuilder();
            sb.AppendLine($"Результаты симуляции для N = {N}");
            sb.AppendLine("\nЭмпирические частоты (n_i):");
            for (int i = 0; i < values.Length; i++)
                sb.AppendLine($"x{i + 1} = {values[i]}: {frequencies[i]}");
            sb.AppendLine("\nЭмпирические вероятности (p_i hat):");
            for (int i = 0; i < values.Length; i++)
                sb.AppendLine($"p{i + 1} hat = {empProbs[i]:F4}");
            sb.AppendLine($"\nТеоретическое мат. ожидание (Ex): {Ex:F4}");
            sb.AppendLine($"Эмпирическое мат. ожидание (E hat x): {empEx:F4}");
            sb.AppendLine($"Теоретическая дисперсия (Dx): {Dx:F4}");
            sb.AppendLine($"Эмпирическая дисперсия (D hat x): {empDx:F4}");
            sb.AppendLine($"Абсолютная погрешность (мат. ожидание): {deltaE:F4}");
            sb.AppendLine($"Относительная погрешность (мат. ожидание): {relDeltaE:F4}");
            sb.AppendLine($"Абсолютная погрешность (дисперсия): {deltaD:F4}");
            sb.AppendLine($"Относительная погрешность (дисперсия): {relDeltaD:F4}");
            sb.AppendLine($"\nСтатистика Хи-квадрат: {chiSquare:F4}");
            sb.AppendLine($"Критическое значение (alpha = 0.05, df = {degreesOfFreedom}): {criticalValue:F4}");
            sb.AppendLine($"Вывод: {(chiSquare <= criticalValue ? "Гипотеза принимается" : "Гипотеза отвергается")}");

            return sb.ToString();
        }

        private double GetChiSquareCriticalValue(int df, double alpha)
        {
            double[] criticalValues = { 3.841, 5.991, 7.815, 9.488, 11.070, 12.592, 14.067, 15.507, 16.919, 18.307 };
            if (df >= 1 && df <= 10)
                return criticalValues[df - 1];
            return -1;
        }
    }
}