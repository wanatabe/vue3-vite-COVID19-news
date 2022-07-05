<template>
  <div class="me">
    <router-view @getList="logined" v-if="!isLogin"></router-view>
    <div>已登录</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'me',
  setup(props, { emit }) {
    const state = reactive({
      isLogin: false
    })

    onMounted(() => {
      nextTick(() => {
        emit('mounted')
      })
    })
    const logined = (isLogin = false) => {
      state.isLogin = isLogin
    }
    return {
      ...toRefs(state),
      logined
    }
  }
})
</script>

<style scoped></style>
