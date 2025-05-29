
using lab13.Interfaces;
using lab13.Models;
using Microsoft.AspNetCore.Mvc;

namespace lab13.Controllers
{
    public class QuizController : Controller
    {
        private readonly IQuizService _quizService;
        private readonly IQuestionsStorageService _questionsStorageService;

        public QuizController(IQuizService quizService, IQuestionsStorageService questionsStorageService)
        {
            _quizService = quizService;
            _questionsStorageService = questionsStorageService;
        }

        public IActionResult Index()
        {
            _questionsStorageService.Clear();

            return View();
        }

        public IActionResult QuestionForm()
        {
            QuestionViewModel questionViewModel = _quizService.CreateQuestion();

            var data = _questionsStorageService.GetAll();

            return View(questionViewModel);
        }

        [HttpPost]
        public IActionResult QuestionProcess(QuestionViewModel questionViewModel)
        {
            bool answerIsValid = _quizService.CheckAnswer(questionViewModel);
            questionViewModel.AnswerIsValid = answerIsValid;

            _questionsStorageService.Add(questionViewModel);

            if (questionViewModel.BtnPressed == "next")
                return RedirectToAction("QuestionForm");
            
            return RedirectToAction("ViewResults");
        }

        public IActionResult ViewResults()
        {

            var questions = _questionsStorageService.GetAll();
            int rightAnswersAmount = _quizService.GetRightAnswersAmount(questions);
            int questionsAmount = questions.Count();

            ResultsViewModel resultsViewModel = new ResultsViewModel
            {
                RightAnswersAmount = rightAnswersAmount,
                QuestionsAmount = questionsAmount,
                Questions = questions
            };

            return View(resultsViewModel);
        }
    }
}
