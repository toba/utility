import '@toba/test';
import {
   merge,
   inferMimeType,
   MimeType,
   byteSize,
   gzip,
   unzip,
   env,
   addCharSet,
   clone
} from './index';
import { lipsum } from '@toba/test';

type TestThing = { [key: string]: string | string[] | TestThing };

test('merges objects', () => {
   const base: TestThing = {
      key1: 'value1',
      key2: 'value2',
      key5: [],
      key6: null
   };
   const add1: TestThing = { key1: null, key3: 'value3' };
   const add2: TestThing = {
      key1: 'newValue1',
      key4: 'value4',
      key5: ['one', 'two'],
      key6: 'newValue6'
   };

   expect(merge(base, add1)).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key5: [],
      key6: null
   });

   expect(merge(base, add1, add2)).toEqual({
      key1: 'newValue1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
      key5: ['one', 'two'],
      key6: 'newValue6'
   });
});

test('merges nested objects', () => {
   const base: TestThing = {
      key1: 'value1',
      key2: 'value2',
      key5: { key10: 'value10', key11: 'value11' },
      key6: null
   };
   const add1: TestThing = { key1: null, key3: 'value3' };
   const add2: TestThing = {
      key1: 'newValue1',
      key4: 'value4',
      key5: { key10: 'new-value10', key12: 'value12' },
      key6: { key13: 'new-value13', key14: 'value14' }
   };

   expect(merge(base, add1)).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key5: { key10: 'value10', key11: 'value11' },
      key6: null
   });

   expect(merge(base, add1, add2)).toEqual({
      key1: 'newValue1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
      key5: { key10: 'new-value10', key11: 'value11', key12: 'value12' },
      key6: { key13: 'new-value13', key14: 'value14' }
   });
});

test('merges configurations', () => {
   const defaultConfig = {
      userID: null,
      appID: null,
      useCache: true,
      maxCacheSize: 200,
      featureSets: [],
      excludeSets: [],
      excludeTags: [],
      searchPhotoSizes: ['url_l'],
      setPhotoSizes: ['url_l'],
      maxRetries: 3,
      retryDelay: 500,
      auth: null
   };

   const givenConfig = {
      appID: '72157631007435048',
      userID: '60950751@N04',
      excludeSets: ['72157631638576162'],
      excludeTags: [
         'Idaho',
         'United States of America',
         'Abbott',
         'LensTagger',
         'Boise'
      ],
      featureSets: [{ id: '72157632729508554', title: 'Ruminations' }],
      useCache: false,
      auth: {
         apiKey: 'FLICKR_API_KEY',
         secret: 'FLICKR_SECRET',
         callback: 'http://www.trailimage.com/auth/flickr',
         token: {
            access: 'FLICKR_ACCESS_TOKEN',
            secret: 'FLICKR_TOKEN_SECRET',
            request: null
         }
      }
   };

   expect(merge(defaultConfig, givenConfig)).toMatchSnapshot();
});

test('infers Mime type from file name', () => {
   expect(inferMimeType('file.jpg')).toBe(MimeType.JPEG);
   expect(inferMimeType('long.file.jpeg')).toBe(MimeType.JPEG);

   expect(inferMimeType('something.png')).toBe(MimeType.PNG);
   expect(inferMimeType('my garmin file with spaces.gpx')).toBe(MimeType.GPX);

   expect(inferMimeType('My Good Document.PDF')).toBe(MimeType.PDF);

   expect(inferMimeType('feed.atom')).toBe(MimeType.Atom);
});

test('reports byte size of strings and buffers', () => {
   const buf = Buffer.from([1, 2, 3]);

   expect(byteSize('some text')).toBe(9);
   expect(byteSize(buf)).toBe(3);
   expect(byteSize({ random: 'object' })).toBe(-1);
});

test('zips and unzips strings', async () => {
   const buffer = await gzip(lipsum);
   // raw length is 445
   expect(byteSize(buffer)).toBeLessThan(300);
   const text = await unzip(buffer);
   expect(text).toBe(lipsum);
});

test('reads environmnent variables with option for alternate', () => {
   const nope = 'probably-does-not-exist';
   expect(env('PATH')).toBeDefined();
   expect(env(nope, 'alternate')).toBe('alternate');

   let v: string;
   let e: Error;

   try {
      v = env(nope);
   } catch (err) {
      e = err;
   }

   expect(v).toBeUndefined();
   expect(e).toBeDefined();
   expect(e.message).toBe(`Environment value ${nope} does not exist`);
});

test('returns MIME type with standard charset extension', () => {
   expect(addCharSet(MimeType.JSON)).toBe('application/json; charset=utf-8');
});

test('clones objects', () => {
   const thing = {
      key1: 'value1',
      key2: 'value2',
      nested: {
         key3: 'value3',
         key4: 'value4'
      },
      list: [{ name: 'one' }, { name: 'two' }]
   };
   const thing2 = clone(thing);
   expect(thing2).toHaveProperty('key1', 'value1');
   expect(thing2).toHaveProperty('nested');
   expect(thing2.nested).toHaveProperty('key3', 'value3');
   expect(thing2.list).toBeInstanceOf(Array);

   thing.nested.key3 = 'wooly';

   expect(thing2.nested.key3).toBe('value3');
});

test('clones arrays', () => {
   const thing = ['one', { value: 'two' }];
   const thing2 = clone(thing);

   expect(thing2).toBeInstanceOf(Array);
   expect(thing2.length).toBe(2);
});
