using System;
using System.Collections.Generic;

namespace LazyLoadNoCacheDemo.Models
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
