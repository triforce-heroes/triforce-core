export function unique<T>(...items: T[]): T[] {
  return [...new Set(items)];
}

export function chunk<T extends unknown[]>(array: T, size: number): T[] {
  const chunks: T[] = [];
  let index = 0;

  while (index < array.length) {
    chunks.push(array.slice(index, index + size) as T);
    index += size;
  }

  return chunks;
}
