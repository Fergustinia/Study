using lab11.Interfaces;
using lab11.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace lab11.Controllers
{
    public class CalcController : Controller
    {
        private readonly ICalcService _calcService;

        public CalcController(ICalcService calcService)
        {
            _calcService = calcService;
        }

        public IActionResult ModelCalc()
        {
            Random random = new Random();

            int randFirstValue = random.Next(1, 100);
            int randSecondValue = random.Next(1, 100);

            var calcViewModel = new CalcViewModel
            {
                firstValue = randFirstValue,
                secondValue = randSecondValue,
                additionResult = randFirstValue + randSecondValue,
                subtractionResult = randFirstValue - randSecondValue,
                multiplicationResult = randFirstValue * randSecondValue,
                divisionResult = randFirstValue / randSecondValue,
            };

            return View(calcViewModel);
        }

        public IActionResult ViewDataCalc()
        {
            Random random = new Random();

            int randFirstValue = random.Next(1, 100);
            int randSecondValue = random.Next(1, 100);

            ViewData["Calc"] = new CalcViewModel
            {
                firstValue = randFirstValue,
                secondValue = randSecondValue,
                additionResult = randFirstValue + randSecondValue,
                subtractionResult = randFirstValue - randSecondValue,
                multiplicationResult = randFirstValue * randSecondValue,
                divisionResult = randFirstValue / randSecondValue,
            };

            return View();
        }

        public IActionResult ViewBagCalc()
        {
            Random random = new Random();

            int randFirstValue = random.Next(1, 100);
            int randSecondValue = random.Next(1, 100);

            ViewBag.calc = new CalcViewModel
            {
                firstValue = randFirstValue,
                secondValue = randSecondValue,
                additionResult = randFirstValue + randSecondValue,
                subtractionResult = randFirstValue - randSecondValue,
                multiplicationResult = randFirstValue * randSecondValue,
                divisionResult = randFirstValue / randSecondValue,
            };

            return View();
        }

        public IActionResult ServiceInjCalc()
        {
            var calcViewModel = _calcService.createCalcViewModel();
            return View(calcViewModel);
        }
    }
}
