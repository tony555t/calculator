let currentInput = '0';
let previousInput = null;
let operator = null;
let waitingForNewInput = false;
let history = [];

const expressionDisplay = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
const historyDisplay = document.getElementById('history');

function updateDisplay() {
    resultDisplay.textContent = currentInput;
    
    // Build expression display
    let expressionText = '';
    if (previousInput !== null) {
        expressionText += previousInput;
        if (operator) {
            expressionText += ` ${getOperatorSymbol(operator)} `;
            if (!waitingForNewInput) {
                expressionText += currentInput;
            }
        }
    }
    expressionDisplay.textContent = expressionText;
}

function getOperatorSymbol(op) {
    switch(op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}

function inputNumber(num) {
    if (waitingForNewInput || currentInput === '0') {
        currentInput = num;
        waitingForNewInput = false;
    } else {
        // Prevent multiple decimal points
        if (num === '.' && currentInput.includes('.')) return;
        currentInput += num;
    }
    updateDisplay();
}

function inputOperator(newOperator) {
    const inputValue = parseFloat(currentInput);
    
    // If we have a previous calculation pending, calculate it first
    if (previousInput !== null && operator !== null && !waitingForNewInput) {
        const result = performCalculation();
        if (result === null) return; // Error occurred
        
        currentInput = result.toString();
        updateDisplay();
    }
    
    previousInput = inputValue;
    operator = newOperator;
    waitingForNewInput = true;
    updateDisplay();
}

function performCalculation() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return null;
    
    let result;
    switch(operator) {
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
            if (current === 0) {
                resultDisplay.textContent = 'Error';
                clearCalculator();
                return null;
            }
            result = prev / current;
            break;
        default:
            return null;
    }
    
    // Handle floating point precision
    if (result % 1 !== 0) {
        result = parseFloat(result.toFixed(10));
    }
    
    return result;
}

function calculate() {
    if (operator === null || previousInput === null || waitingForNewInput) {
        return;
    }
    
    const result = performCalculation();
    if (result === null) return;
    
    // Add to history
    const expressionText = `${previousInput} ${getOperatorSymbol(operator)} ${currentInput} = ${result}`;
    history.unshift(expressionText);
    if (history.length > 10) history.pop();
    updateHistory();
    
    // Update display with animation
    currentInput = result.toString();
    previousInput = null;
    operator = null;
    waitingForNewInput = true;
    
    resultDisplay.classList.add('fade-in');
    setTimeout(() => resultDisplay.classList.remove('fade-in'), 300);
    
    updateDisplay();
}

function clearCalculator() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    waitingForNewInput = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function updateHistory() {
    if (history.length === 0) {
        historyDisplay.style.display = 'none';
        return;
    }
    
    historyDisplay.style.display = 'block';
    const historyItems = history.map(item => 
        `<div class="history-item">${item}</div>`
    ).join('');
    
    historyDisplay.innerHTML = `
        <div style="color: #cbd5e0; font-weight: 500; margin-bottom: 8px;">History</div>
        ${historyItems}
    `;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Don't prevent default for non-calculator keys
    if (!/[0-9+\-*/.=\r\n\x1b\x08c]/.test(key) && key !== 'Enter' && key !== 'Escape' && key !== 'Backspace') {
        return;
    }
    
    event.preventDefault();
    
    if (key >= '0' && key <= '9' || key === '.') {
        inputNumber(key);
    } else if (key === '+') {
        inputOperator('+');
    } else if (key === '-') {
        inputOperator('-');
    } else if (key === '*') {
        inputOperator('*');
    } else if (key === '/') {
        inputOperator('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearCalculator();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Button press effect for keyboard
document.addEventListener('keydown', function(event) {
    const button = document.querySelector(`[data-key="${event.key}"]`) || 
                  (event.key === 'Enter' ? document.querySelector('[data-key="Enter"]') : null);
    
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }
});

// Initialize display
updateDisplay();