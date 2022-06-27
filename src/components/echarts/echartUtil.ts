function lineOption(xKey?: Array<string | number>, yKey?: Array<string | number>, value?: Array<string | number>): echarts.EChartsOption {
  const option: echarts.EChartsOption = {
    // grid: {
    //   left: '5%',
    //   right: '5%'
    // },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xKey,
      axisLabel: {
        rotate: 45
        // interval: xKey?.length ? Math.floor(xKey?.length / 15) : 0
      }
    },
    yAxis: {
      type: 'value',
      data: yKey,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#d7d7d7'
        }
      }
    },
    series: [
      {
        data: value,
        type: 'line',
        smooth: true
      }
    ]
  }
  return option
}

function getOptionValue(key: string, data: any[]): Array<string | number> {
  if (!key || !data || !Array.isArray(data)) throw new Error('请正确传入参数')
  const res = []
  for (const value of data) {
    res.push(value[key])
  }
  return res
}

export { lineOption, getOptionValue }
