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
<!--          <template v-if="item.subs&&item.subs.length">-->
<!--            <el-submenu v-for="(item,i) in mainitems" :index="item.index" :key="i" >-->
<!--                {{ item.title }}-->
<!--            </el-submenu>-->
<!--          </template>-->
<!--            <template v-else>-->
<!--              <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">-->
<!--                {{ subItem.title }}-->
<!--              </el-menu-item>-->
<!--              </template>-->
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
            <el-menu-item :index="item.index" :key="i">
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
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  data(){
    return{
      tagsList: [],
      collapse:false,
      a:true,
      mainitems:[
        {
          icon: 'el-icon-setting',
          index: 'index',
          title: '系统首页',
        },
        {
          icon: 'el-icon-setting',
          index: '1',
          title: '数据展示',
          subs: [
            {
              index: 'colchart',
              title: '列表展示'
            },{
              index: 'echart',
              title: '图表展示'
            },{
              index: 'pipepic',
              title: '管线可视化'
            },{
              index: 'wiring',
              title: '线路分布图'
            },
          ]
        },
        {
          icon: 'el-icon-setting',
          index: 'manage',
          title: '设备管理',
        },
        {
          icon: 'el-icon-setting',
          index: 'usetting',
          title: '用户设置',

        },
        {
          icon: 'el-icon-setting',
          index: '2',
          title: '测试练习',
          subs: [
            {
              index: 'testv',
              title: '视频练习'
            }
            ]
        }
      ]
    }
  },

  created() {
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  }


}

</script>

<style scoped>

</style>
