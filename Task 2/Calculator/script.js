
let calcScreen = document.getElementById("Answer");

function EnterNumber(value) {
    setScreen(value);
}
function EnterOperator(operator) {
    setScreen(operator);
}
function EnterClear() {
    calcScreen.value = "";
}
function EnterEqual() {
    let expression = calcScreen.value;

    // Get operands and operators
    let operands = expression.match(/\d+(\.\d+)?/g);
    let operators = expression.match(/[+\-*/]/g);

    if (!operands || operands.length === 0) {
        calcScreen.value = "Syntax Error";
        return;
    }

    // Compute step-by-step left to right
    let result = parseFloat(operands[0]);

    for (let i = 0; i < operators.length; i++) {
        let nextOperand = parseFloat(operands[i + 1]);
        let operator = operators[i];

        result = compute(result, operator, nextOperand);

        if (isNaN(result) || !isFinite(result)) {
            calcScreen.value = "Math Error";
            return;
        }
    }

    calcScreen.value = result;
}

function compute(operand1 , operator , operand2) {
    operand1 = parseFloat(operand1);
    operand2 = parseFloat(operand2);
    switch (operator) {
        case "+": return operand1 + operand2;
        case "-": return operand1 - operand2;
        case "*": return operand1 * operand2;
        case "/": return operand1 / operand2;
    }
}
function setScreen(value) {
    if (calcScreen.value === "Math Error") calcScreen.value = "";
    calcScreen.value += value;
}