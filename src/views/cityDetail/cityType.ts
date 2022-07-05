import { baseType } from '@/appType'
import { TreeType } from '@/utils/tree'

export interface CityState {
  treeData?: TreeType
  cardList?: baseType[]
  trendTabs?: baseType[]
  limitTrends?: baseType[]
  briefingList?: baseType[]
}
