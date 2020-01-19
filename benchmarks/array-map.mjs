import Benchmark from 'benchmark'
import process from 'process'

// https://jsperf.com/toba-array-map
const suite = new Benchmark.Suite('Array.map() Comparisons')

const size = 10000
const values = new Array(size)
let i = 0

for (i = 0; i < size; i++) {
   values[i] = Math.random()
}

function filterMap(list, filter, map) {
   const length = list.length
   const out = []
   let i = 0

   for (i = 0; i < length; i++) {
      const v = list[i]
      if (filter(v, i)) {
         out.push(map(v, i))
      }
   }
   return out
}

const out1 = values.map(v => v + 10)

const out2 = fastMap(values, v => v + 10)
