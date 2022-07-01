<template>
  <div class="home">
    <div class="localToday">
      <VCard v-for="item in cardList" :key="item.id" :data="item" :option="{ key: 'name', value: 'value' }" :add="item.add" />
    </div>
    <div class="trend">
      <div class="trendTitle">
        <h2>{{ `全国${activeTrend && activeTrend.value}趋势图` }}</h2>
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
          :style="{ width: trendTabs && 100 / trendTabs.length + '%' }"
        >
          {{ item.value.substring(0, 2) }}<br />{{ item.value.slice(2) }}
        </div>
      </div>
    </div>
    <div class="briefing">
      <h2>国内31省市区本土疫情速报</h2>
      <table>
        <thead>
          <tr>
            <th width="30%" :style="{ backgroundColor: '#f5f5f5' }">地区</th>
            <th width="15%" :style="{ backgroundColor: 'linen', color: '#ff7140' }">本土<br />确诊</th>
            <th width="15%" :style="{ backgroundColor: '#fef7ff', color: '#ca3f81' }">本土<br />无症状</th>
            <th width="20%" :style="{ backgroundColor: '#fff7f7', color: '#f23a3b' }">风险地区<br />高|中</th>
            <th width="20%" :style="{ backgroundColor: '#fffaf7' }">更新<br />时间</th>
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
import { getMapOption, getOptionValue, lineOption } from 'pkg/echarts/echartUtil'
import { baseType } from '@/appType'
import { connection } from 'tool/axios'
import { defineComponent, nextTick, onMounted, reactive, toRefs, watch } from 'vue'
import { HomeState } from './HomeType'
import geoJson from '@/components/echarts/chinaGeoJson'
import { getCityAllData, TreeType } from '@/utils/tree'

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
      mapTab: true
    })

    let trendData: baseType
    let briefingEchartData: Array<baseType>
    let treeData: Array<TreeType>

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

      treeData = localData.data.diseaseh5Shelf.areaTree

      // 初始化渲染 今日疫情card
      handleTodayData(localData.data.diseaseh5Shelf.chinaTotal)
      // 初始化渲染 31省市速报
      handleBriefing(localData.data.localCityNCOVDataList)
      // 初始化渲染 趋势图
      state.activeTrend && changeTrendTab(state.activeTrend)
      state.briefingtab && changeBriefingTab(state.briefingtab)
      renderMap()
    })

    watch(
      [() => state.limitTrend, () => state.activeBriefing, () => state.mapTab],
      async ([newData, newCity, newMapTab], [oldData, oldCity, oldMapTab]) => {
        // 监听趋势查询范围变化
        if (newData !== oldData) {
          newData && (await queryTrend(newData.key))
          state.activeTrend && changeTrendTab(state.activeTrend)
        }

        // 监听 速报表格切换城市
        if (newCity !== oldCity) {
          newCity && (await queryCityBriefing(newCity.adcode))
          state.briefingtab && changeBriefingTab(state.briefingtab)
        }

        // 监听 地图tab变化
        if (newMapTab !== oldMapTab) {
          /**
           * @todo
           * 期望： mapTab（地图控制按钮）变化后按钮的样式立刻渲染后，再触发map的渲染事件
           * 问题： 为什么使用nextTick无法实现目标？即使我把它放到mapTab的change事件中。比如在react中可以使用setState的第二个参数
           * 此处使用了setTimeout开启宏任务来解决，请问vue中有什么更优雅的方式？
           */
          setTimeout(() => {
            renderMap(newMapTab)
          })
          // await nextTick(function () {
          //   renderMap(newMapTab)
          // })
        }
      },
      {
        deep: true
      }
    )

    /**
     * 今日疫情数据总览
     * @param data
     */
    const handleTodayData = (data: baseType) => {
      const { cardList = [] } = state
      for (let index = 0; index < cardList.length; index++) {
        const item = cardList[index]
        item.value = data[item.key]
      }
      state.cardList = cardList
    }

    const handleBriefing = (data: Array<baseType>) => {
      state.briefingList = data
      state.activeBriefing = data[0]
    }

    /* *****************************************    趋势图逻辑    **************************************************/
    /* *****************************************    趋势图逻辑    **************************************************/
    /* *****************************************    趋势图逻辑    **************************************************/

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

    /* *****************************************    速报逻辑    **************************************************/
    /* *****************************************    速报逻辑    **************************************************/
    /* *****************************************    速报逻辑    **************************************************/

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

    const queryCityBriefing = async (adcode: string) => {
      console.log('城市速报查询 :>> ', adcode)
      const res = await connection('/query/pubished/daily/list', 'get', {
        params: {
          limit: 30,
          adCode: adcode
        }
      })
      console.log('城市速报查询 结果 :>> ', res)
      briefingEchartData = res.data
    }

    const changeMapTab = (isToday = true) => {
      state.mapTab = isToday
    }

    const renderMap = (isToday = true) => {
      // 渲染map echarts
      const treenode = getCityAllData('中国', treeData, isToday)
      const mapOption = getMapOption('china', treenode)
      state.mapOption = { option: mapOption }
      console.log('state.mapOption :>> ', state.mapOption)
    }

    return {
      ...toRefs(state),
      changeTrendTab,
      handleChange,
      changeBriefing,
      changeBriefingTab,
      changeMapTab
    }
  }
})
</script>

<style lang="less" scoped>
@import 'src/style/var.less';

.home {
  padding: 0 36px;
  > div {
    margin-top: 10px;
  }
}

.localToday {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 10px;
  column-gap: 10px;
}
.trend {
  .trendTitle {
    display: flex;
    justify-content: space-between;

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
    cursor: pointer;
    margin: 0 8px;
    text-align: center;
  }
  .activeTrendTab {
    border: 1px solid @defaultBlue;
    color: @defaultBlue;
    background-color: lighten(@defaultBlue, 45%);
  }
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
