import Vue from 'vue'
import Vuex from 'vuex'
//拦截器设置
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
            username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username
        }
    },
    mutations: {
        login (state, user) {
            state.user = user
            window.localStorage.setItem('user', JSON.stringify(user))
        }
    }
})