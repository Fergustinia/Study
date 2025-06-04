using System;
using System.IO;
using System.Windows;
using System.Windows.Media.Imaging;
using System.Windows.Threading;

namespace WeatherSimulation
{
    public partial class MainWindow : Window
    {
        private DispatcherTimer timer;
        private Random random;
        private int currentState; 
        private int[] stateCounts; 
        private int totalSteps;
        private readonly double[,] transitionMatrix;
        private BitmapImage clearImage;
        private BitmapImage cloudyImage;
        private BitmapImage rainyImage;
        private readonly string imagePath = @"C:\Users\ВЫХУХОЛЬ\Desktop\Labs\Study\3 курс\имитационка\laba 12\WpfApp1\WpfApp1\Images";

        public MainWindow()
        {
            InitializeComponent();
            random = new Random();
            currentState = 1; 
            stateCounts = new int[3]; 
            totalSteps = 0;

     
            try
            {
                clearImage = new BitmapImage(new Uri(Path.Combine(imagePath, "clear.png")));
                cloudyImage = new BitmapImage(new Uri(Path.Combine(imagePath, "cloudy.png")));
                rainyImage = new BitmapImage(new Uri(Path.Combine(imagePath, "rainy.png")));
                CurrentWeatherIcon.Visibility = Visibility.Visible;
                CurrentWeatherText.Visibility = Visibility.Collapsed;
            }
            catch (Exception ex)
            {
                clearImage = null;
                cloudyImage = null;
                rainyImage = null;
                CurrentWeatherIcon.Visibility = Visibility.Collapsed;
                CurrentWeatherText.Visibility = Visibility.Visible;
                MessageBox.Show($"Не удалось загрузить изображения: {ex.Message}. Будет использован текстовый режим.", "Ошибка", MessageBoxButton.OK, MessageBoxImage.Error);
            }

            transitionMatrix = new double[3, 3]
            {
                { 0.4, 0.5, 0.1 },
                { 0.2, 0.4, 0.4 },
                { 0.1, 0.4, 0.5 }
            };

 
            timer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(2) };
            timer.Tick += Timer_Tick;
            timer.Start();

            CalculateStationaryDistribution();
        }

        private void Timer_Tick(object sender, EventArgs e)
        {
       
            currentState = NextState(currentState);
            totalSteps++;
            stateCounts[currentState - 1]++;

     
            UpdateUI();
        }

        private int NextState(int current)
        {
            double r = random.NextDouble();
            double cumulative = 0.0;

            for (int j = 0; j < 3; j++)
            {
                cumulative += transitionMatrix[current - 1, j];
                if (r <= cumulative) return j + 1;
            }
            return 3; 
        }

        private void UpdateUI()
        {
        
            if (clearImage != null && cloudyImage != null && rainyImage != null)
            {
                switch (currentState)
                {
                    case 1:
                        CurrentWeatherIcon.Source = clearImage;
                        break;
                    case 2:
                        CurrentWeatherIcon.Source = cloudyImage;
                        break;
                    case 3:
                        CurrentWeatherIcon.Source = rainyImage;
                        break;
                    default:
                        CurrentWeatherIcon.Source = clearImage;
                        break;
                }
            }
            else
            {
                switch (currentState)
                {
                    case 1:
                        CurrentWeatherText.Text = "Clear";
                        break;
                    case 2:
                        CurrentWeatherText.Text = "Cloudy";
                        break;
                    case 3:
                        CurrentWeatherText.Text = "Rainy";
                        break;
                    default:
                        CurrentWeatherText.Text = "Unknown";
                        break;
                }
            }

    
            double total = totalSteps;
            double clearPercent = total > 0 ? stateCounts[0] * 100.0 / total : 0;
            double cloudyPercent = total > 0 ? stateCounts[1] * 100.0 / total : 0;
            double rainyPercent = total > 0 ? stateCounts[2] * 100.0 / total : 0;

            ClearProgress.Value = clearPercent;
            CloudyProgress.Value = cloudyPercent;
            RainyProgress.Value = rainyPercent;

            ClearCountText.Text = $"{stateCounts[0]} ({clearPercent:F2}%)";
            CloudyCountText.Text = $"{stateCounts[1]} ({cloudyPercent:F2}%)";
            RainyCountText.Text = $"{stateCounts[2]} ({rainyPercent:F2}%)";
        }

        private void CalculateStationaryDistribution()
        {
     
            double[] pi = new double[3] { 1.0 / 3, 1.0 / 3, 1.0 / 3 };
            double[] newPi = new double[3];
            int iterations = 1000;

            for (int iter = 0; iter < iterations; iter++)
            {
                for (int i = 0; i < 3; i++)
                {
                    newPi[i] = 0;
                    for (int j = 0; j < 3; j++)
                    {
                        newPi[i] += pi[j] * transitionMatrix[j, i];
                    }
                }
                pi = (double[])newPi.Clone();
            }

        
            ClearStationaryProgress.Value = pi[0] * 100;
            CloudyStationaryProgress.Value = pi[1] * 100;
            RainyStationaryProgress.Value = pi[2] * 100;

            ClearStationaryText.Text = $"{pi[0] * 100:F2}%";
            CloudyStationaryText.Text = $"{pi[1] * 100:F2}%";
            RainyStationaryText.Text = $"{pi[2] * 100:F2}%";
        }
    }
}