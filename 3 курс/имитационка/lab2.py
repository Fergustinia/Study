import random
import time
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import tkinter as tk
from tkinter import ttk

# Инициализация начальных курсов
initial_usd = 75.0
initial_eur = 85.0

# Коэффициент изменения
k = 0.1

# Функция для обновления курса
def update_rate(rate):
    return rate * (1 + k * (random.random() - 0.5))

# Инициализация данных для графиков
usd_rates = [initial_usd]
eur_rates = [initial_eur]
times = [0]

# Создание графика
fig, ax = plt.subplots()
ax.set_xlabel('Время')
ax.set_ylabel('Курс в рублях')
usd_line, = ax.plot(times, usd_rates, label='USD')
eur_line, = ax.plot(times, eur_rates, label='EUR')
ax.legend()

# Функция для обновления графика
def update_plot(frame):
    if running:
        usd_rates.append(update_rate(usd_rates[-1]))
        eur_rates.append(update_rate(eur_rates[-1]))
        times.append(times[-1] + 1)
        usd_line.set_data(times, usd_rates)
        eur_line.set_data(times, eur_rates)
        ax.relim()
        ax.autoscale_view()
    return usd_line, eur_line

# Флаг для управления циклом
running = False

# Функции для управления кнопками
def start():
    global running
    running = True

def stop():
    global running
    running = False

# Создание окна Tkinter
root = tk.Tk()
root.title("Моделирование курса валют")

# Кнопки управления
start_button = ttk.Button(root, text="Старт", command=start)
stop_button = ttk.Button(root, text="Стоп", command=stop)

start_button.pack(pady=10)
stop_button.pack(pady=10)

# Запуск анимации
ani = FuncAnimation(fig, update_plot, interval=1000)

# Запуск основного цикла Tkinter
plt.show(block=False)
root.mainloop()