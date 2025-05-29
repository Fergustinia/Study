using lab13.Interfaces;
using lab13.Models;

namespace lab13.Services
{
    public class QuestionsStorageService : IQuestionsStorageService
    {
        private List<QuestionViewModel> _questions;

        public QuestionsStorageService()
        { 
            _questions = new List<QuestionViewModel>();
        }

        public void Add(QuestionViewModel questionViewModel)
        {
            _questions.Add(questionViewModel);
        }

        public List<QuestionViewModel> GetAll()
        {
            return _questions;
        }

        public void Clear()
        {
            _questions.Clear();
        }
    }
}
