using System;
using System.Globalization;
using System.Windows.Data;

namespace LazyLoadNoCacheDemo.Converters
{
    public class FlagToStatusConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            int flag = 0;
            if (value is int)
                flag = (int)value;

            switch (flag)
            {
                case 0:
                    return "Данные не загружены";
                case 1:
                    return "Загрузка...";
                case 2:
                    return "Данные загружены";
                default:
                    return "Неизвестный статус";
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
