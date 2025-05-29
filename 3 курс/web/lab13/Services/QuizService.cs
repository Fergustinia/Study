using lab13.Interfaces;
using lab13.Models;

namespace lab13.Services
{
    public class QuizService : IQuizService
    {
        public QuestionViewModel CreateQuestion()
        {
            Random random = new Random();

            List<string> mathSignsNames = new List<string>
            {
                "add",
                "sub",
                "mult",
                "div"
            };

            QuestionViewModel questionViewModel = new QuestionViewModel
            {
                FirstValue = random.Next(1, 10),
                SecondValue = random.Next(1, 10),
                MathSignName = mathSignsNames[random.Next(0, mathSignsNames.Count())]
            };

            return questionViewModel;
        }

        public bool CheckAnswer(QuestionViewModel questionViewModel)
        {
            int firstValue = questionViewModel.FirstValue;
            int secondValue = questionViewModel.SecondValue;
            string mathSignName = questionViewModel.MathSignName;
            int userAnswer = questionViewModel.UserAnswer;

            bool answerIsValid = false;

            switch(mathSignName)
            {
                case "add":
                    if (firstValue + secondValue == userAnswer)
                        answerIsValid = true;

                    break;

                case "sub":
                    if (firstValue - secondValue == userAnswer)
                        answerIsValid = true;
                    break;

                case "mult":
                    if (firstValue * secondValue == userAnswer)
                        answerIsValid = true;
                    break;

                case "div":
                    if (firstValue / secondValue == userAnswer)
                        answerIsValid = true;
                    break;
            }

            return answerIsValid;
        }

        public int GetRightAnswersAmount(List<QuestionViewModel> questions)
        {
            int rightAnswersAmount = 0;
            foreach (QuestionViewModel questionViewModel in questions)
            {
                if (questionViewModel.AnswerIsValid)
                {
                    rightAnswersAmount++;
                }
            }

            return rightAnswersAmount;
        }
    }
}
