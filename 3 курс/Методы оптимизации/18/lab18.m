% 1
f1 = @(x) x * (abs(x) - 4)^(-3);
[x_min1, f_min1] = fminbnd(f1, -4, 4);
fprintf('1: Минимум функции f(x) достигается при x = %.4f, значение функции f(x) = %.4f\n', x_min1, f_min1);

% 2.1
f2 = @(x) sin(x(1) + x(2)) + (x(1) - x(2))^2 - 1.5 * x(1) + 2.5 * x(2) + 1;
x0 = [1, 2]; % начальная точка
[x_min2_1, f_min2_1] = fminsearch(f2, x0);
fprintf('2.1: Метод Нелдера-Мида: минимум функции f(x1, x2) достигается при x1 = %.4f, x2 = %.4f, значение функции = %.4f\n', x_min2_1(1), x_min2_1(2), f_min2_1);

% 2.2
options_fminunc = optimoptions('fminunc', 'Algorithm', 'quasi-newton');
[x_min2_2, f_min2_2] = fminunc(f2, x0, options_fminunc);
fprintf('2.2: Квазиньютоновский метод: минимум функции f(x1, x2) достигается при x1 = %.4f, x2 = %.4f, значение функции = %.4f\n', x_min2_2(1), x_min2_2(2), f_min2_2);

% 3
constraints = @(x) deal( ...
    [], ...  % Невыполненные неравенства (пустой массив для этого примера)
    [(x(1)+2)^2+x(2);  % Равенства
     -x(1)+14*(x(2)+1)^2-3; 
     -x(1)-x(2)-3] ...
);

[x_min3, f_min3] = fmincon(f2, x0, [], [], [], [], [], [], constraints);
fprintf('3: Метод fmincon: минимум функции f(x1, x2) достигается при x1 = %.4f, x2 = %.4f, значение функции = %.4f\n', x_min3(1), x_min3(2), f_min3);

% 4.1
options_patternsearch = optimoptions('patternsearch', 'UseCompletePoll', true);
[x_min4_1, f_min4_1] = patternsearch(f2, x0, [], [], [], [], [], [], constraints, options_patternsearch);
fprintf('4.1: Метод patternsearch: минимум функции f(x1, x2) достигается при x1 = %.4f, x2 = %.4f, значение функции = %.4f\n', x_min4_1(1), x_min4_1(2), f_min4_1);

% 4.2
options_ga = optimoptions('ga', 'Display', 'iter');
[x_min4_2, f_min4_2] = ga(f2, 2, [], [], [], [], [], [], constraints, options_ga);
fprintf('4.2: Генетический алгоритм: минимум функции f(x1, x2) достигается при x1 = %.4f, x2 = %.4f, значение функции = %.4f\n', x_min4_2(1), x_min4_2(2), f_min4_2);
