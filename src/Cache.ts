export class Cache<T> {
  private readonly inItems = new Map<string, T>();

  private readonly inKeys = new Set<string>();

  private inCapacity;

  public constructor(capacity: number) {
    this.inCapacity = capacity;
  }

  public get stored() {
    return this.inKeys.size;
  }

  public get capacity() {
    return this.inCapacity;
  }

  public has(key: string) {
    return this.inKeys.has(key);
  }

  public get(key: string) {
    return this.inItems.get(key);
  }

  public keys() {
    return new Set(this.inKeys);
  }

  public values() {
    return [...this.inItems.values()];
  }

  public entries() {
    return new Map(this.inItems.entries());
  }

  public forget(key: string) {
    if (this.has(key)) {
      this.inItems.delete(key);
      this.inKeys.delete(key);
    }
  }

  public flush() {
    this.inItems.clear();
    this.inKeys.clear();
  }

  public remember(key: string, callback: () => T) {
    if (this.has(key)) {
      return this.get(key)!;
    }

    return this.set(key, callback());
  }

  public set(key: string, value: T): T {
    if (this.inItems.has(key)) {
      this.inItems.set(key, value);

      return value;
    }

    this.inKeys.add(key);
    this.inItems.set(key, value);

    if (this.inKeys.size > this.capacity) {
      const [forgetKey] = this.inKeys;

      this.forget(forgetKey!);
    }

    return value;
  }

  public setCapacity(capacity: number) {
    this.inCapacity = capacity;

    const forgetLength = Math.max(0, this.inKeys.size - this.inCapacity);

    for (let i = 0; i < forgetLength; i++) {
      const [forgetKey] = this.inKeys;

      this.forget(forgetKey!);
    }
  }
}
