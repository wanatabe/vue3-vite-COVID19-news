<template>
  <div class="city">
    <div class="localToday">
      <VCard v-for="item in cardList" :key="item.id" :data="item" :option="{ key: 'name', value: 'value' }" :add="item.add" />
    </div>
    <v-trend  :treeData="treeData"></v-trend>
    <div class="briefing">
      <h2>国内31省市区本土疫情速报</h2>
      <table>
        <colgroup>
          <col style="width: 30%" />
          <col style="width: 15%" />
          <col style="width: 15%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
        </colgroup>
        <thead>
          <tr>
            <th :style="{ backgroundColor: '#f5f5f5' }">地区</th>
            <th :style="{ backgroundColor: 'linen', color: '#ff7140' }">本土<br />确诊</th>
            <th :style="{ backgroundColor: '#fef7ff', color: '#ca3f81' }">本土<br />无症状</th>
            <th :style="{ backgroundColor: '#fff7f7', color: '#f23a3b' }">风险地区<br />高|中</th>
            <th :style="{ backgroundColor: '#fffaf7' }">更新<br />时间</th>
          </tr>
        </thead>
        <tbody v-for="item in briefingList" :key="item.id">
          <tr @click="changeBriefing(item)" :class="activeBriefing && activeBriefing.adcode === item.adcode && 'activeBriefing'">
            <th>{{ `${item.province}  ${item.city}` }}</th>
            <th>+{{ item['local_confirm_add'] }}</th>
            <th>+{{ item['local_wzz_add'] }}</th>
            <th>{{ `${item['highRiskAreaNum']} | ${item['mediumRiskAreaNum']}` }}</th>
            <th>{{ item.mtime }}</th>
          </tr>
          <tr>
            <th class="briefingEchart" v-if="activeBriefing && activeBriefing.adcode === item.adcode" colspan="5">
              <h2>{{ `${item.province}${briefingtab.value}` }}</h2>

              <VEchart :option="briefingOption" height="300px" />
              <div class="trendTabs">
                <div
                  :class="['trendTab', briefingtab && briefingtab.key === item.key && 'activeTrendTab']"
                  v-for="item in briefingTabs"
                  :key="item.key"
                  @click="changeBriefingTab(item)"
                  :style="{ width: 100 / briefingTabs.length + '%' }"
                >
                  {{ item.value.substring(0, 2) }}<br />{{ item.value.slice(2) }}
                </div>
              </div>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mapEchart">
      <h2>全国疫情分布（含港澳台）</h2>
      <div class="trendTabs">
        <div :class="['trendTab', mapTab && 'activeTrendTab']" @click="changeMapTab()">新增确诊</div>
        <div :class="['trendTab', !mapTab && 'activeTrendTab']" @click="changeMapTab(false)">现有确诊</div>
      </div>
      <VEchart :option="mapOption" :mapConfig="mapConfig" height="500px" />
    </div>
  </div>
</template>

