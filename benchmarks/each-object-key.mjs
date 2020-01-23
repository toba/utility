import Benchmark from 'benchmark'
import process from 'process'

/*
Object.keys().forEach() x 881 ops/sec ±0.22% (92 runs sampled)
custom forEachKey() method x 883 ops/sec ±0.53% (93 runs sampled)
*/

const suite = new Benchmark.Suite('Object key/value iteration')
const size = 10000
const hash = {}
let i = 0

for (i = 0; i < size; i++) {
   hash[`key-${i}`] = Math.random()
}

const add = n => n + 10

function forEach(list, fn) {
   const length = list.length
   for (let i = 0; i < length; i++) {
      fn(list[i], i)
   }
}

function forEachKeyValue(hash, fn) {
   forEach(Object.keys(hash), key => fn(key, hash[key]))
}

suite
   .add('Object.keys().forEach()', () => {
      Object.keys(hash).forEach(key => add(hash[key]))
   })
   .add('custom forEachKey() method', () => {
      forEachKeyValue(hash, (key, value) => add(value))
   })
   .on('start', function() {
      console.log(`${this.name} with Node ${process.version}\n`)
   })
   .on('cycle', event => {
      console.log(String(event.target))
   })
   .on('complete', function() {
      console.log('\nFastest is ' + this.filter('fastest').map('name'))
   })
   .run({ async: true })
