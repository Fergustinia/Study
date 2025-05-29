using LiveCharts;
using LiveCharts.Wpf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace NormalDistributionPlot
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Generate_Click(object sender, RoutedEventArgs e)
        {
            int sampleSize = int.Parse(((ComboBoxItem)SampleSizeComboBox.SelectedItem).Content.ToString());

            Random rand = new Random();
            List<double> data = new List<double>();
            for (int i = 0; i < sampleSize; i++)
            {
                double u1 = 1.0 - rand.NextDouble();
                double u2 = 1.0 - rand.NextDouble();
                double normalSample = Math.Sqrt(-2.0 * Math.Log(u1)) * Math.Cos(2.0 * Math.PI * u2);
                data.Add(normalSample);
            }

            double mean = data.Average();
            double variance = data.Select(x => Math.Pow(x - mean, 2)).Average();

            double expectedMean = 0.0;
            double expectedVariance = 1.0;

            double meanError = 100 * Math.Abs(mean - expectedMean) / expectedVariance;
            double varError = 100 * Math.Abs(variance - expectedVariance) / expectedVariance;

            int binCount = 20;
            double min = data.Min();
            double max = data.Max();
            double binWidth = (max - min) / binCount;

            int[] frequencies = new int[binCount];
            foreach (var value in data)
            {
                int bin = (int)((value - min) / binWidth);
                if (bin == binCount) bin--;
                frequencies[bin]++;
            }

            Chart.Series = new SeriesCollection
            {
                new ColumnSeries
                {
                    Title = "Частота",
                    Values = new ChartValues<int>(frequencies)
                }
            };

            Chart.AxisX.Clear();
            Chart.AxisX.Add(new Axis
            {
                Title = "Интервалы",
                Labels = Enumerable.Range(0, binCount)
                                   .Select(i => $"{(min + i * binWidth):F2}")
                                   .ToArray()
            });

            Chart.AxisY.Clear();
            Chart.AxisY.Add(new Axis
            {
                Title = "Частота"
            });

            double totalSampleSize = sampleSize;
            double[] probabilities = new double[binCount];
            double[] expected = new double[binCount];

            for (int i = 0; i < binCount; i++)
            {
                probabilities[i] = 1.0 / binCount;
                double a = min + i * binWidth;
                double b = a + binWidth;
                expected[i] = sampleSize * (NormalCDF(b) - NormalCDF(a)); 
            }

            double chiSquared = 0;
            for (int i = 0; i < binCount; i++)
            {
                if (expected[i] > 0)
                    chiSquared += Math.Pow(frequencies[i] - expected[i], 2) / expected[i];
            }

            double chiSquaredCriticalValue = 30.14; 

            string chiSquaredResult = chiSquared > chiSquaredCriticalValue ? "true" : "false";

            StatsText.Text = $"Average: {mean:F3} (error = {meanError:F1}%)\n" +
                             $"Variance: {variance:F3} (error = {varError:F1}%)\n" +
                             $"Chi-squared: {chiSquared:F2} > {chiSquaredCriticalValue} is {chiSquaredResult}";
        }

        private double NormalCDF(double x)
        {
            const double p = 0.2316419;
            const double b1 = 0.31938153;
            const double b2 = -0.356563782;
            const double b3 = 1.781477937;
            const double b4 = -1.821255978;
            const double b5 = 1.330274429;
            double t = 1 / (1 + p * Math.Abs(x));
            double t2 = t * t;
            double t3 = t2 * t;
            double t4 = t3 * t;
            double t5 = t4 * t;
            double pdf = (1 / Math.Sqrt(2 * Math.PI)) * Math.Exp(-0.5 * x * x);
            double z = pdf * (b1 * t + b2 * t2 + b3 * t3 + b4 * t4 + b5 * t5);
            return x >= 0 ? 1 - z : z;
        }
    }
}
