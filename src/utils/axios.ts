import axios, { AxiosRequestConfig, Method } from 'axios'
import { baseType } from '@/appType'
import { router } from '../router/router'
import { getLocal } from './localStory'

const tx_baseURL = process.env.NODE_ENV == 'development' ? 'https://api.inews.qq.com/newsqa/v1' : 'https://api.inews.qq.com/newsqa/v1'
const me_baseURL = 'http://rap2api.taobao.org/app/mock/242254'
const instance = axios.create({
  baseURL: tx_baseURL,
  timeout: 15000
})

export type RequestConfig = AxiosRequestConfig & baseType

// 添加请求拦截器
instance.interceptors.request.use(
  function (config: RequestConfig) {
    // console.log('config :>> ', config)
    if (config.reqeustBase === 'private') {
      config.baseURL = me_baseURL
      const token = config.headers?.token || getLocal('token')
      if (!token && !config.url?.endsWith('/login') && !config.url?.includes('list')) {
        router.push({ path: 'login' })
        return Promise.reject({ msg: '未登录' })
      }
    }
    // console.log('header------', config)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    if (!response.data) {
      return Promise.reject({ code: -1, msg: '服务响应异常！' })
    }
    return response.data
  },
  function (error) {
    return Promise.reject(error)
  }
)

// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
instance.defaults.headers.common['Host'] = 'api.inews.qq.com'

export async function connection<T extends baseType>(url: string, method: Method, config?: RequestConfig): Promise<T> {
  if (!config) {
    config = {}
  }
  if (!config.headers) {
    config.headers = {}
  }

  const res: AxiosRequestConfig = {
    url,
    method,
    ...config
  }

  const req: any = await instance(res)
  return req
}
