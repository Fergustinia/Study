using System;
using System.Collections.Generic;

namespace LazyLoadFlagDemo.Models
{
    public class Order
    {
        public DateTime Date { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class OrderHistory
    {
        public List<Order> Orders { get; set; }
    }
}
