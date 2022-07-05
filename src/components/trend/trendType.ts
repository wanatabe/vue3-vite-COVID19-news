import { baseType } from '@/appType'
import { InitConfigType } from '../echarts/Echarts'

export interface TrendState {
  trendTabs?: baseType[]
  activeTrend?: baseType
  limitTrends?: baseType[]
  limitTrend?: baseType
  trendOption: InitConfigType
  trendData?: any[]
}
