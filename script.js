let currentExpression = '';
let shouldResetDisplay = false;
let history = [];

const expressionDisplay = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
const historyDisplay = document.getElementById('history');

function updateDisplay() {
    expressionDisplay.textContent = currentExpression || '';
    if (currentExpression === '') {
        resultDisplay.textContent = '0';
    }
}

function inputNumber(num) {
    if (shouldResetDisplay) {
        currentExpression = '';
        shouldResetDisplay = false;
    }
    
    if (num === '.' && currentExpression.slice(-1) === '.') return;
    if (num === '.' && getCurrentNumber().includes('.')) return;
    if (num === '0' && getCurrentNumber() === '0') return;
    if (getCurrentNumber() === '0' && num !== '.') {
        currentExpression = currentExpression.slice(0, -1);
    }
    
    currentExpression += num;
    resultDisplay.textContent = getCurrentNumber();
    updateDisplay();
}

function inputOperator(operator) {
    if (currentExpression === '') {
        if (operator === '-') {
            currentExpression = '-';
            updateDisplay();
        }
        return;
    }
    
    if (shouldResetDisplay) {
        shouldResetDisplay = false;
    }
    
    const lastChar = currentExpression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentExpression = currentExpression.slice(0, -1);
    }
    
    currentExpression += operator;
    updateDisplay();
}

function getCurrentNumber() {
    const matches = currentExpression.match(/(\d+\.?\d*)$/);
    return matches ? matches[0] : '0';
}

function calculate() {
    if (currentExpression === '' || shouldResetDisplay) return;
    
    try {
        // Remove trailing operators
        let expression = currentExpression.replace(/[+\-*/]$/, '');
        if (expression === '') return;
        
        // Replace display symbols with actual operators
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        
        // Evaluate the expression
        const result = Function('"use strict"; return (' + expression + ')')();
        
        if (!isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        // Add to history
        const historyItem = `${currentExpression} = ${result}`;
        history.unshift(historyItem);
        if (history.length > 10) history.pop();
        updateHistory();
        
        // Update display
        resultDisplay.textContent = result;
        resultDisplay.classList.add('fade-in');
        setTimeout(() => resultDisplay.classList.remove('fade-in'), 300);
        
        currentExpression = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
        
    } catch (error) {
        resultDisplay.textContent = 'Error';
        shouldResetDisplay = true;
    }
}

function clearCalculator() {
    currentExpression = '';
    shouldResetDisplay = false;
    resultDisplay.textContent = '0';
    updateDisplay();
}

function deleteLast() {
    if (shouldResetDisplay) {
        clearCalculator();
        return;
    }
    
    currentExpression = currentExpression.slice(0, -1);
    if (currentExpression === '' || currentExpression === '-') {
        resultDisplay.textContent = '0';
    } else {
        resultDisplay.textContent = getCurrentNumber();
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
    event.preventDefault();
    
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        inputNumber(key);
    } else if (key === '+' || key === '-') {
        inputOperator(key);
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