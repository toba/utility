import '@toba/test';
import {
   printf,
   wrapText,
   titleCase,
   capitalize,
   slug,
   format,
   encodeBase64,
   decodeBase64,
   htmlEscape,
   htmlUnescape
} from '../';
import { htmlEntity } from './text';

const code: { [key: string]: string } = {
   lt: `&${htmlEntity.get('<')};`,
   gt: `&${htmlEntity.get('>')};`,
   slash: `&${htmlEntity.get('/')};`,
   and: `&${htmlEntity.get('&')};`,
   quote: `&${htmlEntity.get('"')};`,
   singleQuote: `&${htmlEntity.get(`'`)};`
};

const longText =
   'Meeting Melissa after work, our recruiter sent your resume to her tech headhunter connection.';

test('formats text with substitutions', () => {
   expect(printf('this $1 thing', 'one')).toBe('this one thing');
});

test('substitutes placeholders for values', () => {
   expect(format('nothing')).toBe('nothing');
   expect(format('{0} {1}', 'one', 'two')).toBe('one two');
   expect(format('{1} {0}', 'one', 'two')).toBe('two one');
});

test('capitalizes words', () => {
   expect(titleCase('one two')).toBe('One Two');
   expect(titleCase('onetwo 22')).toBe('Onetwo 22');
   expect(titleCase('BLM - BUREAU OF LAND MANAGEMENT')).toBe(
      'BLM - Bureau of Land Management'
   );
   expect(titleCase('some road 12-34R')).toBe('Some Road 12-34R');
   expect(titleCase('the sentence')).toBe('The Sentence');
   expect(titleCase('went to the south')).toBe('Went to the South');
   expect(titleCase(`i haven't showered`)).toBe(`I Haven't Showered`);
   expect(titleCase('IDAHO DEPARTMENT OF PARKS & RECREATION')).toBe(
      'Idaho Department of Parks & Recreation'
   );
   expect(titleCase('fan saddle south a')).toBe('Fan Saddle South A');
});

it('converts words to URL slug', () => {
   expect(slug('Wiggle and Roll')).toBe('wiggle-and-roll');
   expect(slug('Wiggle and    Sing')).toBe('wiggle-and-sing');
   expect(slug('Too---dashing')).toBe('too-dashing');
   expect(slug('powerful/oz')).toBe('powerful-oz');
   expect(slug(`three o' clock`)).toBe('three-o-clock');
});

test('capitalizes first word', () => {
   expect(capitalize('one two')).toBe('One two');
});

test('wraps text', () => {
   expect(wrapText('this thing', -2)).toBe('this thing');
   expect(wrapText('this thing', 5)).toBe('this\nthing');
   expect(wrapText('this thing', 5, null)).toBe('this thing');
   expect(wrapText('this thing', 5, '<br/>')).toBe('this<br/>thing');
   expect(wrapText('this thing')).toBe('this thing');
   expect(wrapText(longText, 40, '<br/>')).toBe(
      'Meeting Melissa after work, our<br/>recruiter sent your resume to her tech<br/>headhunter connection.'
   );
});

test('base 64 encodes text', () => {
   expect(encodeBase64('Neque porro quisquam est qui dolorem ipsum')).toBe(
      'TmVxdWUgcG9ycm8gcXVpc3F1YW0gZXN0IHF1aSBkb2xvcmVtIGlwc3Vt'
   );
});

test('base 64 decodes text', () => {
   expect(
      decodeBase64('TmVxdWUgcG9ycm8gcXVpc3F1YW0gZXN0IHF1aSBkb2xvcmVtIGlwc3Vt')
   ).toBe('Neque porro quisquam est qui dolorem ipsum');
});

test('escapes HTML', () => {
   const html = '<title class=\'css\'>thing <i>italic</i> "quote"</title>';
   const escaped = `${code.lt}title class=${code.singleQuote}css${
      code.singleQuote
   }${code.gt}thing ${code.lt}i${code.gt}italic${code.lt}${code.slash}i${
      code.gt
   } ${code.quote}quote${code.quote}${code.lt}${code.slash}title${code.gt}`;

   expect(htmlEscape(html)).toBe(escaped);
   expect(htmlUnescape(escaped)).toBe(html);
});
