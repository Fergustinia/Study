   M S B A M L   `   `   `  ����  WpfApp1    ChiSquareDRV.MainWindow   5   	   R NWindowsBase, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\ XPresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35W SPresentationCore, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35D 9http://schemas.microsoft.com/winfx/2006/xaml/presentation    5   	   R NSystem.Xaml, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     5   	     � Title$-  'Симуляция ДСВ с Chi-Square��5   	   $	��600��6,   $	��800��69   .��5      � $��10q�6    � RowDefinitions 5   
   �� 5      $
��Auto �6   �� 5      $
��Auto �6   �� 5	      $��* �6   .+�5   
   �� $��0��6    �� Orientation$ 
Horizontal=�6"   $��0,0,0,10q�6;   .+�5      �� $7��1Выберите размер выборки (N):��6   $��Center=�6<   $��0,0,10,0q�6W   �� 5      -   5         ��Name$ SampleSizeComboBox��5      $	��100��63   .@�5      �� $��10��6   �� 5      $	��100��6   �� 5      $
��1000��6   �� 5      $��10000��6   5      5      �� 5   
   -   5        $��1��5      $+��%Запустить симуляцию��6   $	��150��6X   $
��Left=�6d   $��0,0,0,10q�6   �� 5   
   $��2��6   .��5      �� -   5         ��Name$ ResultsTextBlock��5      $
��Wrap=�62   5      5      5      