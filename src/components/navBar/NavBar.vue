<template>
  <nav class="nav" ref="navRef">
    <router-link v-for="item in $props.list" :key="item.id" :to="item.to" :class="item.to && state.path.includes(item.to) && 'active'">
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

@media screen and (max-width: 767px) {
  .nav {
    margin-top: @sz4;
  }
}
.nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: @sz56;
  padding: @sz30 0;
  margin-bottom: @sz24;
  background-color: rgba(255, 255, 255, 0.7);
  font-size: @sz22;
  box-shadow: @sz1 0 @sz10 0 #ccc;
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
