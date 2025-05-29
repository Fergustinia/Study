using lab13.Models;

namespace lab13.Interfaces
{
    public interface IQuestionsStorageService
    {
        List<QuestionViewModel> GetAll();
        void Add(QuestionViewModel questionViewModel);
        void Clear();
    }
}