<script lang="ts">
import { baseType } from '@/appType'
import geoJson from '@/components/echarts/chinaGeoJson'
import { getOptionValue, lineOption } from '@/components/echarts/echartUtil'
import ObjectUtil from '@/utils/object'
import { TreeType } from '@/utils/tree'
import { defineComponent, nextTick, onMounted, toRefs, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { CityState } from './cityType'

export default defineComponent({
  name: 'Abroad',
  setup(props, { emit }) {
    const route = useRoute()
    const state = reactive<CityState>({
      treeData: [],
      cardList: [
        { id: 1, name: '本土确诊', key: ['today', 'local_confirm_add'], add: true },
        { id: 2, name: '本土无症状', key: ['today', 'wzz_add'], add: true },
        { id: 3, name: '境外输入', key: ['today', 'abroad_confirm_add'], add: true },
        { id: 4, name: '死亡病例', key: ['today', 'dead_add'] },
        { id: 7, name: '高风险地区', key: ['total', 'highRiskAreaNum'] },
        { id: 8, name: '中风险地区', key: ['total', 'mediumRiskAreaNum'] },
        { id: 5, name: '现有确诊', key: ['total', 'nowConfirm'] },
        { id: 6, name: '累计确诊', key: ['total', 'confirm'] }
      ],
      trendTabs: [
        { key: 'yes_confirm_add', value: '新增本土确诊', remark: ['confirm_add'] },
        { key: 'yes_wzz_add', value: '新增本土无症状', remark: ['wzz_add'] }
      ],
      activeTrend: { key: 'yes_confirm_add', value: '新增本土确诊', remark: ['confirm_add'] },
      limitTrends: [
        { key: 30, value: '近30天' },
        { key: 60, value: '近60天' },
        { key: 90, value: '近90天' },
        { key: 182, value: '近半年' },
        { key: 365, value: '近一年' }
      ],
      limitTrend: { key: 30, value: '近30天' },
      trendOption: { option: {} },
      briefingList: [],
      activeBriefing: {},
      briefingTabs: [
        { key: 'yes_confirm_add', value: '新增本土确诊', remark: ['confirm_add'] },
        { key: 'yes_wzz_add', value: '新增本土无症状', remark: ['wzz_add'] }
      ],
      briefingtab: { key: 'yes_confirm_add', value: '新增本土确诊', remark: ['confirm_add'] },
      briefingOption: { option: {} },
      mapOption: {
        option: {}
      },
      mapConfig: {
        map: 'china',
        geoJson: geoJson
      },
      mapTab: true,
      dataSource: [],
      order: {
        key: '新增确诊',
        order: 'ascend'
      }
    })

    let trendData: baseType
    let briefingEchartData: Array<baseType>

    onMounted(() => {
      console.log('route :>> ', route.params)
      const { adcode, data } = route.params
      if (adcode && data && typeof data === 'string') {
        state.treeData = JSON.parse(data)
        console.log('treedata :>> ', state.treeData)
      }
      state.treeData && handleTodayData(state.treeData)
      nextTick(() => {
        emit('mounted')
      })
    })

    const handleTodayData = (data: baseType) => {
      const { cardList = [] } = state
      for (let index = 0; index < cardList.length; index++) {
        const item = cardList[index]
        item.value = ObjectUtil.getValue(item.key, data)
      }
      state.cardList = cardList
    }

    const changeBriefing = (data: baseType) => {
      console.log('切换城市速报事件 :>> ', data)
      state.activeBriefing = data
    }
    const changeBriefingTab = (data: baseType) => {
      console.log('切换城市速报 tab :>> ', data)
      const option = lineOption(
        getOptionValue('date', briefingEchartData),
        undefined,
        getOptionValue(data.key, briefingEchartData, data.remark)
      )
      state.briefingtab = data
      state.briefingOption = { option }
    }

    const changeMapTab = (isToday = true) => {
      state.mapTab = isToday
    }

    return {
      ...toRefs(state),
      changeBriefing,
      changeMapTab,
      changeBriefingTab
    }
  }
})
</script>

<style lang="less" scoped>
@import 'src/style/var.less';

.city {
  padding: 0 36px;
  > div {
    margin-top: 10px;
  }
  h2 {
    font-weight: bold !important;
  }
}

.localToday {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 10px;
  column-gap: 10px;
}

.briefing {
  table {
    width: 100%;
    margin-top: 16px;

    thead {
      th {
        height: 86px;
        text-align: center;
        font-size: 24px;
        padding: 0 6px;
      }
    }
    tbody {
      th {
        height: 64px;
        text-align: center;
        font-size: 24px;
        &:first-child {
          text-align: left;
          padding-left: 10px;
        }
        &:last-child {
          font-size: 18px;
        }
      }
    }
    .activeBriefing {
      background-color: #e5f3ff;
    }

    .briefingEchart {
      padding-top: 18px;
      padding-bottom: 18px;
    }
  }
}
.mapEchart {
  .trendTabs {
    justify-content: start;
    margin: 16px 0;
  }
}
</style>
