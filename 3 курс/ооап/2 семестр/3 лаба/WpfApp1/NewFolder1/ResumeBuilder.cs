using System;

namespace ResumeBuilderApp
{
    // Абстрактный класс для построения резюме (паттерн "Шаблонный метод")
    public abstract class ResumeBuilder
    {
        // Основной метод для создания резюме
        public string BuildResume(ResumeData resume)
        {
            if (!resume.IsValid)
                throw new InvalidOperationException("Все поля, кроме дополнительной информации, обязательны!");

            // Форматируем каждый раздел
            string basicInfo = FormatBasicInfo(resume);
            string education = FormatEducation(resume);
            string workExperience = FormatWorkExperience(resume);
            string skills = FormatSkills(resume);
            string additionalInfo = FormatAdditionalInfo(resume);

            // Собираем резюме
            string result = $"{basicInfo}\n\n{education}\n\n{workExperience}\n\n{skills}";
            if (!string.IsNullOrEmpty(additionalInfo))
                result += $"\n\n{additionalInfo}";
            return result;
        }

        // Абстрактные методы для форматирования
        protected abstract string FormatBasicInfo(ResumeData resume);
        protected abstract string FormatEducation(ResumeData resume);
        protected abstract string FormatWorkExperience(ResumeData resume);
        protected abstract string FormatSkills(ResumeData resume);

        // Виртуальный метод для дополнительной информации
        protected virtual string FormatAdditionalInfo(ResumeData resume)
        {
            return resume.AdditionalInfo;
        }
    }
}