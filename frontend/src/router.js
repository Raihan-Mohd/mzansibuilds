import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import FeedView from './views/FeedView.vue'
import CreateView from './views/CreateView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/feed', name: 'feed', component: FeedView },
  { path: '/create', name: 'create', component: CreateView }
]

const router = createRouter({
  history: createWebHistory(), 
  routes
})

export default router