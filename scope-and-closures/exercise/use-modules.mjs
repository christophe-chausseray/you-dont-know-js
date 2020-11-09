// For consistency's sake but could import each function individually with { number, plus, ... }
import * as calculatorESM from './modules-esm.mjs';

console.log(calculatorESM.number('4'));
console.log(calculatorESM.plus());
console.log(calculatorESM.number('7'));
console.log(calculatorESM.number('3'));
console.log(calculatorESM.minus());
console.log(calculatorESM.number('2'));
console.log(calculatorESM.eq());
