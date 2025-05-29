# Установка семени для воспроизводимости
set.seed(666)

# Параметры нормального распределения
a <- 5      # Математическое ожидание
sigma <- 2  # Среднеквадратическое отклонение

# 1. Генерация выборок
n <- c(100, 500, 1000)  # Объемы выборок
samples <- list()
for (i in 1:3) {
  samples[[i]] <- rnorm(n[i], mean = a, sd = sigma)
}

# 2. Квантильные графики и гистограммы
par(mfrow = c(3, 2))  # Разделение окна на 3 строки, 2 столбца
for (i in 1:3) {
  # Гистограмма
  hist(samples[[i]], breaks = 20, probability = TRUE, main = paste("Гистограмма, N =", n[i]),
       xlab = "X", col = "lightblue")
  curve(dnorm(x, mean = a, sd = sigma), add = TRUE, col = "red", lwd = 2)
  
  # Квантильный график
  qqnorm(samples[[i]], main = paste("QQ-график, N =", n[i]))
  qqline(samples[[i]], col = "red", lwd = 2)
}

# 3. Оценки числовых характеристик
means <- sapply(samples, mean)         # Выборочное среднее
vars <- sapply(samples, var)           # Выборочная дисперсия
sd_est <- sapply(samples, sd)          # Выборочное Стандартное отклонение

# Вывод результатов
cat("Выборочные характеристики:\n")
for (i in 1:3) {
  cat(sprintf("N = %d: Среднее = %.3f, Дисперсия = %.3f, СКО = %.3f\n", 
              n[i], means[i], vars[i], sd_est[i]))
}

# 4. Доверительные интервалы при известной дисперсии (alpha = 0.05)
alpha <- 0.05
z <- qnorm(1 - alpha/2)  # Критическое значение для Z-распределения (1.96)
ci_known_var <- matrix(nrow = 3, ncol = 2)
for (i in 1:3) {
  margin <- z * sigma / sqrt(n[i])
  ci_known_var[i, ] <- c(means[i] - margin, means[i] + margin)
}

# 5. Доверительные интервалы при неизвестной дисперсии
ci_unknown_var <- matrix(nrow = 3, ncol = 2)
for (i in 1:3) {
  t <- qt(1 - alpha/2, df = n[i] - 1)  # Критическое значение для t-распределения
  margin <- t * sd_est[i] / sqrt(n[i])
  ci_unknown_var[i, ] <- c(means[i] - margin, means[i] + margin)
}

# Вывод доверительных интервалов
cat("\nДоверительные интервалы (alpha = 0.05):\n")
cat("При известной дисперсии:\n")
for (i in 1:3) {
  cat(sprintf("N = %d: [%.3f, %.3f]\n", n[i], ci_known_var[i, 1], ci_known_var[i, 2]))
}
cat("При неизвестной дисперсии:\n")
for (i in 1:3) {
  cat(sprintf("N = %d: [%.3f, %.3f]\n", n[i], ci_unknown_var[i, 1], ci_unknown_var[i, 2]))
}

# 6. График зависимости
plot(n, means, type = "b", pch = 16, col = "blue", ylim = range(c(ci_known_var, ci_unknown_var)),
     xlab = "Объем выборки (N)", ylab = "Оценки и интервалы", main = "Зависимость от N")
lines(n, ci_known_var[, 1], col = "red", lty = 2)
lines(n, ci_known_var[, 2], col = "red", lty = 2)
lines(n, ci_unknown_var[, 1], col = "green", lty = 3)
lines(n, ci_unknown_var[, 2], col = "green", lty = 3)
legend("topright", legend = c("Точечная оценка", "Известная дисперсия", "Неизвестная дисперсия"),
       col = c("blue", "red", "green"), lty = c(1, 2, 3), pch = c(16, NA, NA))

