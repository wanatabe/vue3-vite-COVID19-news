import { defineComponent, onMounted, onUnmounted, PropType, shallowRef, watch } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart, MapChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  // 数据集组件
  DatasetComponent,
  VisualMapComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent
} from 'echarts/components'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { install } from 'pkg/install'
import { ECOption } from './echartUtil'

echarts.use([
  LineChart,
  MapChart,
  TooltipComponent,
  GridComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  VisualMapComponent,
  SVGRenderer,
  CanvasRenderer
])

const echartProps = {
  option: Object as PropType<InitConfigType>,
  class: String,
  height: String,
  width: String,
  mapConfig: Object as PropType<MapConfig>
}
export interface InitConfigType {
  option: ECOption
  notMerge?: boolean
  lazyUpdate?: boolean
}

export interface MapConfig {
  map: string
  geoJson: any
  specialAreas?: any
}

const echart = defineComponent({
  name: 'VEchart',
  props: echartProps,
  setup(props) {
    // const echartRef = ref<HTMLElement>()
    // const echart = ref<echarts.ECharts>()
    // 改ref为shollowRef，ref会导致Proxy应用到整个实例，严重影响实例底层运行
    let echartRef = shallowRef()
    let echart = shallowRef()

    /**
     * 设置option
     * @param {InitConfigType} config
     * @returns
     */
    const init = (config?: InitConfigType) => {
      if (!echart || !echart.value) return console.error('echart未实例')
      let { option, notMerge, lazyUpdate } = config || {}
      if (!option) return console.error('option为空：', option)
      echart.value.setOption(option, notMerge, lazyUpdate)
    }

    onMounted(() => {
      if (!echartRef.value) return console.error('echarts根节点容器不存在')
      echart.value = echarts.init(echartRef.value, undefined, { renderer: props.mapConfig ? 'canvas' : 'svg' })
      if (props.mapConfig) {
        const { map, geoJson, specialAreas } = props.mapConfig
        echarts.registerMap(map, geoJson, specialAreas)
      }
      init(props.option)
      window.addEventListener('resize', resize)
    })

    const resize = () => {
      echart.value?.resize()
    }

    onUnmounted(() => {
      window.removeEventListener('resize', resize)
      echart.value?.dispose()
    })

    watch(
      () => props.option,
      (newData) => {
        newData && init(newData)
      },
      {
        deep: true
      }
    )

    return () => {
      return <div ref={echartRef} class={['echarts', props.class]} style={{ width: props.width, height: props.height }}></div>
    }
  }
})
const Echart = install(echart)
export const VEcharts = echart
export default Echart
