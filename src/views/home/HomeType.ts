import { InitConfigType } from 'pkg/echarts/Echarts'
import { baseType } from '@/appType'

export interface HomeState {
  cardList?: ListItem[]
  trendOption?: InitConfigType
  trendTabs?: Array<baseType>
  activeTrend?: baseType
  limitTrend?: baseType
  limitTrends?: Array<baseType>
}
export interface ListItem {
  id: number | string
  name: string
  key: string
  value?: string
  add?: boolean
  reduce?: boolean
}

export enum KeyValue {
  localConfirmAdd = '本土确诊',
  localWzzAdd = '本土无症状',
  confirmAdd = '确诊病例',
  localConfirmH5 = '现有本土确诊',
  noInfectH5 = '现有本土无症状',
  nowConfirm = '现有确诊病例',
  highRiskAreaNum = '高风险地区',
  mediumRiskAreaNum = '中风险地区',
  dead = '累计死亡'
}
