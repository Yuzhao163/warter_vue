import Vue from "vue";
import Router from "vue-router";

import AppIndex from "@/components/home/AppIndex";
import PublicFault from "@/components/home/PublicFault";
import PrivateFault from "@/components/home/PrivateFault";
import UserMessage from "@/components/home/UserMessage";
import Staff from "@/components/home/Staff";
import Device from "@/components/home/Device";
import AreaDevice from "@/components/home/AreaDevice";
import PipDevice from "@/components/home/PipDevice";
import Login from "@/components/Login";
import Home from "@/components/Home";
import HelloWorld from '@/components/HelloWorld'
import Colchart from '@/components/charts/Colchart'
import Echart from '@/components/charts/Echart'
import PipePic from '@/components/charts/PipePic'
import Wiring from '@/components/charts/Wiring'
import Manage from '@/components/manage/Manage'
import UserSetting from '@/components/user/UserSetting'
import Main from "@/components/Main";
import Register from "@/components/Register";
import Testv from "@/components/test/Testv";
import Fault_diagnosis from "@/components/research_topic/Fault_diagnosis";
import Pipeline_optimization from "@/components/research_topic/Pipeline_optimization";
import Traffic_forecast from "@/components/research_topic/Traffic_forecast";


Vue.use(Router);
export default new Router({
    mode: 'history',
  routes: [
    // 下面都是固定的写法
    {
      path: "/",
      redirect: '/main'
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
        //home页面不需要被访问
      redirect: "/index",
        children: [
            {
                path: '/index',
                name: '系统首页',
                component: AppIndex,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/publicfault',
                name: '异常展示',
                component: PublicFault,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/hello',
                name: 'HelloWorld',
                component: HelloWorld,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/colchart',
                name: '列表展示',
                component: Colchart,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/echart',
                name: '图表展示',
                component: Echart,
                meta: {
                    requireAuth: true
                    }
                },
            {
                path: '/pipepic',
                name: '管路状态',
                component: PipePic,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/wiring',
                name: '管线分部',
                component: Wiring,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/manage',
                name: '命令下发',
                component: Manage,
                meta: {
                    requireAuth: true
                }
            },{
                path: '/privatefault',
                name: '故障处理',
                component: PrivateFault,
                meta: {
                    requireAuth: true
                }
            },{
                path: '/usermessage',
                name: '个人信息',
                component: UserMessage,
                meta: {
                    requireAuth: true
                }
            },{
                path: '/staff',
                name: '员工管理',
                component: Staff,
                meta: {
                    requireAuth: true
                }
            },{
                path: '/device',
                name: '控制柜维护',
                component: Device,
                meta: {
                    requireAuth: true
                }
            },{
                path: '/pipdevice',
                name: '管线维护',
                component: PipDevice,
                meta: {
                    requireAuth: true
                }
            },{
                path: '/areadevice',
                name: '分区维护',
                component: AreaDevice,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/usetting',
                name: '用户设置',
                component: UserSetting,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/testv',
                name: '视频练习',
                component: Testv,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/traffic_forecast',
                name:'流量预测',
                component: Traffic_forecast,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/fault_diagnosis',
                name:'故障诊断',
                component: Fault_diagnosis,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/pipeline_optimization',
                name:'管路优化',
                component: Pipeline_optimization,
                meta: {
                    requireAuth: true
                }
            },
        ]
    },
      {
          path: "/main",
          name: "Main",
          component: Main,
          //home页面不需要被访问
          redirect: "/login",
          children:[
              {
                  path: "/login",
                  name: "Login",
                  component: Login,
                  meta: {
                      requireAuth: true
                  }
              },
              {
                  path: "/register",
                  name: "Register",
                  component: Register,
                  meta: {
                      requireAuth: true
                  }
              }
          ]
      }

  ]
});
