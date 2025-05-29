namespace ResumeBuilderApp
{
    // Академическое резюме с акцентом на образование
    public class AcademicResumeBuilder : ResumeBuilder
    {
        private const string Divider = "====";

        protected override string FormatBasicInfo(ResumeData resume)
        {
            return $"ФИО: {resume.FullName}\nКонтакты: {resume.ContactInfo}\n{Divider}";
        }

        protected override string FormatEducation(ResumeData resume)
        {
            return $"АКАДЕМИЧЕСКАЯ ПОДГОТОВКА\n{Divider}\n{resume.Education}\n{Divider}";
        }

        protected override string FormatWorkExperience(ResumeData resume)
        {
            return $"ПРОФЕССИОНАЛЬНЫЙ ОПЫТ\n{Divider}\n{resume.WorkExperience}\n{Divider}";
        }

        protected override string FormatSkills(ResumeData resume)
        {
            return $"НАВЫКИ И КОМПЕТЕНЦИИ\n{Divider}\n{resume.Skills}\n{Divider}";
        }

        protected override string FormatAdditionalInfo(ResumeData resume)
        {
            return string.IsNullOrEmpty(resume.AdditionalInfo) ? "" : $"ПУБЛИКАЦИИ И ДОСТИЖЕНИЯ\n{Divider}\n{resume.AdditionalInfo}\n{Divider}";
        }
    }
}