import Vue from 'vue'
import Router from 'vue-router'
// need not to authenticate
import Top from '@/views/Top.vue'
import Signup from '@/views/Signup.vue'
import Signin from '@/views/Signin.vue'
import NotFound from '@/views/404.vue'
// need to authenticate
import Home from '@/views/Home.vue'
import NewItem from '@/views/NewItem.vue'
import EditItem from '@/views/EditItem.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  // eslint-disable-next-line
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/',
      name: 'top',
      component: Top
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin
    },
    {
      path: '/todo',
      redirect: '/todo/new'
    },
    {
      path: '/todo/new',
      component: NewItem
    },
    {
      path: '/todo/edit/:id',
      name: 'edit-item',
      component: EditItem
    },
    {
      path: '*',
      component: NotFound
    },
  ]
})
