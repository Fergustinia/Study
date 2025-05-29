using Microsoft.AspNetCore.Mvc;

namespace lab13.Models
{
    public class QuestionViewModel
    {
        public int FirstValue { get; set; }
        public string MathSignName { get; set; }
        public int SecondValue { get; set; }
        public int UserAnswer { get; set; }
        public bool AnswerIsValid { get; set; }
        public string BtnPressed { get; set; }
    }
}
