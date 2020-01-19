import '@toba/test'
import { session } from './index'

test('save numbers', () => {
   session.save('test-key', 99)
   expect(session.item('test-key')).toBe(99)
})
