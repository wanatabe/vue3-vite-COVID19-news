# Vue 3 + TypeScript + Vite






## 后台接口

来自腾讯新闻接口

**_ 1、城市每日新增历史记录 _**
api.inews.qq.com/newsqa/v1/query/pubished/daily/list?adCode=310000&limit=30

```js
const res = {
  data: [
    {
      y: '2022',
      date: '06.18',
      city: '丹东',
      confirm: 96,
      dead: 0,
      heal: 11,
      suspect: 0,
      adcode: '210600',
      confirm_add: '1',
      yes_confirm_add: 1, // 新增本土确诊
      today_confirm_add: 0,
      yes_wzz_add: 3, // 新增本土无症状
      today_wzz_add: 0,
      is_show_wzz_add: 1
    }
  ]
}
```

**_ 2、全国新增、确诊趋势 _**
//api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=chinaDayListNew,chinaDayAddListNew&limit=30

```js
const res = {
  data: {
    chinaDayAddListNew: [
      {
        confirm: 79705,
        suspect: 0,
        dead: 113,
        heal: 513,
        importedCase: 13,
        infect: 682,
        localinfectionadd: 628, // 新增本土无症状
        localConfirmadd: 174, // 新增本土确诊
        deadRate: '0.1',
        healRate: '0.6',
        date: '05.22',
        y: '2022'
      }
    ],
    chinaDayListNew: [
      {
        confirm: 1875779,
        suspect: 0,
        dead: 15989,
        heal: 289557,
        nowConfirm: 1570233,
        nowSevere: 193,
        importedCase: 18506,
        deadRate: '0.9',
        healRate: '15.4',
        date: '05.22',
        y: '2022',
        noInfect: 38318,
        localConfirm: 4076,
        noInfectH5: 34763, // 现有本土无症状
        localConfirmH5: 4076, // 现有本土确认
        local_acc_confirm: 223332
      }
    ]
  }
}
```

**_ 3、国内 31 省市区本土疫情速报 _**
api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=localCityNCOVDataList,diseaseh5Shelf

```js
const res = {
  data: {
    localCityNCOVDataList: [
      {
        isUpdated: true,
        mtime: '2022-06-21 16:29:06', // 更新时间
        local_confirm_add: 7, // 本土确诊
        local_wzz_add: '3', // 本土无症状
        highRiskAreaNum: 0, // 高风险地区
        isSpecialCity: true,
        city: '北京',
        adcode: '110000',
        mediumRiskAreaNum: 4, // 中风险地区
        province: '北京',
        date: '2022/06/21'
      }
    ],
    diseaseh5Shelf: {
      areaTree: [], // 国内各省市数据详情
      chinaAdd: {},
      chinaTotal: {} // 国内今日数据统计
    }
  }
}
```

**_ 4、全国疫情数据 _**
//api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=nowConfirmStatis,provinceCompare

```
{
	data: {
		provinceCompare:[]
	}
}
```

**_ 5、海外疫情数据（按国家查看） _**
//api.inews.qq.com/newsqa/v1/automation/modules/list?modules=FAutoforeignList

**_ 6、海外疫情数据（按大洲查看，含海外总数据） _**
//api.inews.qq.com/newsqa/v1/automation/modules/list?modules=FAutoCountryConfirmAdd,WomWorld,WomAboard
