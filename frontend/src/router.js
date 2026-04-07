import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import FeedView from './views/FeedView.vue'
import CreateView from './views/CreateView.vue'
import LoginView from './views/LoginView.vue'
import CelebrationView from './views/CelebrationView.vue'
import ProfileView from './views/ProfileView.vue'
import ManageProjectView from './views/ManageProjectView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/feed', name: 'feed', component: FeedView },
  { path: '/create', name: 'create', component: CreateView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/celebration', name: 'celebration', component: CelebrationView },
  { path: '/profile', name: 'profile', component: ProfileView },
  { path: '/manage/:id', name: 'manage', component: ManageProjectView }
]

const router = createRouter({
  history: createWebHistory(), 
  routes
})

export default router