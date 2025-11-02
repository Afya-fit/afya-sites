export function isSmallArt(width?: number, height?: number): boolean {
  if (!width || !height) return true;
  const area = width * height;
  return area <= 200000; // heuristic ~ <= 447x447
}


