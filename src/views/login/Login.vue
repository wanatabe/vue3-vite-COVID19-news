<template>
  <div class="login">
    <div class="form">
      <VInput class="input" @onInput="changeRequest('name', $event)" type="text" name="name" placeholder="请输入用户名"></VInput>
      <VInput class="input" @onInput="changeRequest('psw', $event)" type="password" name="psw" placeholder="请输入密码"></VInput>
      <VButton buttonClass="button" text="登录" @onClick="login"></VButton>
    </div>
  </div>
</template>

<script lang="ts">
import { HTMLElementEvent } from 'pkg/input/Input'
import { connection } from 'tool/axios'
import { getLocal, setLocal } from 'tool/localStory'
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import { LoginType } from './LoginType'

export default defineComponent({
  name: 'Login',
  setup(props, { emit }) {
    const state = reactive<LoginType.LoginState>({
      isLogin: false,
      request: {}
    })
    const internalInstance = getCurrentInstance()

    /**
     * 修改表单信息
     * @param key
     * @param e
     */
    const changeRequest = (key: 'name' | 'psw', e: HTMLElementEvent<HTMLInputElement>): void => {
      let request = state.request
      if (!request) request = {}
      request[key] = e.target.value || ''

      state.request = request
    }

    const login = async () => {
      const token = getLocal('token')
      if (token) return console.warn('无需重复登录')
      let data
      try {
        // 登录请求
        data = await connection('/user/login', 'POST', {
          reqeustBase: 'private',
          data: state.request
        })
      } catch (error) {
        console.error(error)
      } finally {
        // 缓存token
        setLocal('token', data?.token || 'fdafjojwnefsadnfohsaild')
        state.isLogin = true
        // 设置全局变量
        if (internalInstance) {
          const globalState = internalInstance.appContext.config.globalProperties.$globalState
          globalState.set('isLogin', true)
        }
        // 通知父组件
        emit('getList', true)
      }
    }

    return {
      login,
      changeRequest,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" scoped>
@import 'src/style/var.less';
.login {
  padding: 16px 8px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 100%;
  background: #eee;
  .form {
    position: absolute;
    top: 20%;
    width: 100%;
  }

  .input {
    width: 50%;
    margin: 8px auto 0 auto;
  }
  .button {
    width: 50%;
    margin: 8px auto 0 auto;
  }
}
</style>
