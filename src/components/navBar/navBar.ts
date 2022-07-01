import { defineComponent, onBeforeMount, PropType, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NavItem, NavState } from './navBarTypes'

const props = { list: Array as PropType<Array<NavItem>> }

const navDefineComponent = defineComponent({
  props,
  setup(props) {
    const state = reactive<NavState>({
      path: ''
    })
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

    return { state }
  }
})

export default navDefineComponent
