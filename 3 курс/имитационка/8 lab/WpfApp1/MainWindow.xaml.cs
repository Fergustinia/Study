using System;
using System.Windows;

namespace RandomDecision
{
    public partial class MainWindow : Window
    {
        private Random rand = new Random();
        private const double FixedProbability = 0.4; 
        private readonly double[] FixedProbabilities = { 0.2, 0.3, 0.5 }; 
        private readonly string[] MagicBallResponses = { "Да", "Нет", "Судьба закрыта от моих глаз" }; 

        public MainWindow()
        {
            InitializeComponent();
        }

     
        private void GenerateSingleButton_Click(object sender, RoutedEventArgs e)
        {
            double alpha = rand.NextDouble();
            if (alpha < FixedProbability)
            {
                SingleResultText.Text = $"alpha = {alpha:F3}, p = {FixedProbability:F1} => Да";
            }
            else
            {
                SingleResultText.Text = $"alpha = {alpha:F3}, p = {FixedProbability:F1} => Нет";
            }
        }


        private void GenerateGroupButton_Click(object sender, RoutedEventArgs e)
        {
            var probabilities = FixedProbabilities;
            var responses = MagicBallResponses;
            double alpha = rand.NextDouble();
            double cumulativeP = 0;

            for (int i = 0; i < probabilities.Length; i++)
            {
                cumulativeP += probabilities[i];
                if (alpha <= cumulativeP)
                {
                    GroupResultText.Text = $"alpha = {alpha:F3} => {responses[i]}";
                    return;
                }
            }
            GroupResultText.Text = $"alpha = {alpha:F3} => {responses[responses.Length - 1]}";
        }
    }
}