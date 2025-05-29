using System.Windows;
using LazyLoadNoCacheDemo.ViewModels;

namespace LazyLoadNoCacheDemo
{
    public partial class MainWindow : Window
    {
        private MainViewModel _vm;

        public MainWindow()
        {
            InitializeComponent();
            _vm = (MainViewModel)DataContext;
        }

        private async void Load_Click(object sender, RoutedEventArgs e)
        {
            await _vm.LoadDataAsync();
        }
    }
}
