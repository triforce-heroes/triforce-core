export function nextMultiple(value: number, width: number): number {
  if (value % width === 0) {
    return value;
  }

  return value + (width - (value % width));
}
