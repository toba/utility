export declare namespace is {
    const type: {
        BOOLEAN: string;
        FUNCTION: string;
        NUMBER: string;
        OBJECT: string;
        STRING: string;
        SYMBOL: string;
        UNDEFINED: string;
    };
    function value<T>(x: any): x is T;
    const defined: (obj: any, field: string | number) => boolean;
    const empty: (x: any) => boolean;
    function number(n: any): n is number;
    function numeric(n: any): n is string | number;
    function integer(n: any): n is string | number;
    const bigInt: (n: any) => boolean;
    function array(x: any): x is any[];
}
export declare enum Time {
    Second = 1000,
    Minute = 60000,
    Hour = 3600000,
    Day = 86400000,
    Week = 604800000,
    Year = 31536000000,
}
export declare function merge<T extends object>(base: T, ...additions: any[]): T;
export declare function format(text: string, ...insertions: any[]): string;
export declare function removeItem<T>(list: T[], item: T): void;
export declare function eventCoord(e: MouseEvent | TouchEvent): {
    x: number;
    y: number;
};
export declare function list(...items: (number | string)[]): string;
export declare function randomID(size?: number): string;
