function EnterNumber(value) {
    setScreen(value);
}
function EnterOperator(operator) {
    setScreen(operator);
}
function EnterClear() {
    let calcScreen = document.getElementById("Answer")
    calcScreen.value = "";
}
function EnterEqual() {
    let input = document.getElementById("Answer");
    let expression = input.value;

    // Get operands and operators
    let operands = expression.match(/\d+(\.\d+)?/g);
    let operators = expression.match(/[+\-*/]/g);

    if (!operands || operands.length === 0) {
        input.value = "Syntax Error";
        return;
    }

    // Compute step-by-step left to right
    let result = parseFloat(operands[0]);

    for (let i = 0; i < operators.length; i++) {
        let nextOperand = parseFloat(operands[i + 1]);
        let operator = operators[i];

        result = compute(result, operator, nextOperand);

        if (isNaN(result) || !isFinite(result)) {
            input.value = "Math Error";
            return;
        }
    }

    input.value = result;
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
    let input = document.getElementById("Answer");
    if (input.value === "Math Error") input.value = "";
    input.value += value;
}