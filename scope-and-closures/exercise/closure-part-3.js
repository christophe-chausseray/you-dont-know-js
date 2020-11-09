function calculator() {
    var currentTotal = 0;
    var currentValue = '';
    var currentOperator = '=';

    return function pressKey(key) {
        // if it's a number
        if (/\d/.test(key)) {
            currentValue += key;
            return key;
        }
        // if it's an operator
        else if (/[+*/-]/.test(key)) {
            // if it's multiple operation in series
            if ('=' != currentOperator && '' != currentValue) {
                // it's implied '=' keypress
                pressKey('=');
            } else if ('' != currentValue) {
                currentTotal = Number(currentValue);
            }

            currentOperator = key;
            currentValue = '';

            return key;
        }
        // if it's '=' key
        else if ('=' == key && '=' != currentOperator) {
            currentTotal = operation(currentTotal, currentOperator, Number(currentValue));
            currentOperator = '=';
            currentValue = '';

            return formatTotal(currentTotal);
        }

        return '';
    }

    function operation(currentTotal, currentOperator, currentValue) {
        switch (currentOperator) {
            case '+':
                currentTotal += currentValue;
                break;
            case '-':
                currentTotal -= currentValue;
                break;
            case '*':
                currentTotal = currentTotal * currentValue;
                break;
            case '/':
                currentTotal = currentTotal / currentValue;
                break;
            default:
                break;
        }

        return currentTotal;
    }
}

var calc = calculator();

console.log(calc('4'));
console.log(calc('+'));
console.log(calc('7'));
console.log(calc('3'));
console.log(calc('-'));
console.log(calc('2'));
console.log(calc('='));
console.log(calc('*'));
console.log(calc('4'));
console.log(calc('='));
console.log(calc('5'));
console.log(calc('-'));
console.log(calc('5'));
console.log(calc('='));

function useCalc(calc, keys) {
    return [...keys].reduce(function showDisplay(display, key) {
        var ret = String(calc(key));
        return (
            display +
            (
                (ret != '' && key == '=') ? '=' : ''
            ) +
            ret
        )
    });
}

console.log(useCalc(calc, '4+3='));
console.log(useCalc(calc, '+9='));
console.log(useCalc(calc, '*8='));
console.log(useCalc(calc, '7*2*3='));
console.log(useCalc(calc, '1/0='));
console.log(useCalc(calc, '+3='));
console.log(useCalc(calc, '51='));

function formatTotal(display) {
    if (Number.isFinite(display)) {
        // constrain display to max 11 chars
        let maxDigits = 11;
        // reserve space for 'e+' notation?
        if (Math.abs(display) > 99999999999) {
            maxDigits -= 6;
        }
        // reserve space for '-'?
        if (display < 0) {
            maxDigits--;
        }

        // whole number?
        if (Number.isInteger(display)) {
            display = display
                .toPrecision(maxDigits)
                .replace(/\.0+$/, '');
        }
        // decimal
        else {
            // reservce space for '.'
            maxDigits--;
            // reserve space for leading '0'?
            if (Math.abs(display) >= 0 && Math.abs(display) < 1) {
                maxDigits--;
            }
            display = display
                .toPrecision(maxDigits)
                .replace(/0+$/, '');
        }
    }
    else {
        display = 'ERR';
    }

    return display;
}

