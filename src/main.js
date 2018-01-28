import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'

// Vue.config.productionTip = false

/* eslint-disable no-new */
import 'common/stylus/index.styl'

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

fastclick.attach(document.body)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
