<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="logo-img">
<!--      <i class="el-icon-s-home" v-on:click="login"></i>-->
      <img src="../../assets/排水1.png" v-on:click="login">
    </div>
    <div class="logo-text">云端市政排水管网自动清洁系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!--        用户头像-->
        <div class="user-avator">
          <img src="../../assets/img/头像.jpg" />
        </div>
      <!-- 用户名下拉菜单 -->
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{this.$store.state.users.username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
        <el-dropdown-menu slot="dropdown">
          <a href="https://github.com/Yuzhao163/warter_vue" target="_blank">
            <el-dropdown-item>前端项目仓库</el-dropdown-item>
          </a><a href="https://github.com/Yuzhao163/warter" target="_blank">
            <el-dropdown-item>后台项目仓库</el-dropdown-item>
          </a>
          <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Head",

  computed: {
    username() {
      let username = localStorage.getItem('ms_username');
      return username ? username : this.name;
    }
  },
  methods:{
    login(){
      this.$router.push({path: '/main'})
    },
    handleCommand(command) {
      if (command == 'loginout') {
        localStorage.removeItem('ms_username');
        this.$router.push('/main');
      }
    },

  }
}
</script>

<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 80px;
  font-size: 22px;
  color: #ffffff;
  background-color: #134d6e;


}
.logo-text {

  /*margin: auto;*/
  float: left;
  width: 350px;
  height: 100%;
  line-height:80px;

  /*transform: translateY(-50%);*/
  /*vertical-align: middle;*/
  /*padding: 20px;*/
}
.logo-img {
  display: flex;
  cursor: pointer;
  margin: auto;
  margin-left: 18px;
  float: left;
  width: 80px;height: 80px;
  line-height: 80px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 80px;
  align-items: center;
}
.el-dropdown-link {
   color: #fff;
   cursor: pointer;
 }
.user-avator {
  margin-left: 40px;


}
.user-avator img {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.user-name {
  margin-left: 10px;
  font-size:20px;

}

</style>
