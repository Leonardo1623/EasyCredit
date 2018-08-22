import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Inicio from '@/components/Inicio'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
Vue.use(VueMaterial)
Vue.use(Router)

  //Se declara el Router con las vistas que se podrá accesar
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Inicio',
      name: 'Inicio',
      component: Inicio
    }
  ]
})
