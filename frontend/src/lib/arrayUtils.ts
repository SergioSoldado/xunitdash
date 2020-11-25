
export function isSame(a: Array<any>, b: Array<any>): boolean {
  if (a.length != b.length) {
    return false
  } else {
    for (let i = 0; i < a.length; ++i) {
      if (a[i] != b[i]) {
        return false
      }
    }
  }
  return true
}