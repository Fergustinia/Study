using lab12.Interfaces;
using lab12.Models;
using Microsoft.AspNetCore.Mvc;

namespace lab12.Controllers
{
    public class CalcController : Controller
    {
        private readonly ICalculateService _calculateService;

        public CalcController(ICalculateService calculateService)
        {
            _calculateService = calculateService;
        }

        // manual parsing in single action 
        public IActionResult FormManualParsing()
        {
            CalcViewModel calcViewModel = new CalcViewModel
            {
                CalcName = "Manual parsing in single action",
                ProcessContorollerName = "ProcessManualParsing"
            };

            return View("CalculationForm", calcViewModel);
        }

        [HttpPost]
        public IActionResult ProcessManualParsing()
        {
            var formData = HttpContext.Request.Form;

            int firstValue = int.Parse(formData["firstValue"].ToString());
            int secondValue = int.Parse(formData["secondValue"].ToString());
            string selectedMathSign = formData["selectedSign"];

            ViewBag.result = _calculateService.calculate(firstValue, secondValue, selectedMathSign);

            return View("CalculationResult");
        }

        // manual parsing in separate actions
        public IActionResult FormManualParsingSeparateActions()
        {
            CalcViewModel calcViewModel = new CalcViewModel
            {
                CalcName = "Manual parsing in separate actions",
                ProcessContorollerName = "ProcessManualParsing"
            };
            return View("CalculationForm", calcViewModel);
        }

        [HttpPost]
        public IActionResult ProcessManualParsingSeparateActions()
        {
            var formData = HttpContext.Request.Form;
            return ProcessManualParsingSeparateActions(formData);
        }

        public IActionResult ProcessManualParsingSeparateActions(IFormCollection formData)
        {
            int firstValue = int.Parse(formData["firstValue"].ToString());
            int secondValue = int.Parse(formData["secondValue"].ToString());
            string selectedMathSign = formData["selectedSign"];

            ViewBag.result = _calculateService.calculate(firstValue, secondValue, selectedMathSign);

            return View("CalculationResult");
        }

        // model binding (parameters)
        public IActionResult ModelBindingParameters()
        {
            CalcViewModel calcViewModel = new CalcViewModel
            {
                CalcName = "Model binding (parameters)",
                ProcessContorollerName = "ModelBindingParameters"
            };

            return View("CalculationForm", calcViewModel);
        }

        [HttpPost]
        public IActionResult ModelBindingParameters(int firstValue, int secondValue, string selectedSign)
        {
            ViewBag.result = _calculateService.calculate(firstValue, secondValue, selectedSign);

            return View("CalculationResult");
        }

        // model binding (separate model)
        public IActionResult ModelBindingSeparate()
        {
            CalcViewModel calcViewModel = new CalcViewModel
            {
                CalcName = "Model binding (separate model)",
                ProcessContorollerName = "ModelBindingSeparate"
            };

            return View("CalculationForm", calcViewModel);
        }

        [HttpPost]
        public IActionResult ModelBindingSeparate(CalcViewModel calcViewModel)
        {
            int firstValue = calcViewModel.FirstValue;
            int secondValue = calcViewModel.SecondValue;
            string selectedSign = calcViewModel.MathOperationName;

            ViewBag.result = _calculateService.calculate(firstValue, secondValue, selectedSign);

            return View("CalculationResult");
        }
    }
}
