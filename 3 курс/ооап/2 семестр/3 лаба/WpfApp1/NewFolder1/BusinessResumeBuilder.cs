namespace ResumeBuilderApp
{
    // Бизнес-резюме с элегантным форматированием
    public class BusinessResumeBuilder : ResumeBuilder
    {
        private const string Separator = "----------------------------------------";

        protected override string FormatBasicInfo(ResumeData resume)
        {
            return $"{Separator}\nФИО: {resume.FullName.ToUpper()}\nКонтакты: {resume.ContactInfo}\n{Separator}";
        }

        protected override string FormatEducation(ResumeData resume)
        {
            return $"ОБРАЗОВАНИЕ\n{Separator}\n{resume.Education.ToUpper()}\n{Separator}";
        }

        protected override string FormatWorkExperience(ResumeData resume)
        {
            return $"ПРОФЕССИОНАЛЬНЫЙ ОПЫТ\n{Separator}\n{resume.WorkExperience}\n{Separator}";
        }

        protected override string FormatSkills(ResumeData resume)
        {
            return $"КЛЮЧЕВЫЕ КОМПЕТЕНЦИИ\n{Separator}\n{resume.Skills}\n{Separator}";
        }

        protected override string FormatAdditionalInfo(ResumeData resume)
        {
            return string.IsNullOrEmpty(resume.AdditionalInfo) ? "" : $"ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ\n{Separator}\n{resume.AdditionalInfo}\n{Separator}";
        }
    }
}