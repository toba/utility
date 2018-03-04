/**
 * Retry a `Promise` function until it resolves or number of retry times is
 * exceeded.
 *
 * @param times Number of times to retry
 * @param delay Milliseconds between retries
 */
export const retry = <T>(
   fn: () => Promise<T>,
   times: number,
   delay: number
): Promise<T> =>
   times < 0 || delay < 0
      ? Promise.reject(`Invalid retry times (${times}) or delay (${delay})`)
      : new Promise((resolve, reject) => {
           retryLoop<T>(fn, times, delay, resolve, reject);
        });

function retryLoop<T>(
   fn: () => Promise<T>,
   times: number,
   delay: number,
   resolve: (res: T) => void,
   reject: (errors: string[]) => void,
   count: number = 1,
   errors: string[] = []
): void {
   fn()
      .then(res => resolve(res))
      .catch(err => {
         errors.push(err.toString());

         if (count < times) {
            setTimeout(() => {
               retryLoop(fn, times, delay, resolve, reject, count + 1, errors);
            }, delay);
         } else {
            reject(errors);
         }
      });
}
