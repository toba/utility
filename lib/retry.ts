import { is, sayNumber } from './index';

/**
 * Retry a `Promise` function until it resolves or number of retry times is
 * exceeded.
 *
 * @param times Number of times to retry
 * @param delay Milliseconds between retries
 * @param errorPrefix Optional message to display with errors -- useful because
 * retries may be happening for several functions simultaneously making it hard
 * to disambiguate error messages
 */
export const retry = <T>(
   fn: () => Promise<T>,
   times: number,
   delay: number,
   errorPrefix?: string
): Promise<T> =>
   times < 0 || delay < 0
      ? Promise.reject(`Invalid retry times (${times}) or delay (${delay})`)
      : new Promise((resolve, reject) => {
           retryLoop<T>(fn, times, delay, resolve, reject, errorPrefix);
        });

function retryLoop<T>(
   fn: () => Promise<T>,
   times: number,
   delay: number,
   resolve: (res: T) => void,
   reject: (errors: string) => void,
   errorPrefix: string = '',
   count: number = 1,
   errors: string[] = []
): void {
   fn()
      .then(res => resolve(res))
      .catch((err: Error) => {
         const msg: string = is.defined(err, 'stack')
            ? err.stack!
            : err.toString();
         if (!errors.includes(msg)) {
            errors.push(msg);
         }
         if (count < times) {
            setTimeout(() => {
               retryLoop(
                  fn,
                  times,
                  delay,
                  resolve,
                  reject,
                  errorPrefix,
                  count + 1,
                  errors
               );
            }, delay);
         } else {
            const prefix =
               'Failed after ' +
               sayNumber(times, false) +
               ' retries' +
               (is.empty(errorPrefix) ? '' : '. ' + errorPrefix) +
               ':\n';
            reject(prefix + errors.join('\n'));
         }
      });
}
