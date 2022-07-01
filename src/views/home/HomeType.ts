import { InitConfigType } from 'pkg/echarts/Echarts'
import { baseType } from '@/appType'

export interface HomeState {
  // 顶部card数据
  cardList?: ListItem[]
  // 趋势图echarts option
  trendOption?: InitConfigType
  // 趋势图tabs
  trendTabs?: Array<baseType>
  // 激活的趋势图
  activeTrend?: baseType
  // 选择的趋势图查询范围
  limitTrend?: baseType
  // 趋势图选择范围
  limitTrends?: Array<baseType>
  // 城市速报数据
  briefingList?: Array<baseType>
  // 激活的城市速报
  activeBriefing?: baseType
  // 城市速报 echarts tabs
  briefingTabs: Array<baseType>
  // 城市速报 激活的tab
  briefingtab: baseType
  briefingOption: InitConfigType
  // briefingEchartData?: Array<baseType>
  mapOption?: any
  mapConfig?: any
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
