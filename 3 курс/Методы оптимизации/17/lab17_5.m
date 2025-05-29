C = [5 13 17 6 9; 
     4 1 12 2 5;
     7 5 4 1 3;
     11 4 3 4 6];

S = [55 19 64 9];

D = [7 46 32 37 25];

[m, n] = size(C);
    
f = C(:);

A_eq_prod = kron(eye(m), ones(1, n));
b_eq_prod = S(:);

A_eq_cons = kron(ones(1, m), eye(n));
b_eq_cons = D(:);

A_eq = [A_eq_prod; A_eq_cons];
b_eq = [b_eq_prod; b_eq_cons];

% Ограничения: переменные >= 0
lb = zeros(m * n, 1);

% Решение задачи линейного программирования
x = linprog(f, [], [], A_eq, b_eq, lb, []);
disp(x);
% Формируем решение в виде матрицы
X = reshape(x, n, m);

% Вывод результата
disp('Оптимальное распределение товаров:');
disp(X);
disp('Минимальные затраты:');
disp(f' * x);  % Сумма всех затрат