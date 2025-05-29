namespace ResumeBuilderApp
{
    // Креативное резюме с неформальным стилем и эмодзи
    public class CreativeResumeBuilder : ResumeBuilder
    {
        protected override string FormatBasicInfo(ResumeData resume)
        {
            return $"🌟 Кто я:\n{resume.FullName}\n\n📞 Связаться со мной:\n{resume.ContactInfo}";
        }

        protected override string FormatEducation(ResumeData resume)
        {
            return $"🎓 Мое образование:\n{resume.Education}";
        }

        protected override string FormatWorkExperience(ResumeData resume)
        {
            return $"💼 Где я работал:\n{resume.WorkExperience}";
        }

        protected override string FormatSkills(ResumeData resume)
        {
            return $"🛠 Мои суперсилы:\n{resume.Skills}";
        }

        protected override string FormatAdditionalInfo(ResumeData resume)
        {
            return string.IsNullOrEmpty(resume.AdditionalInfo) ? "" : $"✨ Еще обо мне:\n{resume.AdditionalInfo}";
        }
    }
}