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
   /**
    * Identifies the originating IP address of a client connecting to a web
    * server through an HTTP proxy or load balancer
    */
   ForwardedFor: 'x-forwarded-for',
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

export enum HttpStatus {
   OK = 200,
   TempRedirect = 301,
   PermanentRedirect = 302,
   Unauthorized = 401,
   Forbidden = 403,
   NotFound = 404,
   InternalError = 500,
   Unsupported = 501,
   BadGateway = 502,
   Unavailabile = 503
}

// http://www.sitepoint.com/web-foundations/mime-types-complete-list/
export enum MimeType {
   HTML = 'text/html',
   JSON = 'application/json',
   XML = 'text/xml',
   CSS = 'text/css',
   GIF = 'image/gif',
   GPX = 'application/gpx+xml',
   JSONP = 'application/javascript',
   JPEG = 'image/jpeg',
   PNG = 'image/png',
   PDF = 'application/pdf',
   SVG = 'image/svg+xml',
   Text = 'text/plain',
   Zip = 'application/zip',
   Binary = 'application/octet-stream',
   RSS = 'application/rss+xml',
   Atom = 'application/atom+xml'
}

export enum Encoding {
   Buffer = 'buffer',
   GZip = 'gzip',
   Hexadecimal = 'hex',
   UTF8 = 'utf8'
}
