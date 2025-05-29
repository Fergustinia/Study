#include <iostream>
#include <vector>

class LunarMap {
private:
    // Статический экземпляр класса
    static LunarMap* instance;

    // Приватный конструктор для предотвращения создания экземпляров извне
    LunarMap() : shrinesActivated(0), totalShrines(3) { // Предположим, что всего 3 святилища
        std::cout << "Лунная карта создана. Абсолютная тьма покрывает Луну.\n";
    }

    int shrinesActivated;  // Количество активированных святилищ
    const int totalShrines; // Общее количество святилищ

    // Приватный деструктор
    ~LunarMap() {
        std::cout << "Лунная карта уничтожена.\n";
    }

public:
    // Статический метод для получения единственного экземпляра
    static LunarMap* getInstance() {
        if (instance == nullptr) {
            instance = new LunarMap();
        }
        return instance;
    }

    // Метод для активации святилища
    void activateShrine() {
        if (shrinesActivated < totalShrines) {
            shrinesActivated++;
            std::cout << "Святилище активировано (" << shrinesActivated
                << "/" << totalShrines << ").\n";
            revealMoon();
        }
        else {
            std::cout << "Все святилища уже активированы!\n";
        }
    }

    // Метод для отображения текущего состояния Луны
    void revealMoon() const {
        if (shrinesActivated == 0) {
            std::cout << "Карта покрыта абсолютной тьмой. Ничего не видно.\n";
        }
        else if (shrinesActivated < totalShrines) {
            std::cout << "Лунное сияние частично раскрывает секреты Луны ("
                << shrinesActivated * 33 << "% открыто).\n";
        }
        else {
            std::cout << "Тьма полностью рассеялась! Луна полностью открыта!\n";
        }
    }

    // Метод для уничтожения экземпляра (опционально)
    static void destroyInstance() {
        if (instance != nullptr) {
            delete instance;
            instance = nullptr;
        }
    }
};

// Инициализация статического члена
LunarMap* LunarMap::instance = nullptr;

int main() {
    setlocale(LC_ALL, "RUS");

    // Получаем экземпляр карты
    LunarMap* map = LunarMap::getInstance();

    // Тестируем функциональность
    map->revealMoon();         // Начальное состояние
    map->activateShrine();     // Активируем первое святилище
    map->activateShrine();     // Активируем второе святилище
    map->activateShrine();     // Активируем третье святилище
    map->activateShrine();     // Пробуем активировать лишнее

    // Уничтожаем экземпляр
    LunarMap::destroyInstance();

    return 0;
}