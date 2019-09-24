import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './main.css'
import titleMixin from './util/title'
import ToggleButton from 'vue-js-toggle-button'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Datepicker from 'vuejs-datepicker'

Vue.mixin(titleMixin)
Vue.use(ToggleButton)

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('datepicker', Datepicker)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
