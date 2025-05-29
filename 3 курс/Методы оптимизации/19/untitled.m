% Построение графиков функции одной переменной

% Задаем функцию
f = @(x) x .* (abs(x) - 4).^(1/3);

% Учитываем особенности функции в точках x = ±4 (где знаменатель обращается в 0)
x = -4:1:4; % Область определения с шагом h = 1, исключая точки ±4
y = f(x); % Вычисляем значения функции

% 1.1. Построение графика с фиксированным шагом
figure;
plot(x, y, '-.+g', 'LineWidth', 1.5); % Зеленая штрихпунктирная линия с маркерами "+"
grid on;
xlabel('x');
ylabel('f(x)');
title('$f(x) = x \cdot (|x| - 4)^{-3}$', 'Interpreter', 'latex'); % Формула в формате LaTeX

% 1.2. Построение графика с использованием fplot
hold on;
fplot(f, [-4 4], ':b', 'LineWidth', 1.5); % Синяя пунктирная линия
legend({'Метод plot', 'Метод fplot'}, 'Location', 'southwest', 'Orientation', 'horizontal');

% Построение графиков функции двух переменных - Шаффер №2 (оптимизировано)

% Задаем функцию
f2 = @(x1, x2) 0.5 + (sin(x1.^2 - x2.^2).^2 - 0.5) ./ (abs(1 - 0.001 * (x1.^2 - x2.^2)).^2);

% Создаем сетку с шагом 0.02
[x1, x2] = meshgrid(-50:0.5:50, -50:0.5:50); % Шаг 0.02
z = f2(x1, x2); % Вычисляем значения функции

% Проверка размеров матриц
disp(size(x1)); % Выводим размерность x1
disp(size(x2)); % Выводим размерность x2
disp(size(z));  % Выводим размерность z



% 2.1. Каркасная поверхность

figure;
mesh(x1, x2, z); % Каркасная поверхность
hidden off; % Скрываем каркас
xlabel('x_1');
ylabel('x_2');
zlabel('f(x_1, x_2)');
title('Каркасная поверхность');

% 2.2. Поверхность с цветовой заливкой
figure;
surf(x1, x2, z); % Поверхность
shading interp; % Плавная заливка
colormap(jet); % Цветовая палитра
colorbar; % Цветовая шкала
xlabel('x_1');
ylabel('x_2');
zlabel('f(x_1, x_2)');
title('Поверхность с цветовой заливкой');

% 2.3. Линии уровня на поверхности
figure;
meshc(x1, x2, z); % Линии уровня с поверхностью
xlabel('x_1');
ylabel('x_2');
zlabel('f(x_1, x_2)');
title('Поверхность с линиями уровня');

% 2.4. Адаптивная поверхность
figure;
surfl(f2, [-100 100 -100 100], 'ShowContours', 'on', 'LineWidth', 1.5); % Меньшая область
xlabel('x_1');
ylabel('x_2');
zlabel('f(x_1, x_2)');
title('Адаптивная поверхность');

[minVal, minIdx] = min(z(:)); % Минимум
[maxVal, maxIdx] = max(z(:)); % Максимум

% Преобразуем индексы в координаты
[minRow, minCol] = ind2sub(size(z), minIdx); % Индексы минимума
[maxRow, maxCol] = ind2sub(size(z), maxIdx); % Индексы максимума

% Координаты экстремумов
x_min = x1(minRow, minCol);
y_min = x2(minRow, minCol);
z_min = minVal;

x_max = x1(maxRow, maxCol);
y_max = x2(maxRow, maxCol);
z_max = maxVal;

figure;
surf(x1, x2, z);
shading interp; 
colormap(jet); 
colorbar; 
xlabel('x_1');
ylabel('x_2');
zlabel('f(x_1, x_2)');
title('Экстремальные точки функции f(x_1, x_2)');
hold on;


plot3(x_min, y_min, z_min, 'ro', 'MarkerSize', 10, 'MarkerFaceColor', 'r'); % Минимум
text(x_min, y_min, z_min, 'Минимум', 'VerticalAlignment', 'bottom');

plot3(x_max, y_max, z_max, 'go', 'MarkerSize', 10, 'MarkerFaceColor', 'g'); % Максимум
text(x_max, y_max, z_max, 'Максимум', 'VerticalAlignment', 'bottom');
hold off;
