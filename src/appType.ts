import { NavItem } from 'pkg/navBar/navBarTypes'

export interface AppState {
  list?: NavItem[]
  locale?: any
}

export interface baseType {
  [key: string]: any
}
