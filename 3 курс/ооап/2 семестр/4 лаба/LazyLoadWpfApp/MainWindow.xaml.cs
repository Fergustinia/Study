using LazyLoadFlagDemo.ViewModels;
using System.Threading.Tasks;
using System.Windows;

namespace LazyLoadFlagDemo
{
    public partial class MainWindow : Window
    {
        private MainViewModel _vm;

        public MainWindow()
        {
            InitializeComponent();
            _vm = (MainViewModel)DataContext;
        }

        private async void LoadData_Click(object sender, RoutedEventArgs e)
        {
            await _vm.LoadDataAsync();
            // При загрузке не показываем данные
            _vm.IsDataVisible = false;
        }

        private async void ShowData_Click(object sender, RoutedEventArgs e)
        {
            await _vm.ShowDataAsync();
        }

        private void ResetCache_Click(object sender, RoutedEventArgs e)
        {
            _vm.ResetCache();
            MessageBox.Show("Кэш сброшен. Данные будут загружены заново.");
        }
    }
}
