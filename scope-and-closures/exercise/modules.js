var calculator = (function calculator() {
    var currentTotal = 0;
    var currentValue = '';
    var currentOperator = '=';

    var publicAPI = {
        number,
        plus,
        minus,
        mult,
        div,
        eq
    };

    return publicAPI;

    //********

    function number(key) {
        currentValue += key;
        return key;
    }

    function plus() {
        return operator('+');
    }

    function minus() {
        return operator('-');
    }

    function mult() {
        return operator('*');
    }

    function div() {
        return operator('/');
    }

    function eq() {
        currentTotal = operation(currentTotal, currentOperator, Number(currentValue));
        currentOperator = '=';
        currentValue = '';

        return formatTotal(currentTotal);
    }

    function operator(key) {
        // if it's multiple operation in series
        if ('=' != currentOperator && '' != currentValue) {
            // it's implied '=' keypress
            eq();
        } else if ('' != currentValue) {
            currentTotal = Number(currentValue);
        }

        currentOperator = key;
        currentValue = '';

        return key;
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
})

var calc = calculator();

console.log(calc.number('4'));
console.log(calc.plus());
console.log(calc.number('7'));
console.log(calc.number('3'));
console.log(calc.minus());
console.log(calc.number('2'));
console.log(calc.eq());

function useCalc(calc, keys) {
    var keyMappings = {
        '+': 'plus',
        '-': 'minus',
        '*': 'mult',
        '/': 'div',
        '=': 'eq'
    };

    return [...keys].reduce(function showDisplay(display, key) {
        var fn = keyMappings[key] || 'number';
        var ret = String(calc[fn](key));

        return (
            display +
            (
                (ret != '' && key == '=') ? '=' : ''
            ) +
            ret
        );
    }, '');
}

console.log(useCalc(calc, '4+3='));
console.log(useCalc(calc, '+9='));
console.log(useCalc(calc, '*8='));
console.log(useCalc(calc, '7*2*3='));
console.log(useCalc(calc, '1/0='));
console.log(useCalc(calc, '+3='));
console.log(useCalc(calc, '51='));
