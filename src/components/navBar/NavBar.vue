<template>
  <nav class="nav" ref="navRef">
    <router-link v-for="item in $props.list" :key="item.id" :to="item.to" :class="state.path === item.to && 'active'">
      {{ item.text }}
    </router-link>
  </nav>
</template>

<script lang="ts">
import navDefineComponent from './navBar'
export default navDefineComponent
</script>

<style lang="less" scoped>
@import 'src/style/var.less';
.nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  background-color: rgba(255, 255, 255, 0.7);
  font-size: 22px;
  margin-bottom: 24px;
  box-shadow: 1px 0 10px 0px #ccc;
  position: sticky;
  top: 0;
  z-index: 99;

  /*包含以下四种的链接*/
  a {
    text-decoration: none;
    color: @defaultColor;
  }
  /*正常的未被访问过的链接*/
  a:link {
    text-decoration: none;
    color: @defaultColor;
  }
  /*已经访问过的链接*/
  a:visited {
    text-decoration: none;
    color: @defaultColor;
  }
  /*鼠标划过(停留)的链接*/
  a:hover {
    text-decoration: none;
    color: @defaultColor;
  }
  /* 正在点击的链接*/
  a:active {
    text-decoration: none;
    color: @defaultColor;
  }
  .active {
    color: @defaultBlue !important;
    font-weight: bold;
  }
}
</style>
