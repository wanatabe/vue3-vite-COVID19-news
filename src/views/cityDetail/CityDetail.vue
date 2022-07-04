<template>
  <div>城市详情</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'Abroad',
  setup(props, { emit }) {
    const route = useRoute()

    onMounted(() => {
      console.log('route :>> ', route.params)
      nextTick(() => {
        emit('mounted')
      })
    })

    return {}
  }
})
</script>

<style scoped></style>
