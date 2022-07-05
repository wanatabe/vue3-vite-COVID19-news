import { baseType } from '@/appType'

export default class ObjectUtil {
  /**
   * 判断对象是否为空对象
   * @param obj
   * @returns {boolean}
   */
  static isEmpty(obj: baseType) {
    for (const key in obj) {
      return false
    }
    return true
  }

  /**
   * 判断对象是否null和undefined
   * @param object
   * @returns {boolean}
   */
  static isNull(object: any) {
    if (object === null) return true
    return object === 0
  }

  /**
   * 判断对象是否是数组
   * @param object
   * @returns {any}
   */
  static isArray(object: any) {
    if (!object) return false
    return Array.isArray(object)
  }

  static cloneDeep(data: any) {
    if (!data || typeof data !== 'object') return data
    let cloneData: any = Array.isArray(data) ? [] : {}
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const item = data[key]
        if (typeof item === 'object') {
          cloneData[key] = this.cloneDeep(item)
        } else {
          cloneData[key] = item
        }
      }
    }
    return cloneData
  }

  /**
   * 获取对象值
   * @param path 路径
   * @param data 数据源
   * @returns
   */
  static getValue = (path: string | string[], data: baseType) => {
    let value = data
    if (typeof path === 'string') return data[path]

    for (let index = 0; index < path.length; index++) {
      const key = path[index]
      try {
        value = value[key]
      } catch (error) {
        throw new Error('索引为' + key + '的值为undefined')
      }
    }
    return value
  }
}
