let currentInput = '';
let displayExpression = '';

function updateScreen() {
    document.getElementById('current').innerText = currentInput || '0';
    document.getElementById('history').innerText = displayExpression;
}

function clearDisplay() {
    currentInput = '';
    displayExpression = '';
    updateScreen();
}

function deleteDisplay() {
    currentInput = currentInput.toString().slice(0, -1);
    updateScreen();
}

function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) return;
    currentInput += number.toString();
    updateScreen();
}

function appendOperator(operator) {
    if (currentInput === '' && displayExpression === '' && operator !== '(') return;
    
    if (currentInput !== '') {
        displayExpression += currentInput + ' ' + operator + ' ';
        currentInput = '';
    } else if (operator === '(' || operator === ')') {
         displayExpression += operator + ' ';
    } else {
        // Change the last operator if user typed consecutive operators
        if (displayExpression.length >= 3) {
            displayExpression = displayExpression.slice(0, -3) + ' ' + operator + ' ';
        }
    }
    updateScreen();
}

function calculateResult() {
    if (currentInput === '' && displayExpression === '') return;
    
    let expression = displayExpression + currentInput;
    
    // Replace all spaces before evaluation
    let evalExpression = expression.replace(/ /g, ''); 
    
    try {
        // Using new Function as a safer alternative to eval
        let result = new Function('return ' + evalExpression)();
        
        // Handle floating point precision issues (e.g. 0.1 + 0.2)
        result = Math.round(result * 100000000) / 100000000;
        
        displayExpression = '';
        currentInput = result.toString();
        
        // Custom update so history shows full equation
        document.getElementById('current').innerText = currentInput;
        document.getElementById('history').innerText = expression + ' =';
    } catch (e) {
        document.getElementById('current').innerText = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

// Add Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (/[0-9\.]/.test(key)) {
        appendNumber(key);
    } else if (['+', '-', '*', '/', '(', ')'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Prevent accidental form submit or scrolling
        calculateResult();
    } else if (key === 'Backspace') {
        deleteDisplay();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    }
});

// Initialize screen on load
window.onload = updateScreen;
