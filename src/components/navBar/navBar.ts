import { defineComponent, onBeforeMount, PropType, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NavItem, NavState } from './navBarTypes'

const props = { list: Array as PropType<Array<NavItem>> }

const navDefineComponent = defineComponent({
  props,
  setup(props, { expose }) {
    const state = reactive<NavState>({
      path: ''
    })
    const navRef = ref()
    const route = useRoute()

    onBeforeMount(() => {
      state.path = route.path
    })

    watch(
      () => route.path,
      (newPath, oldPath) => {
        state.path = newPath
      }
    )
    expose({
      navRef // 明确的暴露接口
    })
    return { state, navRef }
  }
})

export default navDefineComponent
