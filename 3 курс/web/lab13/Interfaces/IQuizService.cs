using lab13.Models;

namespace lab13.Interfaces
{
    public interface IQuizService
    {
        QuestionViewModel CreateQuestion();
        bool CheckAnswer(QuestionViewModel questionViewModel);
        int GetRightAnswersAmount(List<QuestionViewModel> questions);
    }
}
