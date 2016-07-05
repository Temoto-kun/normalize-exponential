# normalize-exponential

Normalizes exponential format in float-parseable strings.

## Why?

If, for example, you want to work on floating point values without needing to parse it (as it loses the precision),
and you want to be able to represent your values into an exponential notation, you'll need something like this
package.

## Installation

Via NPM:

    $ npm install --save @theoryofnekomata/normalize-exponential

## Usage

```javascript
var normalizeExp = require('@theoryofnekomata/normalize-exponential');

var floatStr = '00003453.654345000e+34',
    normalizedFloat = normalizeExp(floatStr); // returns 3.453654345e+37

// ...
```

## Notes

It enforces the output to be in lowercase (i.e. 'e' instead of 'E').

## Contribution

Sure thing! Just clone the repo.

`to-sass-value` uses [Jasmine](https://jasmine.github.io) for unit tests, and
[ESLint](http://eslint.org) to make sure code is written consistently (and implied it will
run consistently as well).

- Run `npm install` upon initial clone.
- Run `npm test` and make sure all the tests pass and properly written.
- Run `npm run lint` to ensure consistency of your code (make sure to install ESLint first).
- Create PRs so that I can confirm and merge your contributions.

Please star the repo if you find it useful in your projects.

## License

MIT. See [LICENSE file](https://raw.githubusercontent.com/Temoto-kun/normalize-exponential/master/LICENSE) for details.
