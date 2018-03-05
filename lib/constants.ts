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

enum AccessControlAllow {
   Credentials = 'Access-Control-Allow-Credentials',
   Headers = 'Access-Control-Allow-Headers',
   Methods = 'Access-Control-Allow-Methods',
   Origin = 'Access-Control-Allow-Origin'
}

enum AccessControlRequest {
   Headers = 'Access-Control-Request-Headers',
   Method = 'Access-Control-Request-Method'
}

enum Content {
   Disposition = 'Content-Disposition',
   Encoding = 'Content-Encoding',
   Length = 'Content-Length',
   Type = 'Content-Type'
}

enum Accept {
   Encoding = 'accept-encoding',
   Language = 'accept-language'
}

export const Header = {
   //ACCEPT: 'Accept',
   Accept,
   AccessControl: {
      MaxAge: 'Access-Control-Max-Age',
      allow: AccessControlAllow,
      request: AccessControlRequest
   },
   CacheControl: 'Cache-Control',
   Connection: 'connection',
   Content,
   DoNotTrack: 'dnt',
   eTag: 'Etag',
   Expires: 'expires',
   Host: 'host',
   HttpMethod: 'X-HTTP-Method-Override',
   LastModified: 'Last-Modified',
   Origin: 'origin',
   PRAGMA: 'pragma',
   Referer: 'referer',
   ResponseTime: 'X-Response-Time',
   RequestedWith: 'X-Requested-With',
   UserAgent: 'user-agent'
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
