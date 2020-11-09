'use strict';

Object.assign(module.exports, {
    number,
    plus,
    minus,
    mult,
    div,
    eq
});

/** Variables */

var currentTotal = 0;
var currentValue = '';
var currentOperator = '=';

/** Public functions */

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

/** Private functions */

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
