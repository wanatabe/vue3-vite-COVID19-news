import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { install } from 'pkg/install'

const echartProps = {
  option: Object as PropType<InitConfigType>,
  class: String,
  height: String,
  width: String,
  mapConfig: Object as PropType<MapConfig>
}
export interface InitConfigType {
  option: echarts.EChartsOption
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
    const echartRef = ref<HTMLElement>()
    const echart = ref<echarts.ECharts>()

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
