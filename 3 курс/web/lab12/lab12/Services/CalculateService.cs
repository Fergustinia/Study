using lab12.Interfaces;

namespace lab12.Services
{
    public class CalculateService: ICalculateService
    {
        int ICalculateService.calculate(int firstValue, int secondValue, string selectedMathSign)
        {
            int mathOperRes = 0;

            switch (selectedMathSign)
            {
                case "add":
                    mathOperRes = firstValue + secondValue;
                    break;

                case "sub":
                    mathOperRes = firstValue - secondValue;
                    break;

                case "mult":
                    mathOperRes = firstValue * secondValue;
                    break;

                case "div":
                    mathOperRes = firstValue / secondValue;
                    break;
            }
            return mathOperRes;
        }
    }
}
