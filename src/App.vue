<template>
  <a-config-provider :locale="state.locale">
    <div id="cantianer">
      <NavBar :list="state.list"></NavBar>
      <div class="routeView">
        <router-view @getList="getList"></router-view>
      </div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import NavBar from 'pkg/navBar/NavBar.vue'
import { getLocal } from 'tool/localStory'
import { onMounted, reactive } from 'vue'
import { AppState } from './appType'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const state = reactive<AppState>({
  list: [],
  locale: zhCN
})
onMounted(() => {
  const isLogin = getLocal('token')
  getList(!!isLogin)
})

const getList = async (isLogin?: Boolean) => {
  console.log('父组件方法getList :>> ', isLogin)
  const data = [
    { id: 1, text: '国内疫情', to: '/' },
    { id: 2, text: '国外疫情', to: '/abroad' },
    { id: 3, text: '我的', to: '/me' }
  ]

  if (isLogin) {
    data.splice(1, 0, { id: 4, text: '疫情', to: '/city' })
  }
  state.list = data
}
</script>

<style lang="less" scoped>
#cantianer {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 750px;
  height: inherit;
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0 1px 10px 1px #999;
}
</style>
