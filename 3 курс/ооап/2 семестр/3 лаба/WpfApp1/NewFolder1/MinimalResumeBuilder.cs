namespace ResumeBuilderApp
{
    // Минималистичное резюме с простым форматированием
    public class MinimalResumeBuilder : ResumeBuilder
    {
        protected override string FormatBasicInfo(ResumeData resume)
        {
            return $"ФИО:\n{resume.FullName}\n\nКонтакты:\n{resume.ContactInfo}";
        }

        protected override string FormatEducation(ResumeData resume)
        {
            return $"Образование:\n{resume.Education}";
        }

        protected override string FormatWorkExperience(ResumeData resume)
        {
            return $"Опыт работы:\n{resume.WorkExperience}";
        }

        protected override string FormatSkills(ResumeData resume)
        {
            return $"Навыки:\n{resume.Skills}";
        }

        protected override string FormatAdditionalInfo(ResumeData resume)
        {
            return string.IsNullOrEmpty(resume.AdditionalInfo) ? "" : $"Дополнительно:\n{resume.AdditionalInfo}";
        }
    }
}