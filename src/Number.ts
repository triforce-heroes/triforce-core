export function nextMultiple(value: number, width: number, shouldAdvance = false): number {
  const remainder = value % width;

  if (remainder === 0) {
    return shouldAdvance ? value + width : value;
  }

  return value + (width - remainder);
}
