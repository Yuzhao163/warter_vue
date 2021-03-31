<template>
<!--<div class="wrapper">-->
  <el-container style="height: 100% ">
    <el-header style="height:80px;padding: 0px;" >
      <Head></Head>
      <div class="head-tag">
        <div class="head-tag-div">111</div>
        <tags class="tag"></tags>
      </div>

    </el-header>
    <el-container style="overflow: hidden">
      <el-aside  width="15%" style="background-color:#3D7797">
        <nav-menu class="nav-menu"></nav-menu>
      </el-aside>

      <div class="view">
<!--        <div class="whitebox"></div>-->
        <el-main style="display: block; height: 100%; background-color: #e5f1f6;">
          <router-view/>
        </el-main>
      </div>
<!--        <el-footer>Footer</el-footer>-->
      </el-container>
    </el-container>
<!--  </div>-->
</template>

<script>

import NavMenu from "@/components/common/NavMenu";
import Head from "@/components/common/Head";
import Tags from "@/components/common/Tags";
import bus from './common/bus';
export default {
  name: "Home",
  components: {Head, NavMenu,Tags},
  data() {
    return {
      tagsList: [],
      collapse: false
    };
  },
  created() {
    bus.$on('collapse-content', msg => {
      this.collapse = msg;
    });
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  }

};
</script>

<style scoped>
.view{
  width: 100%;
  height: auto;
  margin-top: 40px;
  overflow: hidden;
  background-color: #E5F1F6;
  box-sizing: border-box;
}
/*.view::-webkit-scrollbar {*/
/*  width: 0;*/
/*}*/
.view .whitebox{
  position: relative;
  height: 40px;

}
.nav-menu {
  /*margin-bottom: 40px;*/
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.05);
  z-index: 11;
}
.head-tag{
  display: flex;
}
.head-tag-div{
  background-color: #1160c6;
  width: 15%;
}
.tag{
  width: 85%;
  z-index: 10;
}

</style>
