using lab11.Interfaces;
using lab11.ViewModels;

namespace lab11.Services
{
    public class CalcService : ICalcService
    {
        public CalcViewModel createCalcViewModel()
        {
            Random random = new Random();

            int randFirstValue = random.Next(1, 100);
            int randSecondValue = random.Next(1, 100);

            var Calc = new CalcViewModel
            {
                firstValue = randFirstValue,
                secondValue = randSecondValue,
                additionResult = randFirstValue + randSecondValue,
                subtractionResult = randFirstValue - randSecondValue,
                multiplicationResult = randFirstValue * randSecondValue,
                divisionResult = randFirstValue / randSecondValue,
            };

            return Calc;
        }
    }
}
