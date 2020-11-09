function toggle(...values) {
    var cpt = 0;
    var currentValue;

    if (0 === values.length) {
        return undefined;
    }

    return function getCurrentValue() {
        // handle the case when we call the toggler instance one more time after getting the last value
        // start again to show the first value of the toggler
        if (cpt === values.length) {
            cpt = 0;
        }

        currentValue = values[cpt];
        cpt++;

        return currentValue;
    }
}

var hello = toggle('hello');
var onOff = toggle('on', 'off');
var speed = toggle('slow', 'medium', 'fast');

console.log(hello());
console.log(hello());

console.log(onOff());
console.log(onOff());
console.log(onOff());

console.log(speed());
console.log(speed());
console.log(speed());
console.log(speed());
