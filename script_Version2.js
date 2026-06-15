class Calculator {
    constructor() {
        this.display = document.querySelector('.display');
        this.buttons = document.querySelectorAll('.btn');
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                const number = button.dataset.number;
                const operator = button.dataset.operator;
                const action = button.dataset.action;

                if (number !== undefined) {
                    this.handleNumber(number);
                } else if (operator !== undefined) {
                    this.handleOperator(operator);
                } else if (action) {
                    this.handleAction(action);
                }
            });
        });
    }

    handleNumber(number) {
        // Prevent multiple decimal points
        if (number === '.' && this.currentValue.includes('.')) {
            return;
        }

        // Reset display if needed
        if (this.shouldResetDisplay) {
            this.currentValue = number === '.' ? '0.' : number;
            this.shouldResetDisplay = false;
        } else {
            // Avoid leading zeros
            if (this.currentValue === '0' && number !== '.') {
                this.currentValue = number;
            } else {
                this.currentValue += number;
            }
        }

        this.updateDisplay();
    }

    handleOperator(operator) {
        const inputValue = parseFloat(this.currentValue);

        if (this.previousValue === '') {
            this.previousValue = inputValue;
        } else if (this.operator) {
            const result = this.calculate(
                this.previousValue,
                inputValue,
                this.operator
            );
            this.currentValue = String(result);
            this.previousValue = result;
        }

        this.operator = operator;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    handleAction(action) {
        if (action === 'clear') {
            this.clear();
        } else if (action === 'delete') {
            this.delete();
        } else if (action === 'equals') {
            this.equals();
        }
    }

    calculate(prev, current, operator) {
        switch (operator) {
            case '+':
                return prev + current;
            case '-':
                return prev - current;
            case '*':
                return prev * current;
            case '/':
                return current !== 0 ? prev / current : 0;
            default:
                return current;
        }
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    delete() {
        if (this.shouldResetDisplay) return;
        
        if (this.currentValue.length === 1) {
            this.currentValue = '0';
        } else {
            this.currentValue = this.currentValue.slice(0, -1);
        }
        
        this.updateDisplay();
    }

    equals() {
        if (this.operator && this.previousValue !== '') {
            const result = this.calculate(
                this.previousValue,
                parseFloat(this.currentValue),
                this.operator
            );
            
            this.currentValue = String(result);
            this.previousValue = '';
            this.operator = null;
            this.shouldResetDisplay = true;
            this.updateDisplay();
        }
    }

    updateDisplay() {
        // Format large numbers
        let displayValue = this.currentValue;
        if (displayValue.length > 12) {
            displayValue = parseFloat(displayValue).toExponential(5);
        }
        this.display.textContent = displayValue;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});