import heapq
import random
import tkinter as tk
from tkinter import scrolledtext

class Client:
    def __init__(self, id, arrival_time, mu):
        self.id = id
        self.arrival_time = arrival_time
        self.service_time = random.expovariate(1 / mu)

class Operator:
    def __init__(self, id):
        self.id = id
        self.is_busy = False
        self.current_client = None

class Event:
    def __init__(self, time):
        self.time = time

    def process(self, simulation):
        pass

class ArrivalEvent(Event):
    def __init__(self, time, client):
        super().__init__(time)
        self.client = client

    def process(self, simulation):
        simulation.log(f"Время {simulation.time:.2f}: Клиент {self.client.id} прибыл")
        available_operators = [op for op in simulation.operators if not op.is_busy]
        if available_operators:
            op = available_operators[0]
            op.is_busy = True
            op.current_client = self.client
            completion_time = simulation.time + self.client.service_time
            completion_event = ServiceCompletionEvent(completion_time, op, self.client)
            heapq.heappush(simulation.event_queue, (completion_time, completion_event))
            simulation.log(f"Время {simulation.time:.2f}: Оператор {op.id} начал обслуживать Клиента {self.client.id}")
        else:
            simulation.queue.append(self.client)
            simulation.log(f"Время {simulation.time:.2f}: Клиент {self.client.id} встал в очередь (длина очереди: {len(simulation.queue)})")
        next_arrival_time = simulation.time + random.expovariate(simulation.lambd)
        next_client_id = simulation.next_client_id
        simulation.next_client_id += 1
        next_client = Client(next_client_id, next_arrival_time, simulation.mu)
        next_arrival_event = ArrivalEvent(next_arrival_time, next_client)
        heapq.heappush(simulation.event_queue, (next_arrival_time, next_arrival_event))

class ServiceCompletionEvent(Event):
    def __init__(self, time, operator, client):
        super().__init__(time)
        self.operator = operator
        self.client = client

    def process(self, simulation):
        simulation.log(f"Время {simulation.time:.2f}: Оператор {self.operator.id} закончил обслуживать Клиента {self.client.id}")
        self.operator.is_busy = False
        self.operator.current_client = None
        if simulation.queue:
            next_client = simulation.queue.pop(0)
            self.operator.is_busy = True
            completion_time = simulation.time + next_client.service_time
            self.operator.current_client = next_client
            completion_event = ServiceCompletionEvent(completion_time, self.operator, next_client)
            heapq.heappush(simulation.event_queue, (completion_time, completion_event))
            simulation.log(f"Время {simulation.time:.2f}: Оператор {self.operator.id} начал обслуживать Клиента {next_client.id} из очереди")

class Simulation:
    def __init__(self, root, N, lambd, mu, max_time):
        self.root = root
        self.time = 0
        self.max_time = max_time
        self.operators = [Operator(i) for i in range(N)]
        self.queue = []
        self.event_queue = []
        self.next_client_id = 0
        self.lambd = lambd
        self.mu = mu
        self.time_scale = 100
        self.running = False
        self.setup_gui()
  
        first_arrival_time = random.expovariate(lambd)
        first_client = Client(self.next_client_id, first_arrival_time, self.mu)
        self.next_client_id += 1
        first_arrival_event = ArrivalEvent(first_arrival_time, first_client)
        heapq.heappush(self.event_queue, (first_arrival_time, first_arrival_event))

    def setup_gui(self):
        self.root.title("Симуляция офиса банка")
        self.root.geometry("600x400")

        self.time_label = tk.Label(self.root, text="Время: 0.00", font=("Arial", 12))
        self.time_label.pack(pady=10)

        self.queue_label = tk.Label(self.root, text="Длина очереди: 0", font=("Arial", 12))
        self.queue_label.pack()

        self.operator_labels = []
        for i in range(len(self.operators)):
            label = tk.Label(self.root, text=f"Оператор {i}: Свободен", font=("Arial", 10))
            label.pack()
            self.operator_labels.append(label)

        self.log_text = scrolledtext.ScrolledText(self.root, height=10, width=60, font=("Arial", 10))
        self.log_text.pack(pady=10)

        self.start_stop_button = tk.Button(self.root, text="Запустить симуляцию", command=self.toggle_simulation)
        self.start_stop_button.pack()

    def log(self, message):
        self.log_text.insert(tk.END, message + "\n")
        self.log_text.see(tk.END)

    def toggle_simulation(self):
        if not self.running:
            self.running = True
            self.start_stop_button.config(text="Остановить симуляцию")
            self.update_simulation()
        else:
            self.running = False
            self.start_stop_button.config(text="Запустить симуляцию")

    def update_simulation(self):
        if not self.running or self.time >= self.max_time:
            self.running = False
            self.start_stop_button.config(text="Запустить симуляцию")
            self.log("Симуляция завершена.")
            return

        self.time += 0.1  
        self.time_label.config(text=f"Время: {self.time:.2f}")

        while self.event_queue and self.event_queue[0][0] <= self.time:
            event_time, event = heapq.heappop(self.event_queue)
            self.time = event_time
            event.process(self)

        self.queue_label.config(text=f"Длина очереди: {len(self.queue)}")
        for i, op in enumerate(self.operators):
            status = f"Оператор {i}: {'Занят (Клиент ' + str(op.current_client.id) + ')' if op.is_busy else 'Свободен'}"
            self.operator_labels[i].config(text=status)

        self.root.after(100, self.update_simulation)

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    N = 3  
    lambd = 4  
    mu = 0.333  
    max_time = 100  
    root = tk.Tk()
    simulation = Simulation(root, N, lambd, mu, max_time)
    simulation.run()
