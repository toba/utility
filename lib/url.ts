import { is } from "../index";

export namespace url {
   export function variables(path: string): { [key: string]: string } {
      if (is.empty(path) || !path.includes("?")) {
         return null;
      }
      const pairs = path.split(/[\?&]/g);

      console.log(pairs);

      if (pairs.length == 0) {
         return null;
      }

      return pairs.reduce(
         (vars, p) => {
            const pair = p.split("=");
            vars[pair[0]] = pair[1];
            return vars;
         },
         {} as { [key: string]: string }
      );
   }
}
