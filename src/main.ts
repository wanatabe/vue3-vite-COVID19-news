import { globalState } from 'tool/globalVariable'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from 'route/router'
import './assets/public.css'
import 'pkg/index.less'
import 'ant-design-vue/lib/select/style/index.css'
import { Button, Card, Echart, Input } from 'pkg/index.'
import { Select } from 'ant-design-vue'

const app = createApp(App)

app.use(router)
app.mount('#app')
app.use(Button)
app.use(Input)
app.use(Card)
app.use(Echart)
app.use(Select)

/**
 * 设置全局变量
 */
app.config.globalProperties.$globalState = globalState()
