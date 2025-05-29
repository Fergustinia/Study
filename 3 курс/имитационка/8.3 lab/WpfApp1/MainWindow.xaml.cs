using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace Lab8_3
{
    public partial class MainWindow : Window
    {
        public MainWindow() => InitializeComponent();

        private void Start_Click(object sender, RoutedEventArgs e)
        {
            var probs = new List<double>();
            var boxes = new[] { Prob1Box, Prob2Box, Prob3Box, Prob4Box, Prob5Box };

            double total = 0;
            for (int i = 0; i < boxes.Length; i++)
            {
                if (string.IsNullOrWhiteSpace(boxes[i].Text)) continue;
                if (double.TryParse(boxes[i].Text, out double p))
                {
                    probs.Add(p);
                    total += p;
                }
            }

            if (probs.Count < 5 && total < 1.0)
            {
                probs.Add(1.0 - total);
            }

            int N = int.Parse(TrialsBox.Text);
            int[] stats = new int[probs.Count];
            Random rand = new Random();

            for (int i = 0; i < N; i++)
            {
                double r = rand.NextDouble();
                double cumulative = 0;
                for (int j = 0; j < probs.Count; j++)
                {
                    cumulative += probs[j];
                    if (r < cumulative)
                    {
                        stats[j]++;
                        break;
                    }
                }
            }

            ResultsBox.Items.Clear();
            for (int i = 0; i < stats.Length; i++)
            {
                double frequency = (double)stats[i] / N;
                ResultsBox.Items.Add($"Событие {i + 1}: Частота = {frequency:F3}");
            }
        }
    }
}
