const math = require('mathjs');

const a = math.matrix([
    [1, 2, 3],
    [3, 4, 6]
]);
const b = math.matrix([
    [5, 6],
    [3, 4],
    [-6, 9]
]);

const c = math.multiply(a, b);
console.log(c);