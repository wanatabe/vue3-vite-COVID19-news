/**
 * 趋势图组件
 */

import { baseType } from '@/appType'
import { connection } from '@/utils/axios'
import { defineComponent, ExtractPropTypes, onMounted, PropType, reactive, watch } from 'vue'
import { VEcharts } from '../echarts/Echarts'
import { getOptionValue, lineOption } from '../echarts/echartUtil'
import { install } from '../install'
import { TrendState } from './trendType'

const trendProps = {
  trendTabs: {
    type: Array as PropType<baseType[]>,
    default: []
  },
  treeData: Object
}

export const trend = defineComponent({
  name: 'trend',
  props: trendProps,
  setup(props, {}) {
    const state = reactive<TrendState>({
      trendTabs: props.trendTabs,
      activeTrend: props.trendTabs[0],
      limitTrends: [
        { key: 30, value: '近30天' },
        { key: 60, value: '近60天' },
        { key: 90, value: '近90天' },
        { key: 182, value: '近半年' },
        { key: 365, value: '近一年' }
      ],
      limitTrend: { key: 30, value: '近30天' },
      trendOption: { option: {} },
      trendData: []
    })

    watch(
      [() => state.limitTrend, () => props.treeData],
      async ([newData, newTree], [oldData, oleTree]) => {
        // 监听趋势查询范围变化
        if (newData !== oldData) {
          newData && (await queryTrend(newData.key))
          changeTrendTab(state.activeTrend)
        }

        if (newTree !== oleTree) {
          state.limitTrend && (await queryTrend(state.limitTrend.key))
          changeTrendTab(state.activeTrend)
        }
      },
      {
        deep: true
      }
    )

    const handleChange = (value: string) => {
      console.log(`selected ${value}`)
      const data = state.limitTrends?.find((item) => item.key === value)
      if (data) {
        state.limitTrend = data
      }
    }

    /**
     * 查询趋势图数据
     * @param limit 限制时间
     */
    const queryTrend = async (limit: string | number) => {
      if (props.treeData?.adcode) {
        const trendRes = await connection('query/pubished/daily/list', 'get', {
          params: {
            adCode: props.treeData.adcode,
            limit
          }
        })
        console.log('queryTrend result :>> ', trendRes)
        state.trendData = trendRes.data
      }
    }

    /**
     * 切换趋势图内容
     */
    const changeTrendTab = (param: baseType): void => {
      if (!state.trendData) return
      let data = state.trendData

      const option = lineOption(getOptionValue('date', data), undefined, getOptionValue(param?.key || 'confirm_add', data, param?.remark))
      state.activeTrend = param
      state.trendOption = { option }
    }

    return () => {
      console.log('props :>> ', props, state)
      return (
        <div class='trend'>
          <div class='trendTitle'>
            <h2>
              {`${props.treeData ? props.treeData.name : ''}${
                state.activeTrend && state.activeTrend.value ? state.activeTrend.value : ''
              }趋势图`}
            </h2>
            <a-select onChange={handleChange} class='antdSelect' defaultValue={state.limitTrend && state.limitTrend.value}>
              {state.limitTrends &&
                state.limitTrends.map((item) => {
                  return (
                    <a-select-option key={item.key} value={item.key}>
                      {item.value}
                    </a-select-option>
                  )
                })}
            </a-select>
          </div>
          <VEcharts option={state.trendOption as any} height='300px' />
          <div class='trendTabs'>
            {state.trendTabs &&
              state.trendTabs.map((item) => {
                return (
                  <div
                    class={['trendTab', state.activeTrend && state.activeTrend.key === item.key && 'activeTrendTab']}
                    key={item.key}
                    onClick={() => changeTrendTab(item)}
                    style={{ width: state.trendTabs && 100 / state.trendTabs.length + '%' }}>
                    {item.value.substring(0, 2)}
                    <br />
                    {item.value.slice(2)}
                  </div>
                )
              })}
          </div>
        </div>
      )
    }
  }
})

const Trend = install(trend)
export type TrendProps = ExtractPropTypes<typeof trendProps>
export default Trend
