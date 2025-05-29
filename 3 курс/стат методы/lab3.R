if (!require("ggplot2")) install.packages("ggplot2", dependencies = TRUE)
if (!require("gridExtra")) install.packages("gridExtra", dependencies = TRUE)
library(ggplot2)
library(gridExtra)

set.seed(666)

# Функция для статистического анализа
analyze_statistics <- function(X1, X2, case_name) {
  shapiro_X1 <- shapiro.test(X1)#Шарипо-Уилка, проверяет нормальность
  shapiro_X2 <- shapiro.test(X2)
  var_test <- var.test(X1, X2)#Проверка равенства дисперсий, если они равны то var_equal = true. если нет то используем t-критерий уэлча
  var_equal <- var_test$p.value > 0.05 #если p>0.05 то распределение нормально
  t_test <- t.test(X1, X2, var.equal = var_equal)#Проверка равенства средних значений
  
  cat("Shapiro X1 p-value:", shapiro_X1$p.value, "\n")
  cat("Shapiro X2 p-value:", shapiro_X2$p.value, "\n")
  cat("F-test p-value:", var_test$p.value, "\n")
  cat("t-test p-value (var.equal =", var_equal, "):", t_test$p.value, "\n")
}

# Функция для визуализации данных
plot_samples <- function(X1, X2, case_name) {
  df <- data.frame(
    value = c(X1, X2),
    group = factor(rep(c("X1", "X2"), times = c(length(X1), length(X2))))
  )
  
  p1 <- ggplot(df, aes(x = value, fill = group)) +
    geom_histogram(aes(y = ..density..), alpha = 0.5, bins = 30, position = "identity") +
    geom_density(alpha = 0.3) +
    geom_vline(xintercept = mean(X1), color = "blue", linetype = "dashed") +
    geom_vline(xintercept = mean(X2), color = "red", linetype = "dashed") +
    ggtitle(paste(case_name, "- Гистограмма"))
  
  p2 <- ggplot(df, aes(x = group, y = value, fill = group)) +
    geom_boxplot() +
    ggtitle(paste(case_name, "- Боксплот"))
  
  print(grid.arrange(p1, p2, ncol = 2))
}

# Генерация выборок для всех ситуаций
# a: Математические ожидания и дисперсии равны
X1_a <- rnorm(100, mean = 5, sd = 1)
X2_a <- rnorm(100, mean = 5, sd = 1)
analyze_statistics(X1_a, X2_a, "Ситуация a: Одинаковые параметры")
plot_samples(X1_a, X2_a, "Ситуация a: Одинаковые параметры")

# b: Математические ожидания различны, дисперсии равны
X1_b <- rnorm(100, mean = 5, sd = 1)
X2_b <- rnorm(100, mean = 8, sd = 1)
analyze_statistics(X1_b, X2_b, "Ситуация b: Разные мат. ожидания") #Вероятность того что будет такая коррелияция с такой дисперсией, а потом уже мат ожидание
plot_samples(X1_b, X2_b, "Ситуация b: Разные мат. ожидания")

# c: Математические ожидания равны, дисперсии различны
X1_c <- rnorm(100, mean = 5, sd = 1)
X2_c <- rnorm(100, mean = 5, sd = 3)
analyze_statistics(X1_c, X2_c, "Ситуация c: Разные дисперсии")
plot_samples(X1_c, X2_c, "Ситуация c: Разные дисперсии")

# d: Математические ожидания и дисперсии различны
X1_d <- rnorm(100, mean = 5, sd = 1)
X2_d <- rnorm(100, mean = 8, sd = 3)
analyze_statistics(X1_d, X2_d, "Ситуация d: Разные параметры")
plot_samples(X1_d, X2_d, "Ситуация d: Разные параметры")

