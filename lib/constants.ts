export const alphabet = [
   'a',
   'b',
   'c',
   'd',
   'e',
   'f',
   'g',
   'h',
   'i',
   'j',
   'k',
   'l',
   'm',
   'n',
   'o',
   'p',
   'q',
   'r',
   's',
   't',
   'u',
   'v',
   'w',
   'x',
   'y',
   'z'
];

export const month = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December'
];

export const weekday = [
   'Sunday',
   'Monday',
   'Tuesday',
   'Wednesday',
   'Thursday',
   'Friday',
   'Saturday'
];

export const header = {
   ACCEPT: 'Accept',
   accept: {
      ENCODING: 'accept-encoding',
      LANGUAGE: 'accept-language'
   },
   accessControl: {
      MAX_AGE: 'Access-Control-Max-Age',
      allow: {
         CREDENTIALS: 'Access-Control-Allow-Credentials',
         HEADERS: 'Access-Control-Allow-Headers',
         METHODS: 'Access-Control-Allow-Methods',
         ORIGIN: 'Access-Control-Allow-Origin'
      },
      request: {
         HEADERS: 'Access-Control-Request-Headers',
         METHOD: 'Access-Control-Request-Method'
      }
   },
   CACHE_CONTROL: 'Cache-Control',
   CONNECTION: 'connection',
   content: {
      DISPOSITION: 'Content-Disposition',
      ENCODING: 'Content-Encoding',
      LENGTH: 'Content-Length',
      TYPE: 'Content-Type'
   },
   DO_NOT_TRACK: 'dnt',
   E_TAG: 'Etag',
   EXPIRES: 'expires',
   HOST: 'host',
   HTTP_METHOD: 'X-HTTP-Method-Override',
   LAST_MODIFIED: 'Last-Modified',
   ORIGIN: 'origin',
   PRAGMA: 'pragma',
   REFERER: 'referer',
   RESPONSE_TIME: 'X-Response-Time',
   REQUESTED_WITH: 'X-Requested-With',
   USER_AGENT: 'user-agent'
};

export enum httpStatus {
   OK = 200,
   TEMP_REDIRECT = 301,
   PERMANENT_REDIRECT = 302,
   UNAUTHORIZED = 401,
   FORBIDDEN = 403,
   NOT_FOUND = 404,
   INTERNAL_ERROR = 500,
   UNSUPPORTED = 501,
   BAD_GATEWAY = 502,
   UNAVAILABLE = 503
}

// http://www.sitepoint.com/web-foundations/mime-types-complete-list/
export const mimeType = {
   HTML: 'text/html',
   JSON: 'application/json',
   XML: 'text/xml',
   GPX: 'application/gpx+xml',
   JSONP: 'application/javascript',
   JPEG: 'image/jpeg',
   PNG: 'image/png',
   TEXT: 'text/plain',
   ZIP: 'application/zip'
};

export const encoding = {
   BUFFER: 'buffer',
   GZIP: 'gzip',
   HEXADECIMAL: 'hex',
   UTF8: 'utf8'
};
