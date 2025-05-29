using System;
using System.Text;
using System.Windows;

namespace PoissonDistribution
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            UpdateResults(1); 
        }

        private void CalculateButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (LambdaInput == null)
                {
                    MessageBox.Show("Ошибка: LambdaInput не инициализирован.");
                    return;
                }

                if (ResultLabel == null)
                {
                    MessageBox.Show("Ошибка: ResultLabel не инициализирован.");
                    return;
                }

                if (ResultsTextBlock == null)
                {
                    MessageBox.Show("Ошибка: ResultsTextBlock не инициализирован.");
                    return;
                }

                if (double.TryParse(LambdaInput.Text, out double lambda))
                {
                    if (lambda <= 0)
                    {
                        MessageBox.Show("λ должно быть больше 0.");
                        return;
                    }
                    if (lambda > 50)
                    {
                        MessageBox.Show("λ слишком большое. Пожалуйста, выберите значение не больше 50.");
                        return;
                    }

                    UpdateResults(lambda);
                    int x = CalculateX(lambda);
                    ResultLabel.Content = $"x = min {x}, где Σ(ln α_i) < -λ";
                }
                else
                {
                    MessageBox.Show("Введите корректное положительное число для λ.");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Произошла ошибка в CalculateButton_Click: {ex.Message}");
            }
        }

        private void UpdateResults(double lambda)
        {
            try
            {
                StringBuilder results = new StringBuilder();
                results.AppendLine($"Распределение Пуассона для λ = {lambda}:");
                results.AppendLine("m    P(x = m)");
                results.AppendLine("----------------");

                for (int m = 0; m <= 20; m++)
                {
                    double probability = PoissonProbability(m, lambda);
                    if (double.IsNaN(probability) || double.IsInfinity(probability))
                    {
                        MessageBox.Show($"Некорректное значение вероятности для m={m}: {probability}");
                        return;
                    }
                    results.AppendLine($"{m,-4} {probability:F6}");
                }

                ResultsTextBlock.Text = results.ToString();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Произошла ошибка в UpdateResults: {ex.Message}");
            }
        }

        private double PoissonProbability(int m, double lambda)
        {
        
            double logNumerator = m * Math.Log(lambda);
            double logDenominator = LogFactorial(m);
            double logResult = logNumerator - logDenominator - lambda;
            return Math.Exp(logResult);
        }

        private double LogFactorial(int n)
        {
            if (n <= 1) return 0;
            double result = 0;
            for (int i = 2; i <= n; i++)
            {
                result += Math.Log(i);
            }
            return result;
        }

        private int CalculateX(double lambda)
        {
            double sum = 0;
            int m = 0;
            Random rand = new Random();
            double alphaThreshold = -lambda;

            while (true)
            {
                double alpha = Math.Log(rand.NextDouble());
                sum += alpha;
                if (sum < alphaThreshold)
                {
                    return m;
                }
                m++;
            }
        }
    }
}