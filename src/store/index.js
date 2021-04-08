import Vue from 'vue'
import Vuex from 'vuex'

import VuexPersistence from 'vuex-persist'
//拦截器设置
Vue.use(Vuex)
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})
export default new Vuex.Store({
  state: {
      users: {
          username:'',
          password:'',
          type:"1",//目前3为管线操作人员；2为维护管理人员

      },
    user: {
            username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username
        }
    },
    mutations: {
        login (state, user) {
            state.user = user
            window.localStorage.setItem('user', JSON.stringify(user))
        }
    },
    plugins: [vuexLocal.plugin]
})
