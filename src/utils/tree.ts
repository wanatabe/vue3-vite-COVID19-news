import { baseType } from '@/appType'
import { CityAdCode, cityAdCode } from './city'

export interface TreeType extends baseType {
  children?: Array<any>
  today?: baseType
  total?: baseType
}

/**
 * 获取树节点
 * @param name 节点名称
 * @param treeData 数据源
 * @returns
 */
export function getTreeNode(name: string, treeData: TreeType): any {
  for (let index = 0; index < treeData.length; index++) {
    const item = treeData[index]
    if (item.name && item.name.includes(name)) {
      return item
    } else {
      if (item.children) {
        const res = getTreeNode(name, item.children)
        // 未找到节点则跳出本次循环
        if (!res) continue
        return res
      }
    }
  }
}

export function getCityAllData(name: string, treeData: TreeType, isToday = true) {
  const data = getTreeNode(name, treeData)
  if (!data.children) return
  let confirm = []
  for (let index = 0; index < data.children.length; index++) {
    const item = data.children[index]
    let { name, adcode, today, total } = item
    if (!adcode) {
      const values = Object.values(cityAdCode)
      name = values.find((pre) => pre.includes(name))
    }
    confirm.push({
      name: adcode ? cityAdCode[adcode as CityAdCode] : name,
      value: isToday ? today.confirm : total.nowConfirm
    })
  }
  return confirm
}
