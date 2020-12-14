import Vue from 'vue'
import Vuex from 'vuex'
//拦截器设置
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      areas: [
          {
              AreaID: '1',
              AreaName: '1分区',
              pipes: [
                  {
                      PipID: 'a',
                      PipName: 'a管线',
                      tmns: [
                          {
                              TmnId: '10001',
                              TmnName: '赵家庄',
                          },
                          {
                              TmnId: '10002',
                              TmnName: '钱家庄',
                          },
                          {
                              TmnId: '10003',
                              TmnName: '孙家庄',
                          },
                          {
                              TmnId: '10004',
                              TmnName: '李家庄',
                          }
                      ]
                  },
                  {
                      PipID: 'b',
                      PipName: 'b管线',
                      tmns: [
                          {
                              TmnId: '10005',
                              TmnName: '周家庄',
                          },
                          {
                              TmnId: '10006',
                              TmnName: '吴家庄',
                          },
                          {
                              TmnId: '10007',
                              TmnName: '郑家庄',
                          },
                          {
                              TmnId: '10008',
                              TmnName: '王家庄',
                          }
                      ]
                  }],
          },
          {
              AreaID: '2',
              AreaName: '2分区',
              pipes: [
                  {
                      PipID: 'c',
                      PipName: 'c管线',
                      tmns: [{
                          TmnId: '',
                          TmnName: '',
                      }]
                  },
                  {
                      PipID: 'd',
                      PipName: 'd管线',
                      tmns: [{
                          TmnId: '',
                          TmnName: '',
                      }]
                  }],
          },
          {
              AreaID: '3',
              AreaName: '3分区',
              pipes: [
                  {
                      PipID: 'e',
                      PipName: 'e管线',
                      tmns: [{
                          TmnId: '',
                          TmnName: '',
                      }]
                  },
                  {
                      PipID: 'f',
                      PipName: 'f管线',
                      tmns: [{
                          TmnId: '',
                          TmnName: '',
                      }]
                  }],

          }],
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
