<template>

  <el-container style="height: 100%">
    <el-header style="height:80px;padding: 0px;" >
      <Head></Head>
    </el-header>
    <el-container>
      <el-aside  width="15%" style="height: auto; background-color:#3D7797">
        <nav-menu class="nav-menu"></nav-menu>
      </el-aside>
      <el-container style="height: 90%">
        <el-main style="background-color: #E5F1F6;height: 100%"><router-view/></el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

import NavMenu from "@/components/common/NavMenu";
import Head from "@/components/common/Head";
export default {
  name: "Home",
  components: {Head, NavMenu}
};
</script>

<style scoped>
.nav-menu {
  /*margin-bottom: 40px;*/
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.05);
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
