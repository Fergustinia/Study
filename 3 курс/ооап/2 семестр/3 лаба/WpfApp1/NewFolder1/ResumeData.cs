namespace ResumeBuilderApp
{
    // Класс для хранения данных резюме
    public class ResumeData
    {
        public string FullName { get; set; } = "";
        public string ContactInfo { get; set; } = "";
        public string Education { get; set; } = "";
        public string WorkExperience { get; set; } = "";
        public string Skills { get; set; } = "";
        public string AdditionalInfo { get; set; } = "";

        // Проверка, что обязательные поля заполнены
        public bool IsValid =>
            !string.IsNullOrEmpty(FullName) &&
            !string.IsNullOrEmpty(ContactInfo) &&
            !string.IsNullOrEmpty(Education) &&
            !string.IsNullOrEmpty(WorkExperience) &&
            !string.IsNullOrEmpty(Skills);
    }
}