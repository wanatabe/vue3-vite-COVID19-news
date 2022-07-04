<template>
  <div>我的</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted } from 'vue'

export default defineComponent({
  name: 'me',
  setup(props, { emit }) {
    onMounted(() => {
      nextTick(() => {
        emit('mounted')
      })
    })
    return {}
  }
})
</script>

<style scoped></style>
