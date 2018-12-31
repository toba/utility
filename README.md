[![npm package](https://img.shields.io/npm/v/@toba/tools.svg)](https://www.npmjs.org/package/@toba/tools)
[![Build Status](https://travis-ci.org/toba/tools.svg?branch=master)](https://travis-ci.org/toba/tools)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![Dependencies](https://img.shields.io/david/toba/tools.svg)](https://david-dm.org/toba/tools)
[![DevDependencies](https://img.shields.io/david/dev/toba/tools.svg)](https://david-dm.org/toba/tools#info=devDependencies&view=list)
[![codecov](https://codecov.io/gh/toba/tools/branch/master/graph/badge.svg)](https://codecov.io/gh/toba/tools)

<img src='https://toba.github.io/about/images/logo-colored.svg' width="100" align="right"/>

# Toba Tools

📖 [Using a TypeScript module](https://toba.github.io/about/usage)

-  [Identity](#identity)
-  [Caching](#caching)

### Identity

```ts
import { is } from '@toba/tools';
```

Identity checks evaluate whether a variable is of a given type. All return `true` or `false`. Where possible, they implement TypeScript [type guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards) so the value is thereafter recognized as a particular type.

#### value
```ts
is.value(x);
```
Whether `x` is not `undefined` and not `null`.

The parameter is generic so the variable may thereafter be recognized as that type. For example, if `is.value<string>(var)` evaluates `true` then TypeScript will also know to treat `var` as a `string`.

#### empty
```ts
is.empty(x);
```
Whether `x` is `undefined`, `null` or an empty string (`""`).

#### defined
```ts
is.defined(x, name);
```
Whether `name` is a property of the object `x`. 


### Caching

stuff

## License

Copyright &copy; 2019 Jason Abbott

This software is licensed under the MIT license. See the [LICENSE](./LICENSE) file
accompanying this software for terms of use.
