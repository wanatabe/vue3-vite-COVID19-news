import { globalState } from 'tool/globalVariable'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from 'route/router'
import './assets/public.css'
import 'pkg/index.less'
import 'ant-design-vue/dist/antd.css'
import { Button, Card, Echart, Input, Trend } from 'pkg/index.'
import { ConfigProvider, Select, Table } from 'ant-design-vue'

const app = createApp(App)

app.use(router)
app.mount('#app')
app.use(Button)
app.use(Input)
app.use(Card)
app.use(Echart)
app.use(Trend)
app.use(Select)
app.use(Table)
app.use(ConfigProvider)

/**
 * 设置全局变量
 */
app.config.globalProperties.$globalState = globalState()
