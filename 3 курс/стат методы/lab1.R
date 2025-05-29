# Установка и загрузка необходимых пакетов
if (!require("moments")) install.packages("moments", dependencies=TRUE)
if (!require("ggplot2")) install.packages("ggplot2", dependencies=TRUE)
if (!require("MASS")) install.packages("MASS", dependencies=TRUE)

library(moments)
library(ggplot2)
library(MASS)

# Установка seed для воспроизводимости результатов
set.seed(666)

# Генерация параметров
N <- sample(100:200, 1)  # Случайный размер выборки от 100 до 200
n <- 10     # Параметр для биномиального распределения
p <- 0.3    # Вероятность успеха
lambda <- 2 # Параметр для экспоненциального распределения
alpha <- 2  # Параметр формы для гамма-распределения
beta <- 1.5 # Параметр скорости для гамма-распределения

# Генерация выборок из разных распределений
binomial_sample <- rbinom(N, n, p)      # Биномиальное
geometric_sample <- rgeom(N, p)         # Геометрическое
exp_sample <- rexp(N, rate = lambda)    # Экспоненциальное
gamma_sample <- rgamma(N, shape = alpha, scale = 1/beta)  # Гамма

# Функция для вычисления статистик
compute_statistics <- function(sample) {
  list(
    mean = mean(sample),
    variance = var(sample),
    sd = sd(sample),
    mode = as.numeric(names(sort(table(sample), decreasing = TRUE)[1])),
    median = median(sample),
    skewness = skewness(sample),
    kurtosis = kurtosis(sample)
  )
}

# Вычисление статистик для каждой выборки
binomial_stats <- compute_statistics(binomial_sample)
geometric_stats <- compute_statistics(geometric_sample)
exp_stats <- compute_statistics(exp_sample)
gamma_stats <- compute_statistics(gamma_sample)

# Теоретические значения среднего и дисперсии
binomial_theoretical <- list(mean = n * p, variance = n * p * (1 - p))
geometric_theoretical <- list(mean = (1 - p) / p, variance = (1 - p) / p^2)
exp_theoretical <- list(mean = 1 / lambda, variance = 1 / lambda^2)
gamma_theoretical <- list(mean = alpha / beta, variance = alpha / beta^2)

# Функция для построения графиков распределений (гистограмма + плотность)
plot_distribution <- function(sample, title) {
  df <- data.frame(x = sample)
  ggplot(df, aes(x = x)) +
    geom_histogram(aes(y = ..density..), bins = 30, fill = "blue", alpha = 0.5) +
    geom_density(color = "red", size = 1) +
    ggtitle(title) +
    theme_minimal()
}

# Функция для построения ECDF (эмпирической функции распределения)
plot_ecdf <- function(sample, theoretical_cdf, title) {
  df <- data.frame(x = sample)
  ggplot(df, aes(x = x)) +
    stat_ecdf(geom = "step", color = "blue", size = 1) +
    stat_function(fun = theoretical_cdf, color = "red", size = 1) +
    ggtitle(paste("эмпирическая функция распределения", title)) +
    ylab("F(x)") +
    theme_minimal()
}

# Построение гистограмм и плотностей распределений
plot_distribution(binomial_sample, "Биномиальное распределение")
plot_distribution(geometric_sample, "Геометрическое распределение")
plot_distribution(exp_sample, "Экспоненциальное распределение")
plot_distribution(gamma_sample, "Гамма-распределение")

# Построение ECDF только для биномиального и геометрического распределений
plot_ecdf(binomial_sample, 
          function(x) pbinom(x, size = n, prob = p),
          "биномиального распределения")

plot_ecdf(geometric_sample,
          function(x) pgeom(x, prob = p),
          "геометрического распределения")

# Функция для выполнения теста хи-квадрат
chisq_test <- function(sample, theoretical_probs) {
  observed <- table(factor(sample, levels = min(sample):max(sample)))
  expected <- theoretical_probs * sum(observed)
  chisq.test(observed, p = expected / sum(expected))
}

# Вычисление теоретических вероятностей для биномиального распределения
binomial_probs <- dbinom(min(binomial_sample):max(binomial_sample), n, p)
# Проведение теста хи-квадрат
binomial_chisq <- chisq_test(binomial_sample, binomial_probs)

# Вывод результатов
print(binomial_stats)
print(geometric_stats)
print(exp_stats)
print(gamma_stats)
print(binomial_chisq)
