var isPrime = (function isPrime(v) {
    var primes = {};
    return function isPrime(v) {
        if (v in primes) {
            return primes[v];
        }

        if (v <= 3) {
            primes[v] = v > 1;

            return primes[v];
        }

        if (v % 2 == 0 || v % 3 == 0) {
            primes[v] = false;

            return primes[v];
        }

        var vSqrt = Math.sqrt(v);
        for(let i = 5; i <= vSqrt; i += 6) {
            if (v % i === 0 || v % (i + 2) == 0) {
                primes[v] = false;

                return primes[v];
            }
        }

        primes[v] = true;

        return primes[v];
    }
})();

var factorize = (function factorize(v) {
    var factors = {};

    return function findFactors(v) {
        if (v in factors) {
            return factors[v];
        }

        if (!isPrime(v)) {
            let i = Math.floor(Math.sqrt(v));
            while (v % i != 0) {
                i--;
            }

            factors[v] = [
                ...findFactors(i),
                ...findFactors(v / i)
            ];

            return factors[v];
        }

        factors[v] = [v];

        return factors[v];
    }
})();

console.log(isPrime(11));
console.log(isPrime(12));
console.log(isPrime(4327));
console.log(isPrime(4327));
console.log(isPrime(4327));
console.log(isPrime(4327));

console.log(factorize(11));
console.log(factorize(12));
console.log(factorize(4327));
console.log(factorize(4327));
console.log(factorize(4327));
console.log(factorize(4327));
