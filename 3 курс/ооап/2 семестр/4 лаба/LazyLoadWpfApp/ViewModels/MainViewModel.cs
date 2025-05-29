using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using LazyLoadFlagDemo.Models;

namespace LazyLoadFlagDemo.ViewModels
{
    public class MainViewModel : INotifyPropertyChanged
    {
        private Lazy<Task<OrderHistory>> _ordersTaskLazy;
        private int _ordersFlag; // 0 - не загружено, 1 - загружается, 2 - загружено
        private OrderHistory _orders;
        private bool _isDataVisible;

        public event PropertyChangedEventHandler PropertyChanged;

        public MainViewModel()
        {
            ResetCache();
            IsDataVisible = false;
        }

        public OrderHistory Orders
        {
            get => _orders;
            private set
            {
                _orders = value;
                OnPropertyChanged(nameof(Orders));
            }
        }

        public int OrdersFlag
        {
            get => _ordersFlag;
            private set
            {
                if (_ordersFlag != value)
                {
                    _ordersFlag = value;
                    OnPropertyChanged(nameof(OrdersFlag));
                }
            }
        }

        public bool IsDataVisible
        {
            get => _isDataVisible;
            set
            {
                if (_isDataVisible != value)
                {
                    _isDataVisible = value;
                    OnPropertyChanged(nameof(IsDataVisible));
                }
            }
        }

        public async Task LoadDataAsync()
        {
            if (OrdersFlag == 0)
            {
                OrdersFlag = 1; // Загрузка
                OnPropertyChanged(nameof(OrdersFlag));

                var data = await _ordersTaskLazy.Value;
                Orders = data;

                OrdersFlag = 2; // Загружено
                OnPropertyChanged(nameof(OrdersFlag));
            }
        }

        public async Task ShowDataAsync()
        {
            if (OrdersFlag == 0)
            {
                await LoadDataAsync();
            }
            IsDataVisible = true;
        }

        public void ResetCache()
        {
            OrdersFlag = 0;
            Orders = null;
            _ordersTaskLazy = new Lazy<Task<OrderHistory>>(() => LoadOrdersAsync());
            IsDataVisible = false;
            OnPropertyChanged(nameof(OrdersFlag));
            OnPropertyChanged(nameof(Orders));
            OnPropertyChanged(nameof(IsDataVisible));
        }

        private async Task<OrderHistory> LoadOrdersAsync()
        {
            await Task.Delay(1500); // Имитация долгой загрузки
            return new OrderHistory
            {
                Orders = new List<Order>
                {
                    new Order { Date = DateTime.Now.AddDays(-1), TotalAmount = 100m },
                    new Order { Date = DateTime.Now.AddDays(-2), TotalAmount = 200m },
                    new Order { Date = DateTime.Now.AddDays(-3), TotalAmount = 150m }
                }
            };
        }

        protected void OnPropertyChanged(string propertyName) =>
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
