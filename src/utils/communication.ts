export class Publish {
  #state: any = {}
  static instance: Publish

  /**
   *
   * @param code
   * @param data
   *
   */
  #setState = (code: string, data: any) => {
    this.#state[code] = data
  }

  #getState = (code: string) => {
    return this.#state[code]
  }

  static init = () => {
    if (this.instance) {
      return this.instance
    } else {
      return (this.instance = new Publish())
    }
  }

  static publish(code: string, data: any) {
    if (!this.instance) {
      this.init()
    }
    let sub = this.instance.#getState(code)
    if (!sub) {
      sub = []
    }
    sub.value = data
    sub.forEach((fn: any) => {
      fn(sub.value)
    })
  }

  static subscribe(code: string, fn: (data: any) => any) {
    if (!this.instance) {
      this.init()
    }
    let sub = this.instance.#getState(code)
    if (!sub) {
      this.instance.#setState(code, [])
      sub = this.instance.#getState(code)
    }
    sub.push(fn)
  }
}
