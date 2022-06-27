import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('view/home/Home.vue') },
  { path: '/abroad', name: 'abroad', component: () => import('view/abroad/Abroad.vue') },
  {
    path: '/news',
    name: 'news',
    component: () => import('view/news/News.vue')
  },
  { path: '/login', name: 'login', component: () => import('view/login/Login.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('to,from :>> ', to, from)
  const isLogin = localStorage.getItem('token')
  if (to.name === 'news' && !isLogin) {
    next({ name: 'login' })
  } else {
    next()
  }
})
export { router }
