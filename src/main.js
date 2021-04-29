import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import store from "./store";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

// 在进入每一个页面前执行判断权限
router.beforeEach((to, from, next) => {
      if (to.meta.requireAuth) { // 如果该页面需要权限
        let token = localStorage.getItem('access_token')
        if (token) {// 从全局共享变量中找到登录信息
          next()
        } else {
          next({
            path: 'login', // 没有登录信息，跳到登录页面
            query: {redirect: to.fullPath}
          })
        }
      } else {
        next()
      }
    }
)

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default router
