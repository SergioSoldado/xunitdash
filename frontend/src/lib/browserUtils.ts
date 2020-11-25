
export function convertRemToPixels(rem: number): number {
  try {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  } catch (err) {
    return 50
  }
}
