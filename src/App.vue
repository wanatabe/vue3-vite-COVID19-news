<template>
  <a-config-provider :locale="state.locale">
    <div id="cantianer" ref="cantianerRef">
      <NavBar :list="state.list" ref="navRef"></NavBar>
      <div class="routeView" ref="viewRef">
        <router-view @getList="getList" @mounted="changeShow"></router-view>
      </div>
      <div id="toolBar" v-if="state.showBar">
        <div class="top" @click="scroolTop">
          <svg
            t="1656939504509"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2230"
            width="200"
            height="200"
          >
            <path d="M838.116 732.779 877.7 693.195 511.979 327.549 146.3 693.195 185.883 732.779 512.003 406.652Z" p-id="2231"></path>
          </svg>
        </div>
      </div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import NavBar from 'pkg/navBar/NavBar.vue'
import { getLocal } from 'tool/localStory'
import { onMounted, reactive, watch } from 'vue'
import { AppState } from './appType'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const navRef = ref()
const viewRef = ref()
const cantianerRef = ref()
const route = useRoute()
const state = reactive<AppState>({
  list: [],
  locale: zhCN,
  showBar: false
})
onMounted(() => {
  const isLogin = getLocal('token')
  getList(!!isLogin)
})

const changeShow = () => {
  console.log('nav height :>> ', navRef.value.navRef, navRef.value.navRef.clientHeight)
  console.log('view height :>> ', viewRef.value, viewRef.value.clientHeight)
  console.log('body height :>> ', document.body, document.body.clientHeight)
  state.showBar = navRef.value.navRef.clientHeight + viewRef.value.clientHeight >= document.body.clientHeight
}

watch(
  () => route.path,
  (newPath: string, oldPath: string) => {
    console.log('newPath,oldPath :>> ', newPath, oldPath)
    if (newPath !== oldPath) {
      state.showBar = false
    }
  }
)

const getList = async (isLogin?: Boolean) => {
  console.log('父组件方法getList :>> ', isLogin)
  const data = [
    { id: 1, text: '国内疫情', to: '/home' },
    { id: 2, text: '国外疫情', to: '/abroad' },
    { id: 3, text: '我的', to: '/me' }
  ]

  if (isLogin) {
    data.splice(1, 0, { id: 4, text: '疫情', to: '/city' })
  }
  state.list = data
}

/**
 * 滚动回顶部
 */
const scroolTop = () => {
  let top = cantianerRef.value.scrollTop //获取点击时页面的滚动条纵坐标位置
  const timeTop = setInterval(() => {
    cantianerRef.value.scrollTop = top -= 50 //一次减50往上滑动
    if (top <= 0) {
      clearInterval(timeTop)
    }
  }, 5)
}
</script>

<style lang="less" scoped>
@import 'src/style/var.less';

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
  position: relative;

  #toolBar {
    position: sticky;
    bottom: 48px;
    left: 100%;
    width: 36px;
    > div {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      display: flex;
      background-color: rgba(204, 204, 204, 0.5);
      padding: 4px;
      cursor: pointer;
      &:hover {
        background-color: lighten(@defaultBlue, 10%);
      }
    }
    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
