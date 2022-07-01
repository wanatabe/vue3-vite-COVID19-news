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

function getOptionValue(key: string, data: any[] = [], remark?: string[]): Array<string | number> {
  if (!key || !data || !Array.isArray(data)) throw new Error('请正确传入参数')
  const res = []
  for (const value of data) {
    if (typeof value[key] !== 'undefined') {
      res.push(value[key])
    } else {
      // 未找到对应值，启用备用key取值

      // 如果备用key为传入，跳出本次循环
      if (!remark) continue
      for (let index = 0; index < remark.length; index++) {
        const item = remark[index]
        if (typeof value[item] === 'undefined') continue
        res.push(value[item])
      }
    }
  }
  return res
}

function getMapOption(mapName: string, data: any) {
  const option: echarts.EChartsOption = {
    visualMap: {
      type: 'piecewise',
      pieces: [
        { gte: 1000, label: '1000人以上', color: '#f04141' },
        { gte: 100, lte: 999, label: '100-999人', color: '#ff704f' },
        { gte: 30, lte: 99, label: '30-99人', color: '#ffaa80' },
        { gte: 10, lte: 29, label: '10-29人', color: '#ffd0a6' },
        { gte: 1, lte: 9, label: '1-9人', color: '#ffe7b8' },
        { lte: 0, label: '0人', color: '#e2ebf4' }
      ],
      itemGap: 0,
      itemSymbol: 'rect',
      borderColor: '#fff',
      borderWidth: 1,
      itemHeight: 24,
      splitNumber: 6,
      seriesIndex: [0]
    },
    tooltip: {
      padding: 0,
      enterable: true,
      transitionDuration: 1,
      textStyle: {
        color: '#000',
        decoration: 'none'
      },
      className: 'mapTollTip',
      formatter: function (params: any) {
        return `<div style='padding: 6px 16px;background:#e5f3ff;border-radius:4px'>
            <p>${params.name}</p>
            <p style='text-align: left;'> 人数：${params.value}</p>
          </div>`
      }
    },
    series: [
      {
        name: 'china',
        type: 'map',
        map: mapName,
        emphasis: {
          label: {
            show: true
          }
        },
        zoom: 1.35,
        layoutCenter: ['50%', '70%'],
        layoutSize: '100%',
        data: data
      }
    ]
  }
  return option
}

export { lineOption, getOptionValue, getMapOption }
