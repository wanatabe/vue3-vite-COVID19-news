export namespace LoginType {
  export interface LoginState {
    isLogin?: boolean
    request?: {
      name?: string
      psw?: string
    }
  }
}
