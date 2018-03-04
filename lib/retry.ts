/**
 * Retry a function until it resolves or number of retry times is reached.
 */
function retry<T>(
   fn: () => Promise<T>,
   times: number,
   delay: number
): Promise<T> {
   return retryLoop<T>(fn, times, delay);
}

function retryLoop<T>(
   fn: () => Promise<T>,
   times: number,
   delay: number,
   count: number = 1
): Promise<T> {
   return fn().catch(err, 
}
