import Benchmark from 'benchmark'
import process from 'process'

// https://jsperf.com/toba-2d-array
const suite = new Benchmark.Suite('2D Array Structures')
const size = 5000
const interleaved = new Array(size * 2)
const inner = new Array(size * 2)
const nested = new Array(size)
const parallel1 = new Array(size)
const parallel2 = new Array(size)
const pending = new Array(size * 2)

let i = 0

const getItem = (list, index) => [list[index * 2], list[index * 2 + 1]]
const pushItem = (list, a, b) => {
   list.push(a)
   return list.push(b)
}

function duo(list) {
   return {
      item: index => getItem(list, index),
      push: (a, b) => pushItem(list, a, b)
   }
}

for (i = 0; i < size; i++) {
   const a = Math.random()
   const b = { field: 'three', value: a }
   parallel1[i] = a
   parallel2[i] = b
   nested[i] = [a, b]

   const j = i * 2
   interleaved[j] = a
   interleaved[j + 1] = b
   inner[j] = a
   inner[j + 1] = b

   // create array of values to be added within each scenario
   const a2 = Math.random()
   const b2 = { field: 'three', value: a2 }
   pending[j] = a2
   pending[j + 1] = b2
}

const duoList = duo(inner)

suite
   .add('interleaved handled directly', () => {
      for (i = 0; i < size; i++) {
         const j = i * 2
         const a = interleaved[j]
         const b = interleaved[j + 1]
         if (a != b.value) {
            throw new Error('Interleaved basic mismatch')
         }
         // add values
         const a2 = pending[j]
         const b2 = pending[j + 1]

         interleaved.push(a2, b2)
      }
   })
   .add('interleaved with function wrapper', () => {
      for (i = 0; i < size; i++) {
         const m = duoList.item(i)
         const a = m[0]
         const b = m[1]
         if (a != b.value) {
            throw new Error('Interleaved function mismatch')
         }
         // add values
         const j = i * 2
         const a2 = pending[j]
         const b2 = pending[j + 1]

         duoList.push(a2, b2)
      }
   })
   .add('separate parallel arrays', () => {
      for (i = 0; i < size; i++) {
         const a = parallel1[i]
         const b = parallel2[i]
         if (a != b.value) {
            throw new Error('Separate paraellel mismatch')
         }
         // add values
         const j = i * 2
         const a2 = pending[j]
         const b2 = pending[j + 1]

         parallel1.push(a2)
         parallel2.push(b2)
      }
   })
   .add('nested arrays', () => {
      for (i = 0; i < size; i++) {
         const a = nested[i][0]
         const b = nested[i][1]
         if (a != b.value) {
            throw new Error('Nested mismatch')
         }
         // add values
         const j = i * 2
         const a2 = pending[j]
         const b2 = pending[j + 1]

         nested.push([a2, b2])
      }
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
