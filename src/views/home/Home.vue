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
      <VEchart :option="trendOption" height="18.75rem" />
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

              <VEchart :option="briefingOption" height="18.75rem" />
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
      <VEchart :option="mapOption" :mapConfig="mapConfig" height="31.25rem" />
    </div>
    <div class="citytable">
      <h2>全国疫情数据（含港澳台）</h2>
      <a-table :dataSource="dataSource" childrenColumnName="noChild" :columns="columns" @change="pageChange" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action' && record.adcode">
            <span class="detailBtn" @click="clictToDetail(record)">
              <svg t="1656923070136" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="2231" width="200" height="200">
                <path
                  d="M642.174 504.594c7.99 7.241 7.897 17.58-0.334 24.782L332.62 799.945c-8.867 7.759-9.766 21.236-2.007 30.103 7.758 8.867 21.236 9.766 30.103 2.007l309.221-270.569c27.429-24 27.792-64.127 0.89-88.507L360.992 192.192c-8.73-7.912-22.221-7.248-30.133 1.482-7.912 8.73-7.248 22.222 1.482 30.134l309.833 280.786z"
                  fill=""
                  p-id="2232"
                ></path>
              </svg>
            </span>
          </template>
        </template>
      </a-table>
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
import { default as isEqual } from 'lodash/isEqual'
import { useRouter } from 'vue-router'
import ObjectUtil from '@/utils/object'

export default defineComponent({
  name: 'Home',
  setup(props, { emit }) {
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
      mapTab: true,
      dataSource: [],
      order: {
        key: '新增确诊',
        order: 'ascend'
      },
      columns: [
        {
          title: '地区',
          dataIndex: 'name',
          key: 'name',
          width: '15%',
          align: 'center'
        },
        {
          title: '新增确诊',
          dataIndex: ['today', 'confirm'],
          key: ['today', 'confirm'],
          sorter: (a: { today: { confirm: number } }, b: { today: { confirm: number } }) => a.today.confirm - b.today.confirm,
          sortOrder: 'descend',
          align: 'center'
        },
        {
          title: '现有确诊',
          dataIndex: ['total', 'nowConfirm'],
          key: ['total', 'nowConfirm'],
          sorter: (a: { total: { nowConfirm: number } }, b: { total: { nowConfirm: number } }) => a.total.nowConfirm - b.total.nowConfirm,
          sortOrder: false,
          align: 'center'
        },
        {
          title: '累计确诊',
          dataIndex: ['total', 'confirm'],
          key: ['total', 'confirm'],
          sorter: (a: { total: { confirm: number } }, b: { total: { confirm: number } }) => a.total.confirm - b.total.confirm,
          sortOrder: false,
          align: 'center'
        },
        {
          title: '累计死亡',
          dataIndex: ['total', 'dead'],
          key: ['total', 'dead'],
          sorter: (a: { total: { dead: number } }, b: { total: { dead: number } }) => a.total.dead - b.total.dead,
          sortOrder: false,
          align: 'center'
        },
        {
          title: '详情',
          key: 'action',
          width: '12%',
          align: 'center'
        }
      ]
    })

    const router = useRouter()

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
      state.dataSource = treeData[0].children

      // 初始化渲染 今日疫情card
      handleTodayData(localData.data.diseaseh5Shelf.chinaTotal)
      // 初始化渲染 31省市速报
      handleBriefing(localData.data.localCityNCOVDataList)
      // 初始化渲染 趋势图
      state.activeTrend && changeTrendTab(state.activeTrend)
      state.briefingtab && changeBriefingTab(state.briefingtab)
      renderMap()
      nextTick(() => {
        emit('mounted')
      })
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
           * @todo 该问题已解决
           * 期望： mapTab（地图控制按钮）变化后按钮的样式立刻渲染后，再触发map的渲染事件
           * 问题： 为什么使用nextTick无法实现目标？即使我把它放到mapTab的change事件中。比如在react中可以使用setState的第二个参数
           * 此处使用了setTimeout开启宏任务来解决，请问vue中有什么更优雅的方式？
           *
           * （https://github.com/apache/echarts/issues/13943）
           * 解决：在echanrts组件（src\components\echarts\Echarts.tsx）中，使用ref储存echart实例及dom实例，导致Proxy应用到了整个实例，
           * 严重影响了实例底层的运行，使用shallowRef（https://v3.cn.vuejs.org/api/refs-api.html#shallowref）替换
           */
          // setTimeout(() => {
          //   renderMap(newMapTab)
          // })
          // nextTick(function () {
          renderMap(newMapTab)
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
        item.value = ObjectUtil.getValue(item.key, data)
      }
      state.cardList = cardList
    }

    /* *****************************************    全国新增本土确诊趋势图    **************************************************/
    /* *****************************************    全国新增本土确诊趋势图    **************************************************/
    /* *****************************************    全国新增本土确诊趋势图    **************************************************/

    const handleChange = (value: string) => {
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

    /* *****************************************    疫情速报    **************************************************/
    /* *****************************************    疫情速报    **************************************************/
    /* *****************************************    疫情速报    **************************************************/

    const handleBriefing = (data: Array<baseType>) => {
      state.briefingList = data
      state.activeBriefing = data[0]
    }

    const changeBriefing = (data: baseType) => {
      state.activeBriefing = data
    }

    const changeBriefingTab = (data: baseType) => {
      const option = lineOption(
        getOptionValue('date', briefingEchartData),
        undefined,
        getOptionValue(data.key, briefingEchartData, data.remark)
      )
      state.briefingtab = data
      state.briefingOption = { option }
    }

    const queryCityBriefing = async (adcode: string) => {
      const res = await connection('/query/pubished/daily/list', 'get', {
        params: {
          limit: 30,
          adCode: adcode
        }
      })
      briefingEchartData = res.data
    }

    /* *****************************************    全国疫情分布    **************************************************/
    /* *****************************************    全国疫情分布    **************************************************/
    /* *****************************************    全国疫情分布    **************************************************/

    const changeMapTab = (isToday = true) => {
      state.mapTab = isToday
    }

    const renderMap = (isToday = true) => {
      // 渲染map echarts
      const treenode = getCityAllData('中国', treeData, isToday)
      const mapOption = getMapOption('china', treenode)
      state.mapOption = { option: mapOption }
    }

    /* *****************************************    全国疫情数据    **************************************************/
    /* *****************************************    全国疫情数据    **************************************************/
    /* *****************************************    全国疫情数据    **************************************************/

    // change事件绑定的函数
    const pageChange = (page: any, filters: any, sorter: { columnKey: any; order: any }) => {
      const newColumns = state.columns.map((item: any) => {
        isEqual(item.dataIndex, sorter.columnKey) ? (item.sortOrder = sorter.order) : (item.sortOrder = false)
        return item
      })
      state.columns = newColumns
    }

    /**
     * 跳转到对应城市详情页
     * @param record
     */
    const clictToDetail = (record: any) => {
      const { name, adcode } = record
      emit('toDetail', record)

      router.push({
        name: 'city',
        params: { name, adcode, data: JSON.stringify(record) }
      })
    }

    return {
      ...toRefs(state),
      changeTrendTab,
      handleChange,
      changeBriefing,
      changeBriefingTab,
      changeMapTab,
      pageChange,
      clictToDetail
    }
  }
})
</script>

