export function nextMultiple(
  value: number,
  width: number,
  nextIfMatches = false,
): number {
  const remainder = value % width;

  if (remainder === 0) {
    return nextIfMatches ? value + width : value;
  }

  return value + (width - remainder);
}
