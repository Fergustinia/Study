   M S B A M L   `   `   `  ����U  QLiveCharts.Wpf, Version=0.9.7.0, Culture=neutral, PublicKeyToken=0bc1f845d1ebb8dfG4clr-namespace:LiveCharts.Wpf;assembly=LiveCharts.WpfLiveCharts.Wpf  5   	   
 lab 11'   !NormalDistributionPlot.MainWindow   5   	   R NWindowsBase, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\ XPresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35W SPresentationCore, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35D 9http://schemas.microsoft.com/winfx/2006/xaml/presentation    5   	   Blvc4clr-namespace:LiveCharts.Wpf;assembly=LiveCharts.Wpf    5   	   R NSystem.Xaml, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     5   	     � Title$  Normal Distribution��5   	   $	��450��6%   $	��800��62   .��5      � $��10q�6    � RowDefinitions 5   
   �� 5      $
��Auto �6   �� 5	      $��* �6   �� 5
      $
��Auto �6   .+�5   
   ��  �� Orientation$ 
Horizontal=�6   $��0,0,0,10q�6.   .+�5      �� $"��Размер выборки:��6   $��Center=�6.   �� 5      -   5         ��Name$ SampleSizeComboBox��5      $	��100��63   $	��5,0q�6?    �� SelectedIndex$ 0��6L   .@�5      �� $��10��6   �� 5      $	��100��6   �� 5      $
��1000��6   �� 5      $��10000��6   5      �� 5      -   5        $ ��Сгенерировать��5      6-   5      #   LiveCharts.Wpf.CartesianChart  5   
   -   5          Name$ Chart��5      $��1��6,   �� 5   
   -   5         ��Name$ 	StatsText��5      $��2��6'   $��	10,10,0,0q�64   $��Consolas)�5      $��14(�6&   $
��Wrap=�64   5      5      