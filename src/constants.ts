// prettier-ignore
export const alphabet = [
   'a','b','c','d','e','f','g','h','i','j','k','l','m',
   'n','o','p','q','r','s','t','u','v','w','x','y','z'
]

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
]

/**
 * EcmaScript months are zero-based.
 */
export const enum Month {
   January,
   February,
   March,
   April,
   May,
   June,
   July,
   August,
   September,
   October,
   November,
   December
}

export const weekday = [
   'Sunday',
   'Monday',
   'Tuesday',
   'Wednesday',
   'Thursday',
   'Friday',
   'Saturday'
]

/**
 * EcmaScript days of the week are zero-based.
 */
export const enum Weekday {
   Sunday,
   Monday,
   Tuesday,
   Wednesday,
   Thursday,
   Friday,
   Saturday
}

export const enum Sort {
   Unknown,
   NewestFirst,
   OldestFirst,
   Alphabetical,
   ReverseAlphabetical
}

export enum AccessControlAllow {
   Credentials = 'Access-Control-Allow-Credentials',
   Headers = 'Access-Control-Allow-Headers',
   Methods = 'Access-Control-Allow-Methods',
   Origin = 'Access-Control-Allow-Origin'
}

export enum AccessControlRequest {
   Headers = 'Access-Control-Request-Headers',
   Method = 'Access-Control-Request-Method'
}

export enum Content {
   Disposition = 'Content-Disposition',
   Encoding = 'Content-Encoding',
   Length = 'Content-Length',
   Type = 'Content-Type'
}

export enum Accept {
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
   /**
    * Protocol before interception by a device such as a load balancer,
    * abbreviated `XFP`.
    * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto
    */
   ForwardedProtocol: 'X-Forwarded-Proto',
   LastModified: 'Last-Modified',
   Origin: 'origin',
   PRAGMA: 'pragma',
   Referer: 'referer',
   ResponseTime: 'X-Response-Time',
   RequestedWith: 'X-Requested-With',
   UserAgent: 'user-agent',
   /**
    * Determines how to match future request headers to decide whether a cached
    * response can be used rather than requesting a fresh one from the origin
    * server. Accepts a comma-separated list of header names to take into
    * account when deciding whether or not a cached response can be used.
    * @example Vary: <header-name>, <header-name>, ...
    * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary
    */
   Vary: 'Vary'
}

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

/**
 * @see https://tools.ietf.org/html/rfc7231#section-3.1.1.2
 */
export enum CharSet {
   ASCII = 'US-ASCII',
   UTF8 = 'utf-8',
   ISO8859_1 = 'iso-8859-1'
}

/**
 * @see http://www.sitepoint.com/web-foundations/mime-types-complete-list/
 */
