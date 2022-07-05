<template>
  <div class="city">
    <div class="localToday">
      <VCard v-for="item in cardList" :key="item.id" :data="item" :option="{ key: 'name', value: 'value' }" :add="item.add" />
    </div>
    <v-trend :treeData="treeData" :limitTrends="limitTrends" :trendTabs="trendTabs"></v-trend>
    <v-briefing :briefingList="treeData && treeData.children" />
  </div>
</template>

<script lang="ts">
import { baseType } from '@/appType'
import ObjectUtil from '@/utils/object'
import { defineComponent, nextTick, onMounted, toRefs, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { CityState } from './cityType'

export default defineComponent({
  name: 'Abroad',
  setup(props, { emit }) {
    const route = useRoute()
    const state = reactive<CityState>({
      treeData: {},
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
      limitTrends: [
        { key: 30, value: '近30天' },
        { key: 60, value: '近60天' },
        { key: 90, value: '近90天' },
        { key: 182, value: '近半年' },
        { key: 365, value: '近一年' }
      ],
      briefingList: []
    })

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

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" scoped>
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
</style>
