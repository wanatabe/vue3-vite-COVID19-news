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
import Select, { SelectValue } from 'ant-design-vue/lib/select'
import { Publish } from '@/utils/communication'

const trendProps = {
  trendTabs: {
    type: Array as PropType<baseType[]>,
    default: []
  },
  limitTrends: Array as PropType<baseType[]>,
  treeData: Object
}

export const trend = defineComponent({
  name: 'trend',
  props: trendProps,
  setup(props, {}) {
    const state = reactive<TrendState>({
      trendTabs: props.trendTabs,
      activeTrend: props.trendTabs[0],
      limitTrends: props.limitTrends,
      limitTrend: props.limitTrends && props.limitTrends[0],
      trendOption: { option: {} },
      trendData: []
    })

    onMounted(async () => {
      await queryTrend(state.limitTrend?.key)
      changeTrendTab(state.activeTrend)
      Publish.subscribe('newpath', (data: any) => {
        console.log('趋势图数据订阅:>> ', data)
      })
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
          await queryTrend(state.limitTrend?.key)
          changeTrendTab(state.activeTrend)
        }
      },
      {
        deep: true
      }
    )

    const handleChange = (value: SelectValue) => {
      const data = state.limitTrends?.find((item) => item.key === value)
      if (data) {
        state.limitTrend = data
      }
    }

    /**
     * 查询趋势图数据
     * @param limit 限制时间
     */
    const queryTrend = async (limit: string | number = 30) => {
      if (props.treeData?.adcode) {
        const trendRes = await connection('query/pubished/daily/list', 'get', {
          params: {
            adCode: props.treeData.adcode,
            limit
          }
        })
        // console.log('queryTrend result :>> ', trendRes)
        state.trendData = trendRes.data
      }
    }

    /**
     * 切换趋势图内容
     */
    const changeTrendTab = (param?: baseType): void => {
      if (!state.trendData) return
      let data = state.trendData

      const option = lineOption(getOptionValue('date', data), undefined, getOptionValue(param?.key || 'confirm_add', data, param?.remark))
      state.activeTrend = param
      state.trendOption = { option }
    }

    return () => {
      return (
        <div class='trend'>
          <div class='trendTitle'>
            <h2>
              {`${props.treeData ? props.treeData.name : ''}${
                state.activeTrend && state.activeTrend.value ? state.activeTrend.value : ''
              }趋势图`}
            </h2>
            {props.limitTrends ? (
              <Select onChange={(v) => handleChange(v)} class='antdSelect' defaultValue={state.limitTrend && state.limitTrend.value}>
                {props.limitTrends &&
                  props.limitTrends.map((item) => {
                    return (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    )
                  })}
              </Select>
            ) : null}
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
