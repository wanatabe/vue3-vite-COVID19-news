<template>
  <div class="home">
    <div class="localToday">
      <VCard v-for="item in cardList" :key="item.id" :data="item" :option="{ key: 'name', value: 'value' }" :add="item.add" />
    </div>
    <div class="trend">
      <div class="trendTitle">
        <span class="title">{{ `全国${activeTrend && activeTrend.value}趋势图` }}</span>
        <a-select @change="handleChange" class="antdSelect" :default-value="limitTrend && limitTrend.value">
          <a-select-option v-for="item in limitTrends" :key="item.key" :value="item.key">
            {{ item.value }}
          </a-select-option>
        </a-select>
      </div>
      <VEchart :option="trendOption" height="300px" />
      <div class="trendTabs">
        <div
          :class="['trendTab', activeTrend && activeTrend.key === item.key && 'activeTrendTab']"
          v-for="item in trendTabs"
          :key="item.key"
          @click="changeTrendTab(item)"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getOptionValue, lineOption } from 'pkg/echarts/echartUtil'
import { baseType } from '@/appType'
import { connection } from 'tool/axios'
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue'
import { HomeState } from './HomeType'

export default defineComponent({
  name: 'Home',
  setup() {
    const state = reactive<HomeState>({
      cardList: [
        { id: 1, name: '本土确诊', key: 'localConfirmAdd', add: true },
        { id: 2, name: '本土无症状', key: 'localWzzAdd', add: true },
        { id: 3, name: '确诊病例', key: 'confirmAdd' },
        { id: 4, name: '现有本土确诊', key: 'localConfirmH5' },
        { id: 5, name: '现有本土无症状', key: 'noInfectH5' },
        { id: 6, name: '现有确诊病例', key: 'nowConfirm' },
        { id: 7, name: '高风险地区', key: 'highRiskAreaNum' },
        { id: 8, name: '中风险地区', key: 'mediumRiskAreaNum' },
        { id: 9, name: '累计死亡', key: 'dead' }
      ],
      trendTabs: [
        { key: 'localConfirmadd', value: '新增本土确诊' },
        { key: 'localinfectionadd', value: '新增本土无症状' },
        { key: 'localConfirmH5', value: '现有本土确诊' },
        { key: 'noInfectH5', value: '现有本土无症状' }
      ],
      activeTrend: { key: 'localConfirmadd', value: '新增本土确诊' },
      limitTrends: [
        { key: 30, value: '近30天' },
        { key: 60, value: '近60天' },
        { key: 90, value: '近90天' },
        { key: 182, value: '近半年' },
        { key: 365, value: '近一年' }
      ],
      limitTrend: { key: 30, value: '近30天' },
      trendOption: { option: {} }
    })
    let trendData: baseType

    onMounted(async () => {
      // 初始化数据请求
      const [localData] = await Promise.all([
        connection('query/inner/publish/modules/list', 'get', {
          params: {
            modules: 'localCityNCOVDataList,diseaseh5Shelf'
          }
        }),
        state.limitTrend && queryTrend(state.limitTrend.key)
      ])
      // 初始化渲染 今日疫情card
      handalTodayData(localData.data.diseaseh5Shelf.chinaTotal)
      // 初始化渲染 趋势图
      state.activeTrend && changeTrendTab(state.activeTrend)
    })

    watch(
      [() => state.limitTrend, () => state.cardList],
      async ([newData, newCard], [oldData, oldCard]) => {
        if (newData !== oldData) {
          newData && (await queryTrend(newData.key))
          state.activeTrend && changeTrendTab(state.activeTrend)
        }
        console.log('newData :>> ', newData, oldData)
        console.log('newData :>> ', newCard, oldCard)
      },
      {
        deep: true
      }
    )

    /**
     * 今日疫情数据总览
     * @param data
     */
    const handalTodayData = (data: baseType) => {
      const { cardList = [] } = state
      for (let index = 0; index < cardList.length; index++) {
        const item = cardList[index]
        item.value = data[item.key]
      }
      state.cardList = cardList
    }

    const handleChange = (value: string) => {
      console.log(`selected ${value}`)
      const data = state.limitTrends?.find((item) => item.key === value)
      state.limitTrend = data
    }

    /**
     * 查询趋势图数据
     * @param limit 限制时间
     */
    const queryTrend = async (limit: string | number) => {
      const trendRes = await connection('query/inner/publish/modules/list', 'get', {
        params: {
          modules: 'chinaDayListNew,chinaDayAddListNew',
          limit
        }
      })
      trendData = trendRes.data
    }

    /**
     * 切换趋势图内容
     */
    const changeTrendTab = (param: baseType) => {
      let data
      if (param.key === 'localConfirmH5' || param.key === 'noInfectH5') {
        //现有
        data = trendData.chinaDayListNew
      } else {
        //新增
        data = trendData.chinaDayAddListNew
      }

      const option = lineOption(getOptionValue('date', data), undefined, getOptionValue(param.key, data))
      state.activeTrend = param
      state.trendOption = { option }
    }

    return {
      ...toRefs(state),
      changeTrendTab,
      handleChange
    }
  }
})
</script>

<style lang="less" scoped>
@import 'src/style/var.less';

.localToday {
  padding: 10px 48px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 10px;
  column-gap: 10px;
}
.trend {
  padding: 10px 48px;
  .trendTitle {
    display: flex;
    justify-content: space-between;

    .title {
      font-weight: bold;
      font-size: 18px;
    }
    .antdSelect {
      width: 118px;
      height: 30px;
      :deep(.ant-select-selector) {
        padding: 0;
        text-align: left;

        .ant-select-selection-item {
          padding-left: 10px;
        }
      }
    }
  }
  .trendTabs {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .trendTab {
      padding: 8px 16px;
      font-weight: bold;
      font-size: 18px;
      border-radius: 4px;
      background-color: rgba(153, 153, 153, 0.1);
    }
    .activeTrendTab {
      border: 1px solid @defaultBlue;
      color: @defaultBlue;
      background-color: lighten(@defaultBlue, 45%);
    }
  }
}
</style>
