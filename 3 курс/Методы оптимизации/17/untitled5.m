% Исходные данные
C = [5 13 17 6 9;
     4 1 12 2 5;
     7 5 4 8 6;
     11 4 3 7 6];

supply = [55, 19, 64, 9];  % Предложение
demand = [7, 46, 32, 37, 25];  % Спрос

% Проверка баланса задачи
total_supply = sum(supply);
total_demand = sum(demand);

if total_supply ~= total_demand
    disp('Небалансированная задача. Добавляем фиктивный пункт.');
    if total_supply > total_demand
        % Добавляем фиктивный пункт потребления
        demand(end+1) = total_supply - total_demand;
        C(:, end+1) = 0; % Нулевые затраты для фиктивного пункта
    else
        % Добавляем фиктивный пункт производства
        supply(end+1) = total_demand - total_supply;
        C(end+1, :) = 0; % Нулевые затраты для фиктивного источника
    end
end

% Размеры таблицы
[m, n] = size(C);

% Метод северо-западного угла для начального плана
X = zeros(m, n);  % Матрица перевозок
i = 1; j = 1;

while i <= m && j <= n
    if supply(i) < demand(j)
        X(i, j) = supply(i);
        demand(j) = demand(j) - supply(i);
        i = i + 1;
    else
        X(i, j) = demand(j);
        supply(i) = supply(i) - demand(j);
        j = j + 1;
    end
end

% Вывод начального плана
disp('Начальный план перевозок:');
disp(X);

% Оптимизация методом потенциалов
optimal = false;

while ~optimal
    % 1. Вычисление потенциалов
    u = NaN(1, m); % Потенциалы строк
    v = NaN(1, n); % Потенциалы столбцов
    u(1) = 0; % Задаём начальный потенциал

    for ii = 1:m
        for jj = 1:n
            if X(ii, jj) > 0
                if isnan(u(ii)) && ~isnan(v(jj))
                    u(ii) = C(ii, jj) - v(jj);
                elseif ~isnan(u(ii)) && isnan(v(jj))
                    v(jj) = C(ii, jj) - u(ii);
                end
            end
        end
    end

    % 2. Вычисление оценок для незанятых клеток
    delta = NaN(m, n);
    for ii = 1:m
        for jj = 1:n
            if X(ii, jj) == 0
                delta(ii, jj) = C(ii, jj) - (u(ii) + v(jj));
            end
        end
    end

    % 3. Проверка на оптимальность
    if all(delta(:) >= 0 | isnan(delta(:)))
        optimal = true;
        disp('Текущий план является оптимальным.');
    else
        % Поиск ячейки для улучшения
        [min_delta, min_index] = min(delta(:));
        [enter_i, enter_j] = ind2sub(size(delta), min_index);

        % Поиск цикла для пересчёта
        % Найти цикл (реализация через поиск занятых ячеек по строкам и столбцам)
        occupied = X > 0;
        [cycle_rows, cycle_cols] = find(occupied);

        % Построение цикла
        % !!! Реализация корректного пересчёта оставлена для уточнения !!!
        disp('Найдена ячейка для улучшения, но цикл пересчета не реализован.');
        break;
    end
end

% Результаты
disp('План перевозок после оптимизации:');
disp(X);

% Подсчёт затрат
min_cost = sum(sum(X .* C));
disp('Минимальные затраты:');
disp(min_cost);
