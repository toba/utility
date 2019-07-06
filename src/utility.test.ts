import '@toba/test';
import {
   merge,
   mergeAll,
   inferMimeType,
   MimeType,
   addCharSet,
   clone
} from './index';

type TestThing = {
   [key: string]: string | string[] | TestThing | Function | null;
};

/**
 * Functionality expected of both `merge` and `mergeAll`.
 */
function commonMergeTests(fn: <T>(base: T, ...additions: any[]) => T) {
   test('merges different keys into one object', () => {
      expect(fn({ one: 1 }, { two: 2, three: 3 })).toEqual({
         one: 1,
         two: 2,
         three: 3
      });
   });

   test('merges many objects', () => {
      expect(fn({ one: 1 }, { two: 2 }, { three: 3 })).toEqual({
         one: 1,
         two: 2,
         three: 3
      });
   });

   test('handles undefined objects', () => {
      expect(fn({ one: 1 }, null, { two: 2 }, undefined, { three: 3 })).toEqual(
         {
            one: 1,
            two: 2,
            three: 3
         }
      );
   });

   test('overwrites existing keys', () => {
      expect(fn({ one: 1, two: 2 }, { one: 11, three: 3 })).toEqual({
         one: 11,
         two: 2,
         three: 3
      });
   });

   test('deep merges objects', () => {
      expect(fn({ o: { one: 1 } }, { o: { two: 2 } })).toEqual({
         o: {
            one: 1,
            two: 2
         }
      });
   });

   test('overwrites scalar arrays', () => {
      expect(
         fn(
            { countFalse: true, exclude: [], only: [] },
            { countFalse: false, only: ['one', 'child.two'] }
         )
      ).toEqual({
         countFalse: false,
         exclude: [],
         only: ['one', 'child.two']
      });
   });

   test('replaces booleans', () => {
      expect(fn({ bool: true }, { bool: false })).toEqual({
         bool: false
      });

      expect(fn({ bool: false }, { bool: true })).toEqual({
         bool: true
      });

      expect(fn({ bool: true }, { one: null }, { bool: false })).toEqual({
         one: null,
         bool: false
      });
   });

   test('allows rest argument destructuring', () => {
      const additions = [
         { one: 1, two: 2 },
         { one: 11, three: 3 },
         { five: 5, six: 6 }
      ];
      expect(fn({ one: null }, ...additions)).toEqual({
         one: 11,
         two: 2,
         three: 3,
         five: 5,
         six: 6
      });
   });
}

test('merges objects', () => {
   const baseFn = () => 3;
   const base: TestThing = {
      key1: 'value1',
      key2: 'value2',
      key5: [] as string[],
      key6: null,
      key7: baseFn
   };
   const addFn = () => 5;
   const add1: TestThing = { key1: null, key3: 'value3' };
   const add2: TestThing = {
      key1: 'newValue1',
      key4: 'value4',
      key5: ['one', 'two'],
      key6: 'newValue6',
      key7: addFn
   };

   expect(merge(base, add1)).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key5: [],
      key6: null,
      key7: baseFn
   });

   expect(merge(base, add1, add2)).toEqual({
      key1: 'newValue1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
      key5: ['one', 'two'],
      key6: 'newValue6',
      key7: addFn
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

commonMergeTests(merge);
commonMergeTests(mergeAll);

test('merges configurations', () => {
   const defaultConfig = {
      userID: null,
      appID: null,
      useCache: true,
      maxCacheSize: 200,
      featureSets: [] as string[],
      excludeSets: [] as string[],
      excludeTags: [] as string[],
      searchPhotoSizes: ['url_l'],
      setPhotoSizes: ['url_l'],
      maxRetries: 3,
      retryDelay: 500,
      auth: null as any
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

test('replaces all values even if new value is null or undefined', () => {
   expect(mergeAll({ one: 1, two: 2 }, { one: null, two: undefined })).toEqual({
      one: null,
      two: undefined
   });
});

test('infers Mime type from file name', () => {
   expect(inferMimeType('file.jpg')).toBe(MimeType.JPEG);
   expect(inferMimeType('long.file.jpeg')).toBe(MimeType.JPEG);

   expect(inferMimeType('something.png')).toBe(MimeType.PNG);
   expect(inferMimeType('my garmin file with spaces.gpx')).toBe(MimeType.GPX);

   expect(inferMimeType('My Good Document.PDF')).toBe(MimeType.PDF);

   expect(inferMimeType('feed.atom')).toBe(MimeType.Atom);
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

   expect(clone(undefined)).toBeUndefined();
   expect(clone(null)).toBeNull();
});

test('clones arrays', () => {
   const thing = ['one', { value: 'two' }];
   const thing2 = clone(thing);

   expect(thing2).toBeInstanceOf(Array);
   expect(thing2.length).toBe(2);
});
