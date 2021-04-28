<template>
  <el-row class="tac" style="height: 100%">
    <el-col>
      <el-menu
          default-active="2"
          router
          :collapse="collapse"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          :unique-opened="true"
          @close="handleClose"
          background-color="#3D7797"
          text-color="#F0ECEC"
          active-text-color="#ffd04b">

        <template v-for="(item,i) in mainitems">
          <template v-if="item.subs&&item.subs.length">
            <el-submenu :index="item.index" :key="i">
              <template slot="title">
                <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
              </template>
              <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :id="forid(i)" :index="item.index" :key="i">
              <template slot="title">
                <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
              </template>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import bus from '../common/bus';

export default {
  name: "NavMenu",

  methods: {
    //检查用户的权限，如果为2则无个人显示
    check() {
      if (this.$store.state.users.type == '3') {
        console.log('权限变更')
        this.mainitems[7]='';
        this.mainitems[7]=this.mainitems[9];
        this.$delete(this.mainitems,8);//去掉人员、设备维护功能
        this.$delete(this.mainitems,8);//去掉人员、设备维护功能
      }
      if (this.$store.state.users.type == '2') {
        console.log('权限变更')

        this.$delete(this.mainitems,3);//去掉管线操作员各个功能
        this.$delete(this.mainitems,3);
        this.$delete(this.mainitems,3);
      }
    },
    forid(i){
      return i;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  data() {
    return {
      tagsList: [],
      collapse: false,
      a: true,
      mainitems: [
        {
          icon: 'el-icon-house',
          index: 'index',
          title: '系统首页',
        },
        {
          icon: 'el-icon-warning-outline',
          index: 'publicfault',
          title: '异常展示',
        },
        {
          icon: 'el-icon-s-operation',
          index: 'wiring',
          title: '管线分布',
        },
        {
          icon: 'el-icon-data-analysis',
          index: 'pipepic',
          title: '管路状态',
        },
        // {
        //   icon: 'el-icon-setting',
        //   index: '1',
        //   title: '数据展示',
        //   subs: [
        //     {
        //       index: 'colchart',
        //       title: '列表展示'
        //     },{
        //       index: 'echart',
        //       title: '图表展示'
        //     },{
        //       index: 'pipepic',
        //       title: '管线可视化'
        //     },{
        //       index: 'wiring',
        //       title: '线路分布图'
        //     },
        //   ]
        // },
        {
          icon: 'el-icon-document',
          index: 'manage',
          title: '命令下发',
        },
        {
          icon: 'el-icon-magic-stick',
          index: 'privatefault',
          title: '故障处理',
        },
        {
          icon: 'el-icon-view',
          index: 'usermessage',
          title: '个人信息',

        },
        {
          icon: 'el-icon-takeaway-box',
          index: 'device',
          title: '设备维护',
        },
        {
          icon: 'el-icon-user',
          index: 'staff',
          title: '人员管理',
        },
        {
          icon: 'el-icon-user',
          index: 'traffic_forecast',
          title: '流量预测',
        },
        {
          icon: 'el-icon-user',
          index: 'fault_diagnosis',
          title: '故障诊断',
        },
        {
          icon: 'el-icon-user',
          index: 'pipeline_optimization',
          title: '路径优化',
        },
        // {
        //   icon: 'el-icon-view',
        //   index: '2',
        //   title: '测试练习',
        //   subs: [
        //     {
        //       index: 'testv',
        //       title: '视频练习'
        //     }
        //   ]
        // }
      ]
    }
  },

  created() {
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
      this.check();
    bus.$on('tags', msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
    bus.$on('jump',()=>{
      document.getElementById('3').click();//此处执行对应的函数操作
    })
    bus.$on('goindex',()=>{
      document.getElementById('0').click();//此处执行对应的函数操作
    })

  }


}

</script>

<style scoped>

</style>
