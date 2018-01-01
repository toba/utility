export interface Storage<T> {
    save(key: string, value: T, days?: number, includeSubdomain?: boolean): void;
    remove(key: string): void;
    item(key: string): T;
}
export declare const session: Storage<any>;
export declare const cookie: Storage<string>;
