import { baseType } from '@/appType'
import ObjectUtil from '@/utils/object'
import { TreeType } from '@/utils/tree'
import { defineComponent, ExtractPropTypes, PropType, watch, onMounted, reactive } from 'vue'
import { install } from '../install'
import { BriefingState } from './briefingType'
// import { trend } from 'pkg/trend/trend'

const briefingProps = {
  briefingList: {
    type: Array as PropType<TreeType[]>,
    default: []
  }
}

export const briefing = defineComponent({
  name: 'briefing',
  props: briefingProps,
  setup(props, {}) {
    const state = reactive<BriefingState>({
      activeBriefing: props.briefingList && props.briefingList[0]
    })

    onMounted(() => {
      state.activeBriefing = props.briefingList[0]
    })

    watch(
      () => props.briefingList,
      (newdata, oldData) => {
        if (newdata !== oldData) {
          state.activeBriefing = newdata[0]
        }
      }
    )

    const changeBriefing = (data: baseType) => {
      state.activeBriefing = ObjectUtil.cloneDeep(data)
    }

    return () => {
      return (
        <div class='briefing'>
          <h2>本土疫情速报</h2>
          <table>
            <colgroup>
              <col style='width: 30%' />
              <col style='width: 15%' />
              <col style='width: 15%' />
              <col style='width: 20%' />
              <col style='width: 20%' />
            </colgroup>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#f5f5f5' }}>地区</th>
                <th style={{ backgroundColor: 'linen', color: '#ff7140' }}>
                  本土 <br /> 确诊
                </th>
                <th style={{ backgroundColor: '#fef7ff', color: '#ca3f81' }}>
                  本土 <br /> 无症状
                </th>
                <th style={{ backgroundColor: '#fff7f7', color: '#f23a3b' }}>
                  风险地区 <br /> 高|中
                </th>
                <th style={{ backgroundColor: '#fffaf7' }}>
                  更新 <br /> 时间
                </th>
              </tr>
            </thead>

            {props.briefingList &&
              props.briefingList.map((item) => {
                if (item.name.includes('境外输入')) return null
                return (
                  <tbody key={item.id}>
                    <tr
                      onClick={() => changeBriefing(item)}
                      class={state.activeBriefing && state.activeBriefing.adcode === item.adcode && 'activeBriefing'}>
                      <th>{item.name}</th>
                      <th>+{ObjectUtil.getValue(['today', 'local_confirm_add'], item)}</th>
                      <th>+{ObjectUtil.getValue(['today', 'wzz_add'], item)}</th>
                      <th>
                        {`${ObjectUtil.getValue(['total', 'highRiskAreaNum'], item)} | ${ObjectUtil.getValue(
                          ['total', 'mediumRiskAreaNum'],
                          item
                        )}`}
                      </th>
                      <th>{item.date}</th>
                    </tr>
                    <tr>
                      {state.activeBriefing && state.activeBriefing.adcode === item.adcode ? (
                        <th class='briefingEchart' colspan='5'>
                          <v-trend treeData={state.activeBriefing} />
                        </th>
                      ) : null}
                    </tr>
                  </tbody>
                )
              })}
          </table>
        </div>
      )
    }
  }
})

export type BriefingProps = ExtractPropTypes<typeof briefingProps>
const Briefing = install(briefing)
export default Briefing
