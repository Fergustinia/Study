using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace GeometricBrownianMotion
{
    public partial class MainWindow : Window
    {
        private Random rand = new Random();
        private List<double> euroValues = new List<double>();
        private List<double> dollarValues = new List<double>();
        private List<double> timeSteps = new List<double>();
        private double mu = 0.1; 
        private double sigma = 0.2;
        private double dt = 0.1; 
        private int steps = 0;
        private DispatcherTimer timer;
        private bool isRunning = false;

        public MainWindow()
        {
            InitializeComponent();
            InitializeValues();
            SetupTimer();
            UpdateChart();
        }

        private void InitializeValues()
        {
            if (double.TryParse(EuroInitialPrice.Text, out double euroInitial) && double.TryParse(DollarInitialPrice.Text, out double dollarInitial))
            {
                euroValues.Add(euroInitial);
                dollarValues.Add(dollarInitial);
                timeSteps.Add(0.0);
            }
            else
            {
                euroValues.Add(73.0);
                dollarValues.Add(71.0);
                timeSteps.Add(0.0);
                EuroInitialPrice.Text = "73.0";
                DollarInitialPrice.Text = "71.0";
            }
        }

        private void SetupTimer()
        {
            timer = new DispatcherTimer();
            timer.Interval = TimeSpan.FromMilliseconds(500); 
            timer.Tick += Timer_Tick;
        }

        private void Timer_Tick(object sender, EventArgs e)
        {
            if (isRunning)
            {
                double currentEuro = euroValues[euroValues.Count - 1];
                double currentDollar = dollarValues[dollarValues.Count - 1];
                GenerateNextValue(ref currentEuro, ref euroValues);
                GenerateNextValue(ref currentDollar, ref dollarValues);
                timeSteps.Add(timeSteps[timeSteps.Count - 1] + dt);
                steps++;

                UpdateChart();
            }
        }

        private double NextGaussian()
        {
            double u1 = rand.NextDouble();
            double u2 = rand.NextDouble();
            return Math.Sqrt(-2.0 * Math.Log(u1)) * Math.Sin(2.0 * Math.PI * u2);
        }

        private void GenerateNextValue(ref double currentValue, ref List<double> values)
        {
            double w = NextGaussian();
            double nextValue = currentValue * Math.Exp((mu - 0.5 * sigma * sigma) * dt + sigma * Math.Sqrt(dt) * w);
            values.Add(nextValue);
            currentValue = nextValue;
        }

        private void UpdateChart()
        {

            var childrenToRemove = new List<UIElement>();
            foreach (UIElement child in ChartCanvas.Children)
            {
                if (child is Line line && (line.Stroke == Brushes.LimeGreen || line.Stroke == Brushes.Red))
                {
                    childrenToRemove.Add(child);
                }
            }
            foreach (var child in childrenToRemove)
            {
                ChartCanvas.Children.Remove(child);
            }

      
            double minPrice = Math.Min(euroValues.Min(), dollarValues.Min());
            double maxPrice = Math.Max(euroValues.Max(), dollarValues.Max());
            double priceRange = maxPrice - minPrice;
            if (priceRange == 0) priceRange = 1; 

            double timeRange = timeSteps[timeSteps.Count - 1];
            if (timeRange == 0) timeRange = 1;

       
            double xScale = 500.0 / timeRange;
            double yScale = 250.0 / (maxPrice - minPrice + 1); 


            for (int i = 0; i < euroValues.Count - 1; i++)
            {
                double x1 = 50 + timeSteps[i] * xScale;
                double y1 = 300 - (euroValues[i] - minPrice) * yScale;
                double x2 = 50 + timeSteps[i + 1] * xScale;
                double y2 = 300 - (euroValues[i + 1] - minPrice) * yScale;

                var line = new Line
                {
                    X1 = x1,
                    Y1 = y1,
                    X2 = x2,
                    Y2 = y2,
                    Stroke = Brushes.LimeGreen,
                    StrokeThickness = 2
                };
                ChartCanvas.Children.Add(line);
            }

     
            for (int i = 0; i < dollarValues.Count - 1; i++)
            {
                double x1 = 50 + timeSteps[i] * xScale;
                double y1 = 300 - (dollarValues[i] - minPrice) * yScale;
                double x2 = 50 + timeSteps[i + 1] * xScale;
                double y2 = 300 - (dollarValues[i + 1] - minPrice) * yScale;

                var line = new Line
                {
                    X1 = x1,
                    Y1 = y1,
                    X2 = x2,
                    Y2 = y2,
                    Stroke = Brushes.Red,
                    StrokeThickness = 2
                };
                ChartCanvas.Children.Add(line);
            }
        }

        private void StartStopButton_Click(object sender, RoutedEventArgs e)
        {
            isRunning = !isRunning;
            if (isRunning)
            {
                StartStopButton.Content = "Stop";
                timer.Start();
            }
            else
            {
                StartStopButton.Content = "Start";
                timer.Stop();
            }
        }
    }
}