export const enum MimeType {
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

/**
 * EcmaScript type names.
 */
export const enum ValueType {
   Boolean = 'boolean',
   Function = 'function',
   Number = 'number',
   Object = 'object',
   String = 'string',
   Symbol = 'symbol',
   Undefined = 'undefined'
}

/**
 * Space-separated list of `rel` values. The attribute specifies the
 * relationship between the current document and the linked document. Only used
 * if the href attribute is present.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types
 * @see https://www.w3schools.com/tags/att_a_rel.asp
 */
export const enum LinkRelation {
   /**
    * If the element is `<link>` and the rel attribute also contains the
    * stylesheet type, the link defines an alternative style sheet; in that case
    * the title attribute must be present and not be the empty string.
    *
    * If the type is set to `application/rss+xml` or `application/atom+xml`, the
    * link defines a syndication feed. The first one defined on the page is the
    * default.
    *
    * Otherwise, the link defines an alternative page, of one of these types:
    * - for another medium, like a handheld device (if the media attribute is set)
    * - in another language (if the hreflang attribute is set),
    * - in another format, such as a PDF (if the type attribute is set)
    * - a combination of these
    */
   Alternate = 'alternate',

   /**
    * This may be a `mailto:` hyperlink, but this is not recommended on public
    * pages as robot harvesters will quickly lead to a lot of spam sent to the
    * address. In that case, it is better to lead to a page containing a contact
    * form.
    *
    * Although recognized, the rev attribute on `<a>`, `<area>` or `<link>`
    * elements with a link type of made is incorrect and should be replaced by
    * the rel attribute with this link type.
    */
   Author = 'author',

   /**
    * Indicates that the hyperlink is a permalink for the nearest ancestor
    * `<article>` element. If none, it is a permalink for the section that the
    * element is most closely associated to.
    *
    * This allows for bookmarking a single article in a page containing multiple
    * articles, such as on a monthly summary blog page, or a blog aggregator.
    */
   Bookmark = 'bookmark',

   /**
    * A canonical link element is an HTML element that helps webmasters prevent
    * duplicate content issues by specifying the "canonical" or "preferred"
    * version of a web page as part of search engine optimization.
    */
   Canonical = 'canonical',

   /**
    * Hints to the browser that a resources is needed allowing the browser to do
    * a DNS lookup and protocol handshaking before a user clicks the link.
    */
   DnsPrefetxh = 'dns-prefetch',

   /**
    * By adding `rel="enclosure"` to a hyperlink, a page indicates that the
    * destination of that hyperlink is intended to be downloaded and cached.
    *
    * @example <a href="http://homepage.mac.com/kevinmarks/wwdc2005.mov" rel="enclosure">WWDC 2005 Keynote with chapters</a>
    * @see http://microformats.org/wiki/rel-enclosure
    */
   Enclosure = 'enclosure',

   /**
    * Indicates that the hyperlink leads to a resource outside the site of the
    * current page; that is, following the link will make the user leave the
    * site.
    */
   External = 'external',

   /**
    * If the element is `<a>` or `<area>`, it indicates that the hyperlink leads
    * to a resource giving further help about the parent of the element, and its
    * descendants.
    *
    * If the element is `<link>` it indicates that the hyperlink leads to a
    * resource giving further help about the page as a whole.
    */
   Help = 'help',

   /**
    * Defines a resource for representing the page in the user interface,
    * usually an icon (auditory or visual).
    *
    * The `media`, `type` and `sizes` attributes allow the browser to select the
    * most appropriate icon for its context. If several resources match, the
    * browser will select the last one declared, in tree order. As these
    * attributes are merely hints, and the resources may be inappropriate upon
    * further inspection, the browser will then select another one, if
    * appropriate.
    *
    * Note: Apple's iOS does not use this link type, nor the sizes attribute,
    * like others mobile browsers do, to select a webpage icon for Web Clip or a
    * start-up placeholder. Instead it uses the non-standard apple-touch-icon
    * and apple-touch-startup-image respectively.
    *
    * The shortcut link type is often seen before icon, but this link type is
    * non-conforming, ignored and *web authors must not use it anymore*.
    */
   Icon = 'icon',

   /**
    * Indicates that the hyperlink leads to a document describing the licensing
    * information. If not inside the `<head>` element, the standard doesn't
    * distinguish between a hyperlink applying to a specific part of the
    * document or to the document as a whole. Only the data on the page can
    * indicate this.
    *
    * _Note_: Although recognized, the synonym copyright is incorrect and must
    * be avoided.
    */
   License = 'license',

   /**
    * Indicates that the hyperlink leads to the next resource of the sequence
    * the current page is in.
    *
    * _Note_: Other link types related to linking resources in the same sequence
    * are `first`, `prev`, `last`.
    */
   Next = 'next',

   /**
    * Indicates that the linked document is not endorsed by the author of this
    * one, for example if it has no control over it, if it is a bad example or
    * if there is commercial relationship between the two (sold link). This link
    * type may be used by some search engines that use popularity ranking
    * techniques.
    */
   NoFollow = 'nofollow',

   /**
    * Instructs the browser to open the link without granting the new browsing
    * context access to the document that opened it — by not setting the
    * `Window.opener` property on the opened window (it returns `null`).
    *
    * This is especially useful when opening untrusted links, in order to ensure
    * they cannot tamper with the originating document via the `Window.opener`
    * property (see About rel=noopener for more details), while still providing
    * the `Referer` HTTP header (unless `noreferrer` is used as well).
    *
    * Note that when `noopener `is used, nonempty target names other than `_top`,
    * `_self`, and `_parent` are all treated like `_blank` in terms of deciding
    * whether to open a new window/tab.
    */
   NoOpener = 'noopener',

   /**
    * Prevents the browser, when navigating to another page, to send this page
    * address, or any other value, as referrer via the `Referer`: HTTP header.
    */
   NoReferrer = 'noreferrer',

   /**
    * Defines an external resource URI to call if one wishes to make a comment
    * or a citation about the webpage. The protocol used to make such a call is
    * defined in the Pingback 1.0 specification.
    *
    * _Note_: if the `X-Pingback`: HTTP header is also present, it supersedes
    * the `<link>` element with this link type.
    */
   PingBack = 'pingback',

   /**
    * Provides a hint to the browser suggesting that it open a connection to the
    * linked web site in advance, without disclosing any private information or
    * downloading any content, so that when the link is followed the linked
    * content can be fetched more quickly.
    */
   Preconnect = 'preconnect',

   /**
    * Suggests that the browser fetch the linked resource in advance, as it is
    * likely to be requested by the user. Starting with Firefox 44, the value of
    * the `crossorigin` attribute is taken into consideration, making it
    * possible to make anonymous prefetches.
    */
   Prefetch = 'prefetch',

   /**
    * Tells the browser to download a resource because this resource will be
    * needed later during the current navigation.
    */
   Preload = 'preload',

   /**
    * Indicates that the hyperlink leads to the preceding resource of the
    * sequence the current page is in.
    *
    * _Note_: You can also use the next keyword to specify a link to the next
    * page in the sequence.
    *
    * Although recognized, the synonym `previous` is incorrect and must be
    * avoided.
    */
   Previous = 'prev',

   /**
    * Indicates that the hyperlink references a document whose interface is
    * specially designed for searching in this document, or site, and its
    * resources.
    */
   Search = 'search',

   Self = 'self',

   /**
    * Defines an external resource to be used as a stylesheet. If the type is
    * not set, the browser should assume it is a `text/css` stylesheet until
    * further inspection.
    *
    * If used in combination with the `alternate` keyword, it defines an
    * alternative style sheet; in that case the `title` attribute must be
    * present and not be the empty string.
    */
   Stylesheet = 'stylesheet',

   /**
    * A tag (keyword) for the current document.
    */
   Tag = 'tag'
}

export const enum Encoding {
   Buffer = 'buffer',
   GZip = 'gzip',
   Hexadecimal = 'hex',
   UTF8 = 'utf8',
   Base64 = 'base64'
}