<style lang="less" scoped>
@import 'src/style/var.less';

.home {
  padding: 0 @sz30;
  > div {
    margin-top: @sz10;
  }
  h2 {
    font-weight: bold !important;
  }
}

.localToday {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: @sz10;
  column-gap: @sz10;
}
.trend {
  .trendTitle {
    display: flex;
    justify-content: space-between;

    .antdSelect {
      width: 7.375rem;
      height: @sz30;
      :deep(.ant-select-selector) {
        padding: 0;
        text-align: left;

        .ant-select-selection-item {
          padding-left: @sz10;
        }
      }
    }
    @media screen and (max-width: 767px) {
      .antdSelect {
        height: @sz48;
      }
    }
  }
}

.trendTabs {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .trendTab {
    padding: @sz8 @sz16;
    font-weight: bold;
    font-size: @sz18;
    border-radius: @sz4;
    background-color: rgba(153, 153, 153, 0.1);
    cursor: pointer;
    margin: 0 @sz8;
    text-align: center;
  }
  .activeTrendTab {
    border: @sz1 solid @defaultBlue;
    color: @defaultBlue;
    background-color: lighten(@defaultBlue, 45%);
  }
}

.briefing {
  table {
    width: 100%;
    margin-top: @sz16;

    thead {
      th {
        height: 5.375rem;
        text-align: center;
        font-size: 1.5rem;
        padding: 0 @sz6;
      }
    }
    tbody {
      th {
        height: 4rem;
        text-align: center;
        font-size: 1.5rem;
        &:first-child {
          text-align: left;
          padding-left: @sz10;
        }
        &:last-child {
          font-size: @sz18;
        }
      }
    }
    .activeBriefing {
      background-color: #e5f3ff;
    }

    .briefingEchart {
      padding-top: @sz18;
      padding-bottom: @sz18;
    }
  }
}
.mapEchart {
  .trendTabs {
    justify-content: start;
    margin: @sz16 0;
  }
}
.citytable {
  :deep(table) {
    .ant-table-thead > tr > th {
      font-size: @sz18;
      font-weight: bold;
    }
    .ant-table-tbody > tr > td {
      font-size: @sz16;
      &:first-child {
        color: @defaultBlue;
      }
    }
  }
  .detailBtn {
    width: 1.625rem;
    display: flex;
    margin: 0 auto;
    > svg {
      height: 100%;
      width: 100%;
      cursor: pointer;
      &:hover {
        path {
          fill: @defaultBlue;
        }
      }
    }
  }
}
</style>
