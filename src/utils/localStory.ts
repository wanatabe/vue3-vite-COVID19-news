export function setLocal<T>(name: string, val: T): void {
  const time = new Date().valueOf()
  const value = {
    oldExpires: time,
    value: val
  }
  localStorage.setItem(name, JSON.stringify(value))
}

export function getLocal(name: string) {
  const time = new Date().valueOf()
  const expires = 7 * 24 * 3600 * 1000
  const val = localStorage.getItem(name)
  if (!val) return

  const { value, oldExpires } = JSON.parse(val)
  if (time - oldExpires > expires) {
    localStorage.removeItem(name)
    return
  }
  return value
}
