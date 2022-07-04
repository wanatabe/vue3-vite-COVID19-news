<template>
  <div class="abroad">
    <div class="localToday">
      <VCard :style="{ color: item.color }" v-for="item in cardList" :key="item.id" :data="item" :option="{ key: 'name', value: 'value' }">
        <p v-if="item.extra">
          <span>较昨日&nbsp;</span>
          <span :style="{ color: item.color }">{{ item.extra.value > 0 ? '+' : '' }}{{ item.extra.value ? item.extra.value : '' }}</span>
        </p>
      </VCard>
    </div>
    <div class="abroadTable">
      <h2>海外疫情</h2>
      <a-table :dataSource="countryData" childrenColumnName="noChild" :columns="columns" :pagination="false"></a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { baseType } from '@/appType'
import { connection } from '@/utils/axios'
import { defineComponent, nextTick, onMounted, reactive, toRefs } from 'vue'
import { AbroadState } from './abroadType'

export default defineComponent({
  name: 'Abroad',
  setup(props, { emit }) {
    const state = reactive<AbroadState>({
      cardList: [
        { id: 1, name: '现有确诊', key: 'nowConfirm', extra: { key: 'nowConfirmAdd' }, color: '#e61c1d' },
        { id: 2, name: '累计确诊', key: 'confirm', extra: { key: 'confirmAdd' }, color: '#be2121' },
        { id: 3, name: '累计治愈', key: 'heal', extra: { key: 'healAdd' }, color: '#178b50' },
        { id: 4, name: '累计死亡', key: 'dead', extra: { key: 'deadAdd' } }
      ],
      tabs: [
        { id: 1, text: '按大洲查看' },
        { id: 2, text: '按国家查看' }
      ],
      tab: { id: 2, text: '按国家查看' },
      countryData: [],
      continentData: [],
      cardData: {}
    })

    const columns = [
      {
        title: '地区',
        dataIndex: 'name',
        key: 'name',
        width: '15%',
        align: 'center'
      },
      {
        title: '新增确诊',
        dataIndex: 'confirmAdd',
        key: 'confirmAdd',

        align: 'center'
      },
      {
        title: '累计确诊',
        dataIndex: 'confirm',
        key: 'confirm',
        align: 'center'
      },
      {
        title: '治愈',
        dataIndex: 'heal',
        key: 'heal',
        align: 'center'
      },
      {
        title: '死亡',
        dataIndex: 'dead',
        key: 'dead',
        align: 'center'
      }
    ]

    onMounted(async () => {
      const data = await queryAbroad()
      const { WomAboard, WomWorld } = data
      state.countryData = WomAboard
      handleCardData(WomWorld)
      console.log('state.cardList :>> ', state.cardList)
      nextTick(() => {
        emit('mounted')
      })
    })

    const handleCardData = (data: baseType) => {
      const { cardList = [] } = state
      for (let index = 0; index < cardList.length; index++) {
        const item = cardList[index]
        item.value = data[item.key]
        if (item.extra && item.extra.key) {
          // const value = item.extra.key
          item.extra['value'] = data[item.extra.key]
        }
      }
      state.cardList = cardList
    }

    const queryAbroad = async () => {
      const data = await connection('/automation/modules/list', 'GET', {
        params: {
          modules: 'FAutoCountryConfirmAdd,WomWorld,WomAboard'
        }
      })
      console.log('queryAbroad :>> ', data)
      return data.data
    }

    return {
      columns,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" scoped>
@import 'src/style/var.less';

.abroad {
  padding: 16px 48px;
  h2 {
    font-weight: bold;
  }
  .abroadTable {
    margin-top: 16px;

    :deep(table) {
      .ant-table-thead > tr > th {
        font-size: 18px;
        font-weight: bold;
      }
      .ant-table-tbody > tr > td {
        font-size: 16px;
        &:first-child {
          color: @defaultBlue;
        }
      }
    }
  }
}
.localToday {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 10px;
  column-gap: 10px;
}
</style>
