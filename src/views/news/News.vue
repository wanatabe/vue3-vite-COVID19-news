<template>
  <div>
    <button @click="toChild">嵌套路由</button>
  </div>
  <!-- <router-view></router-view> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'News',
  setup() {
    const router = useRouter()
    const toChild = () => {
      // router.push({ path: 'news/unlogin' })
    }
    return {
      toChild
    }
  }
})
</script>

<style scoped></style>
