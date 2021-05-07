import Vue from "vue";
import App from "./App.vue";
import router from './router'
import axios from "axios";
import store from './store'
import Moment from 'moment'
import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css";
import echarts from 'echarts'
import './assets/css/global.less'
import VideoPlayer from 'vue-video-player'

require("video.js/dist/video-js.css");
require("vue-video-player/node_modules/video.js/dist/video-js.css");
Vue.use(VideoPlayer)
Vue.config.productionTip = false;
Vue.use(router).use(ElementUI);
Vue.filter('formatDate', function(value) {
    return Moment(value).format('YYYY-MM-DD HH:mm:ss')
})
// //拦截器设置
// router.beforeEach((to, from, next) => {
//       if (to.meta.requireAuth) {
//         if (store.state.user.username) {
//           next()
//         } else {
//           next({
//             path: 'login',
//             query: {redirect: to.fullPath}
//           })
//         }
//       } else {
//         next()
//       }
//     }
// )
Vue.prototype.$echarts = echarts
// axios.defaults.baseURL = 'http://8.140.190.203:8443/api'
axios.defaults.baseURL = 'http://localhost:8443/api'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios;
new Vue({
    router,
    store,
  render: h => h(App),
}).$mount("#app");
