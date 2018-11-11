import { is } from './index';

export namespace url {
   /**
    * Querystring key-value pairs.
    */
   export function variables(path: string): Map<string, string> | null {
      if (is.empty(path) || !path.includes('?')) {
         return null;
      }
      const pairs = path.split(/[\?&]/g);

      if (pairs.length == 0) {
         return null;
      }

      return pairs.reduce((vars, p) => {
         const pair = p.split('=');
         vars.set(pair[0], pair[1]);
         return vars;
      }, new Map<string, string>());
   }
}
