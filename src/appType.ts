import { NavItem } from 'pkg/navBar/navBarTypes'

export interface AppState {
  list?: NavItem[]
  locale?: any
  showBar?: boolean
}

export interface baseType {
  [key: string]: any
}
