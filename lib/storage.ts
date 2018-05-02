import { Duration } from '../index';

export interface Storage<T> {
   save(key: string, value: T, days?: number, includeSubdomain?: boolean): void;
   remove(key: string): void;
   item(key: string): T;
}

export const session: Storage<any> = {
   save(key: string, value: any) {
      sessionStorage.setItem(key, JSON.stringify(value));
   },

   remove(key: string) {
      sessionStorage.removeItem(key);
   },

   item(key: string): any {
      const value = sessionStorage.getItem(key);
      return value !== null ? JSON.parse(value) : null;
   }
};

/**
 * Cookie storage. Use cookies only when their automatic transmission with the
 * request and response header is needed.
 */
export const cookie: Storage<string> = {
   save(key: string, value: string, days = 0, includeSubdomain = false) {
      let expires = '';
      const domain = includeSubdomain
         ? ''
         : '; domain=.' + window.location.hostname;

      if (days != 0) {
         const date = new Date();
         date.setTime(date.getTime() + days * Duration.Day);
         expires = '; expires=' + date.toUTCString();
      }
      document.cookie = key + '=' + value + domain + expires + '; path=/';
   },

   item(key: string): string {
      const nameEQ = key + '=';
      const pairs = document.cookie.split(';');

      for (let i = 0; i < pairs.length; i++) {
         let kv = pairs[i];
         while (kv.charAt(0) == ' ') {
            kv = kv.substring(1, kv.length);
         }
         if (kv.indexOf(nameEQ) == 0) {
            return kv.substring(nameEQ.length, kv.length);
         }
      }
      return null;
   },

   remove(key: string) {
      this.save(key, '', -1);
   }
};

/**
 * https://visualstudiomagazine.com/articles/2016/09/01/working-with-indexeddb.aspx
 * https://www.smashingmagazine.com/2014/09/building-simple-cross-browser-offline-todo-list-indexeddb-websql/
 */
// export const db:Storage<any> = {
//    save(key:string, value:any) {
//       sessionStorage.setItem(key, JSON.stringify(value));
//    },

//    remove(key:string) {
//       sessionStorage.removeItem(key);
//    },

//    item(key:string):any {
//       const value = sessionStorage.getItem(key);
//       return value !== null ? JSON.parse(value) : null;
//    }
// };
