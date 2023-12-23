export declare class Cache<T> {
    private readonly inItems;
    private readonly inKeys;
    private inCapacity;
    constructor(capacity: number);
    get stored(): number;
    get capacity(): number;
    has(key: string): boolean;
    get(key: string): T | undefined;
    keys(): Set<string>;
    values(): T[];
    entries(): Map<string, T>;
    forget(key: string): void;
    flush(): void;
    remember(key: string, callback: () => T): T;
    set(key: string, value: T): T;
    setCapacity(capacity: number): void;
}
