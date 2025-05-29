#include <iostream>
#include <string>
#include <vector>
#include <unordered_set>

using namespace std;

class SList {
public:
    SList() : head(nullptr), tail(nullptr), size(0) {} // конструктор

    ~SList() {
        while (head) { // деструктор
            auto next = head->next;
            delete head;
            head = next;
        }
    }

    bool contains(const string& str, int& comparisons) { // Проверяет, содержит ли список заданную строку. O(size)
        for (auto node = head; node; node = node->next) {
            comparisons++;
            if (node->str == str) {
                return true;
            }
        }
        return false;
    }

    void add(const string& str, int& comparisons) { // Добавить элемент в список O(size)
        if (!contains(str, comparisons)) {
            auto node = new Node{ str, nullptr };
            if (tail) {
                tail->next = node;
            }
            else {
                head = node;
            }
            tail = node;
            size++;
        }
    }

    void addDirectly(const string& str) { // Добавить элемент без проверки уникальности O(1)
        auto node = new Node{ str, nullptr };
        if (tail) {
            tail->next = node;
        }
        else {
            head = node;
        }
        tail = node;
        size++;
    }

    void merge(SList* other) { // Объединение списков O(size + other->size)

        if (!other->head) return; // если другой список пуст, ничего не делаем
        if (!head) {
            head = other->head;
            tail = other->tail;
            size = other->size;
        }
        else {
            tail->next = other->head;
            tail = other->tail;
            size= size+other->size;
        }
        other->head = other->tail = nullptr; 
       
    }
    
   

    int getSize() const {
        return size;
    }

    void print() const {
        cout << size << endl;
        for (Node* a = head; a; a = a->next) {
            cout << a->str << " ";
        }
        cout << endl;
    }

private:
   
    int size;

public:
    struct Node {
        string str;
        Node* next;
    };

    Node* head;
    Node* tail;
};

class HashTable {
public:
    HashTable(int q) : q(q), table(q, nullptr), total_comparisons(0) {} // конструктор

    ~HashTable() { // деструктор
        for (auto& list : table) {
            delete list;
        }   
    }

    int hash(const string& str) const { // Хэширует заданную строку.
        int hash = 0;
        for (char ch : str) {
            hash = (hash * 31 + ch) % q; // полином по схеме Горнера
        }
        return hash;
    }

    void add(const string& str) { // Добавляет заданную строку в хэш-таблицу.
        auto index = hash(str);
        if (!table[index]) {
            table[index] = new SList();
        }
        table[index]->add(str, total_comparisons);
    }

    SList* merge() { // Объединяет все списки в таблице в один список O(n)
        auto merged = new SList();
        for (auto& list : table) {
            if (list) {
                merged->merge(list);
                 
            }
        }
        return merged;
    }


    int get_num_unique_strings() { // кол-во уникальных строк
        SList* merged = merge();
        int count = merged->getSize();
        return count;
    }

    int get_num_comparisons() const { // Получить общее количество сравнений
        return total_comparisons;
    }

private:
    int q;
    int total_comparisons;
    vector<SList*> table;
   
};

int main() {
    setlocale(LC_ALL, "RU");
    int n, q;
    cout << "Введите количество строк: ";
    cin >> n;
    if (n <= 100000000) {
        cout << endl;
        cout << "Введите размер хэш-таблицы: ";
        cin >> q;

        HashTable hashTable(q); // инициализируем хеш таблицу

        for (int i = 0; i < n; i++) { // O(n), n -- количество строк
            int len = 3; // фиксированная длина строки
            string line;
            for (int j = 0; j < len; j++) {
                line += (char)('a' + rand() % 26);
            }
            hashTable.add(line); // O(1) добавляем сгенерированную строку в хеш таблицу
        }

        //auto uniqueLines = hashTable.merge(); // O(n), объединяем в один большой список для чтения

        cout << "Количество сравнений: " << hashTable.get_num_comparisons() << endl;
        cout << "Количество уникальных строк: " << hashTable.get_num_unique_strings() << endl;

        
    }

    return 0;
}
