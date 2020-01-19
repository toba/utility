/**
 * Use getters to return new instances of global flagged patterns so lastIndex
 * isn't an issue
 */
export const re = {
   /**
    * http://www.regular-expressions.info/regexbuddy/email.html
    */
   email: /\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/gi,
   ipAddress: /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/,
   url: /(http:\/\/[^\s\r\n]+)/g,

   /** Root domain name */
   domain: /[a-z0-9][a-z0-9\-]*[a-z0-9]\.[a-z\.]{2,6}$/i,

   /** Digits and separators parselable as a number */
   numeric: /^\-?\d+(\.\d+)?$/,

   queryString: /\?.+$/,
   fileExt: /\.\w{2,4}$/,

   get newLine() {
      return /(\r\n|\n|\r)/gm
   },
   get trailingWhiteSpace() {
      return /[\r\n\s]*$/g
   },
   get lineBreak() {
      return /\r*\n/gi
   }
}
