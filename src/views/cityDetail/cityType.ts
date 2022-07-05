import { baseType } from '@/appType'
import { TreeType } from '@/utils/tree'
import { HomeState } from '../home/HomeType'

export interface CityState extends HomeState {
  treeData?: Array<TreeType>
}
