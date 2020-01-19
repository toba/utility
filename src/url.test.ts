import '@toba/test'
import { url } from './index'

test('extracts query string variables', () => {
   let qs = url.variables('http://path.com/?var1=value1')
   expect(qs).not.toBeNull()
   expect(qs!.get('var1')).toBe('value1')

   qs = url.variables('http://path.com/?var1=value1&var2=value2')
   expect(qs!.get('var2')).toBe('value2')

   qs = url.variables(
      'file:///D:/dev/src/github.com/toba/timeline/index.html?key=23'
   )
   expect(qs!.get('key')).toBe('23')
})

test('handles URLs without querystring values', () => {
   let qs = url.variables('')
   expect(qs).toBeNull()

   qs = url.variables('http://path.com')
   expect(qs).toBeNull()
})
