/**
 * 全局变量设置
 */
import { getLocal } from 'tool/localStory'

function globalState() {
  const data = new Map()
  const isLogin = getLocal('token')
  data.set('isLogin', !!isLogin)
  return data
}

export { globalState }
