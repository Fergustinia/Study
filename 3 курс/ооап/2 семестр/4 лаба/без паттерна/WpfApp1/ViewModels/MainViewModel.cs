using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using LazyLoadNoCacheDemo.Models;

namespace LazyLoadNoCacheDemo.ViewModels
{
    public class MainViewModel : INotifyPropertyChanged
    {
        private OrderHistory _orders;
        private int _ordersFlag; // 0 - не загружено, 1 - загружается, 2 - загружено

        public event PropertyChangedEventHandler PropertyChanged;

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
                _ordersFlag = value;
                OnPropertyChanged(nameof(OrdersFlag));
            }
        }

        public async Task LoadDataAsync()
        {
            OrdersFlag = 1;
            await Task.Delay(1500); // Имитация загрузки

            Orders = new OrderHistory
            {
                Orders = new List<Order>
                {
                    new Order { Date = DateTime.Now.AddDays(-1), TotalAmount = 100 },
                    new Order { Date = DateTime.Now.AddDays(-2), TotalAmount = 200 },
                    new Order { Date = DateTime.Now.AddDays(-3), TotalAmount = 300 }
                }
            };

            OrdersFlag = 2;
        }

        private void OnPropertyChanged(string propertyName) =>
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
