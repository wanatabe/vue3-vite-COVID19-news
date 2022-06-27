import { NavItem } from 'pkg/navBar/navBarTypes'

export interface AppState {
  list?: NavItem[]
}

export interface baseType {
  [key: string]: any
}
