#include <iostream>
#include <fstream>
#include <string>
#include <vector>


using namespace std;

class SList {
public:
	SList() : head(nullptr), tail(nullptr), size(0), num_comparisons(0) {} // конструктор

	~SList() {
		while (head) { // деструктор
			auto next = head->next;
			delete head;
			head = next;
		}
	}

	bool contains(const string& str) { //Проверяет, содержит ли список заданную строку.
		int i = 0;
		for (auto node = head; node; node = node->next) {
			num_comparisons++;
			if (node->str == str) {
				return true;
			}
		}

		return false;
	}

	void add(const string& str) { // добавить элемент в список

		if (!contains(str)) {
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

	SList* merge(SList* other) { // объединение списков
		auto merged = new SList();
		for (auto node = head; node; node = node->next) {
			merged->add(node->str);
		}
		for (auto node = other->head; node; node = node->next) {
			merged->add(node->str);
		}
		return merged;
	}

	int get_num_comparisons() const {//кол-во сравнений
		return num_comparisons;
	}

private:
	struct Node { // узел
		string str;
		Node* next;
	};
	int size;
	int num_comparisons;
public:
	Node* head;
	Node* tail;



};

class HashTable {
public:
	HashTable(int q) : q(q), table(q, nullptr) {} // конструктор

	~HashTable() { // деструктор
		for (auto& list : table) {
			delete list;
		}
	}

	int hash(const string& str) const { // Хэширует заданную строку.
		int hash = 0;
		for (int i = 0; i < str.size(); i++) {
			hash = (hash * 31 + str[i]) % q; // полином по схеме Горнера
		}
		return hash;
	}

	void add(const string& str) { // Добавляет заданную строку в хэш-таблицу.
		auto index = hash(str);
		if (!table[index]) {
			table[index] = new SList();
		}
		table[index]->add(str);
	}

	SList* merge() { // Объединяет все списки в таблице в один список.
		auto merged = new SList();
		for (auto& list : table) {
			if (list) {
				merged = merged->merge(list);
			}
		}
		return merged;
	}
	int get_num_unique_strings() const { //кол-во уникальных строк
		int count = 0;
		for (auto& list : table) {
			if (list) {
				count++;
			}
		}
		return count;
	}
private:
	int q;
	vector<SList*> table;
};

int main() {
	setlocale(LC_ALL, "RU");
	int n, q;
	cout << "Введите количество строк: ";
	cin >> n;
	if (n <= 100000) {
		cout << endl;
		cout << "Введите размер хэш-таблицы: ";
		cin >> q;

		ofstream file("hash.txt");
		for (int i = 0; i < n; i++) {
			int len = rand() % 15;
			string line;
			for (int j = 0; j < len; j++) {
				line += (char)('a' + rand() % 25);
			}
			file << line << endl;
		}
		file.close();

		HashTable hashTable(q); // инициализируем хеш таблицу
		ifstream input("hash.txt");
		string line;
		while (getline(input, line)) {// читаем строки
			hashTable.add(line);
		}
		input.close();

		auto uniqueLines = hashTable.merge(); //объединяем в один большой список для чтнеия

		cout << "Уникальные значения:" << endl;
		int counts_of_result = 0;
		for (auto node = uniqueLines->head; node; node = node->next) {
			cout << node->str << endl;
			counts_of_result++;
		}
		cout << "кол-во уникальных значений: " << counts_of_result << endl;
		cout << "Количество сравнений: " << uniqueLines->get_num_comparisons() << endl;
		cout << "Количество уникальных строк: " << hashTable.get_num_unique_strings() << endl;
	}


	return 0;
}