let currentInput = '';
let previousInput = '';
let operation = null;

function appendValue(value) {
    currentInput += value;
    updateDisplay(currentInput);
}

function setOperation(op) {
    if (currentInput === '') return;
    if (previousInput !== '') {
        calculate();
    }
    operation = op;
    previousInput = currentInput;
    currentInput = '';
}

function calculate() {
    if (previousInput === '' || currentInput === '' || operation === null) return;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        default:
            return;
    }
    currentInput = result.toString();
    operation = null;
    previousInput = '';
    updateDisplay(currentInput);
}

function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operation = null;
    updateDisplay('');
}

function updateDisplay(value) {
    document.getElementById('display').value = value;
}
