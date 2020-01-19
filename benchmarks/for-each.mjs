import Benchmark from 'benchmark'
import process from 'process'

// https://jsperf.com/toba-array
const suite = new Benchmark.Suite('For-each Comparisons')
const size = 10000
const values = new Array(size)
let sum = 0
let i = 0

for (i = 0; i < size; i++) {
   values[i] = Math.random()
}

function add(n) {
   sum += n
}

function forEach(list, fn) {
   const length = list.length
   for (i = 0; i < length; i++) {
      fn(list[i])
   }
}

suite
   .add('classic for-loop', () => {
      for (i = 0; i < values.length; i++) {
         sum += values[i]
      }
   })
   .add('built-in forEach()', () => {
      values.forEach(add)
   })
   .add('custom forEach()', () => {
      forEach(values, add)
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
