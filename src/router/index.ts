import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import YtMusic from '../views/YtMusic.vue'

import Test from '../views/Test.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/yt-music', component: YtMusic },
  { path: '/test', component: Test },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
