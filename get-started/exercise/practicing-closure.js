function range(start, end) {
  // To avoid type error
  start = Number(start) || 0;

  if (undefined === end) {
    return function getEnd(end) {
      return getRange(start, end);
    };
  }

  end = Number(end) || 0;
  return getRange(start, end);
}

function getRange(start, end) {
  var range = [];

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  return range;
}

console.log(range(3, 3));
console.log(range(3, 8));
console.log(range(3, 0));

var start3 = range(3);
var start4 = range(4);

console.log(start3(3));
console.log(start3(8));
console.log(start3(0));
console.log(start4(6));
