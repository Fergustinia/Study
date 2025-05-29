# Загрузка данных
pulse <- read.table("pulse.txt", header = TRUE, fill = TRUE, na.strings = c("", "NA"))
# CB-До лечения EB-ЛО отдыха CA-После лечения EA-После отдыха
# --- Шаг 1: Проверка нормальности (визуально и тестом Шапиро-Уилка) ---
par(mfrow = c(2, 2))
for (g in names(pulse)) {
  qqnorm(na.omit(pulse[[g]]), main = paste("QQ-Plot", g))
  qqline(na.omit(pulse[[g]]))
}
shapiro.results <- sapply(pulse, function(x) shapiro.test(na.omit(x))$p.value)
print(round(shapiro.results, 4))

# --- Шаг 2: Сравнение "до" и "после" в каждой группе (парные тесты) ---
paired_patients <- pulse[complete.cases(pulse$CB, pulse$CA), ]
paired_healthy  <- pulse[complete.cases(pulse$EB, pulse$EA), ]

# Wilcoxon с подавлением предупреждений
test1 <- wilcox.test(paired_patients$CB, paired_patients$CA, paired = TRUE, exact = FALSE)
test2 <- wilcox.test(paired_healthy$EB, paired_healthy$EA, paired = TRUE, exact = FALSE)
 
# --- Шаг 3: Сравнение пациентов и здоровых (независимые тесты) ---
cb_eb <- pulse[complete.cases(pulse$CB, pulse$EB), ]
ca_ea <- pulse[complete.cases(pulse$CA, pulse$EA), ]

test3 <- wilcox.test(cb_eb$CB, cb_eb$EB, exact = FALSE)
test4 <- wilcox.test(ca_ea$CA, ca_ea$EA, exact = FALSE)

# --- Шаг 4: Таблица с результатами и интерпретацией ---
results <- data.frame(
  Сравнение = c("Пациенты: до vs после", "Здоровые: до vs после",
                "До: пациенты vs здоровые", "После: пациенты vs здоровые"),
  P_value = round(c(test1$p.value, test2$p.value, test3$p.value, test4$p.value), 4),
  Значимость = ifelse(c(test1$p.value, test2$p.value, test3$p.value, test4$p.value) < 0.05,
                      "Значимо", "Не значимо")
)
print(results)

# Интерпретация результатов для оценки эффективности лекарства
cat("\nВывод об эффективности лекарства:\n")
if (test1$p.value < 0.05 & test4$p.value >= 0.05) {
  cat("Лекарство эффективно: пульс пациентов значительно изменился после лечения (p = ", 
      round(test1$p.value, 4), "), и после лечения пульс пациентов не отличается от пульса здоровых (p = ", 
      round(test4$p.value, 4), ").\n")
} else if (test1$p.value >= 0.05) {
  cat("Лекарство неэффективно: пульс пациентов не изменился после лечения (p = ", 
      round(test1$p.value, 4), ").\n")
} else {
  cat("Лекарство изменило пульс пациентов (p = ", round(test1$p.value, 4), 
      "), но после лечения пульс пациентов все еще значительно отличается от пульса здоровых (p = ", 
      round(test4$p.value, 4), ").\n")
}

# --- Шаг 5: Графики коробок с усами ---
par(mfrow = c(2, 2))
boxplot(paired_patients$CB, paired_patients$CA, names = c("CB", "CA"),
        main = "Пациенты: до и после", col = c("skyblue", "lightgreen"))
boxplot(paired_healthy$EB, paired_healthy$EA, names = c("EB", "EA"),
        main = "Здоровые: до и после", col = c("skyblue", "lightgreen"))
boxplot(cb_eb$CB, cb_eb$EB, names = c("CB", "EB"),
        main = "До: пациенты vs здоровые", col = c("lightcoral", "lightgray"))
boxplot(ca_ea$CA, ca_ea$EA, names = c("CA", "EA"),
        main = "После: пациенты vs здоровые", col = c("lightcoral", "lightgray"))

# --- Задание 2: Анализ зависимости между группой и оценкой ---

# Шаг 1: Загрузка данных из файла
grades <- read.table("grades.txt", header = TRUE, sep = "\t", check.names = FALSE)

# Шаг 2: Преобразование таблицы из wide в long формат
# Создаём два столбца: Group и Grade
grades_long <- data.frame(
  Group = rep(colnames(grades), each = nrow(grades)),
  Grade = as.vector(as.matrix(grades))
)

# Шаг 3: Построение таблицы сопряжённости
contingency_table <- table(grades_long$Group, grades_long$Grade)
cat("\n--- Таблица сопряженности ---\n")
print(contingency_table)

# Шаг 4: Применение критерия хи-квадрат
chi_result <- chisq.test(contingency_table)

# Шаг 5: Вывод результата
cat("\n--- Результаты критерия хи-квадрат ---\n")
print(chi_result)

# Шаг 6: Интерпретация
if (chi_result$p.value < 0.05) {
  cat("Вывод: между группой и оценкой есть статистически значимая связь (p =", round(chi_result$p.value, 4), ").\n")
} else {
  cat("Вывод: статистически значимая связь между группой и оценкой отсутствует (p =", round(chi_result$p.value, 4), ").\n")
}

