#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <random>
#include <limits>
#include <queue>
#include <numeric> // Для iota

using namespace std;

struct Point {
    double x, y;
};

struct Edge {
    int u, v;
    double weight;

    bool operator<(const Edge& other) const {
        return weight > other.weight; // Для приоритетной очереди, меньшее значение имеет больший приоритет
    }
};

double euclidean_distance(const Point& a, const Point& b) {
    return sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

void generate_random_points(vector<Point>& points, int N) {
    random_device rd;
    mt19937 gen(rd());
    uniform_real_distribution<> dis(0.0, 1.0);

    points.resize(N);
    for (int i = 0; i < N; ++i) {
        points[i] = { dis(gen), dis(gen) };
    }
}

int find_set(int u, vector<int>& parent) {
    if (parent[u] != u) {
        parent[u] = find_set(parent[u], parent); // Path compression
    }
    return parent[u];
}

void union_sets(int u, int v, vector<int>& parent, vector<int>& rank) {
    int root_u = find_set(u, parent);
    int root_v = find_set(v, parent);

    if (root_u != root_v) {
        if (rank[root_u] > rank[root_v]) {
            parent[root_v] = root_u;
        }
        else if (rank[root_u] < rank[root_v]) {
            parent[root_u] = root_v;
        }
        else {
            parent[root_v] = root_u;
            rank[root_u]++;
        }
    }
}

void print_cluster_info(const vector<vector<int>>& clusters, const vector<Point>& points) {
    for (size_t i = 0; i < clusters.size(); ++i) {
        const auto& cluster = clusters[i];
        int num_vertices = cluster.size();
        double min_x = numeric_limits<double>::max();
        double max_x = numeric_limits<double>::lowest();
        double min_y = numeric_limits<double>::max();
        double max_y = numeric_limits<double>::lowest();
        double sum_x = 0.0, sum_y = 0.0;

        for (int idx : cluster) {
            const Point& p = points[idx];
            min_x = min(min_x, p.x);
            max_x = max(max_x, p.x);
            min_y = min(min_y, p.y);
            max_y = max(max_y, p.y);
            sum_x += p.x;
            sum_y += p.y;
        }

        double centroid_x = sum_x / num_vertices;
        double centroid_y = sum_y / num_vertices;

        cout << "Кластер " << i + 1 << ":\n";
        cout << "  Число вершин: " << num_vertices << "\n";
        cout << "  Минимальные координаты: (" << min_x << ", " << min_y << ")\n";
        cout << "  Максимальные координаты: (" << max_x << ", " << max_y << ")\n";
        cout << "  Координаты центроида: (" << centroid_x << ", " << centroid_y << ")\n\n";
    }
}

int main() {
    setlocale(LC_ALL, "RU");
    int N = 100;  // количество точек
    int K = 5;    // количество кластеров
    vector<Point> points;

    // Шаг 1: Генерация N случайных точек
    generate_random_points(points, N);

    // Шаг 2: Создание полного взвешенного графа
    priority_queue<Edge> edges;
    for (int i = 0; i < N; ++i) {
        for (int j = i + 1; j < N; ++j) {
            double weight = euclidean_distance(points[i], points[j]);
            edges.push({ i, j, weight });
        }
    }

    // Шаг 3: Нахождение минимального остовного дерева (MST)
    vector<Edge> mst_edges;
    vector<int> parent(N), rank(N, 0);
    iota(parent.begin(), parent.end(), 0); // Инициализация родительского массива

    while (mst_edges.size() < N - 1 && !edges.empty()) {
        Edge e = edges.top(); edges.pop();
        int set_u = find_set(e.u, parent);
        int set_v = find_set(e.v, parent);
        if (set_u != set_v) {
            mst_edges.push_back(e);
            union_sets(set_u, set_v, parent, rank);
        }
    }

    // Шаг 4: Сортировка ребер остова по возрастанию весов
    sort(mst_edges.begin(), mst_edges.end(), [](const Edge& e1, const Edge& e2) {
        return e1.weight < e2.weight;
        });

    // Шаг 5: Удаление (N-K) самых длинных ребер из остова
    vector<Edge> final_edges(mst_edges.begin(), mst_edges.end() - (N - K));

    // Шаг 6: Построение компонент связности
    vector<vector<int>> clusters(N);
    iota(parent.begin(), parent.end(), 0); // Инициализация родительского массива
    fill(rank.begin(), rank.end(), 0); // Обнуление рангов

    for (const auto& e : final_edges) {
        union_sets(e.u, e.v, parent, rank);
    }

    for (int i = 0; i < N; ++i) {
        clusters[find_set(i, parent)].push_back(i);
    }

    clusters.erase(remove_if(clusters.begin(), clusters.end(),
        [](const vector<int>& cluster) { return cluster.empty(); }),
        clusters.end());

    // Шаг 7: Подсчет числа вершин и координатных характеристик для каждого кластера
    print_cluster_info(clusters, points);

    return 0;
}
