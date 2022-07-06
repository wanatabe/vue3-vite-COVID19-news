import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: () => import('view/home/Home.vue') },
  { path: '/abroad', name: 'abroad', component: () => import('view/abroad/Abroad.vue') },
  {
    path: '/city',
    name: 'city',
    component: () => import('view/cityDetail/CityDetail.vue')
  },
  {
    path: '/me',
    name: 'me',
    component: () => import('view/me/me.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('view/login/Login.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // console.log('to,from :>> ', to, from)
  const isLogin = localStorage.getItem('token')
  if (to.name === 'me' && !isLogin) {
    next({ path: '/me/login' })
  } else {
    next()
  }
})
export { router }
