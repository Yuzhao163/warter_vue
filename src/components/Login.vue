<template>
  <div style="height: 100%;overflow: hidden">
    <div class="title">云端市政排水管网自动清洁系统</div>
    <div class="BOX1">
      <div class="BOX2"></div>
      <el-form class="login-container" label-position="left"
               label-width="0px">
        <h3 class="login_title">系统登录</h3>
        <el-form-item>
          <el-input type="text" v-model="loginForm.username"
                    auto-complete="off" placeholder="账号" @keyup.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="loginForm.password"
                    auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>

        <el-button type="primary" style=" width: 100%;border: none" v-on:click="login">登录</el-button>
        <el-button type="primary"
                   style=" width: 100%;background: #505458;border: none;margin-top: 20px;margin-bottom: 20px;margin-left: 0px"
                   v-on:click="register">注册
        </el-button>

      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      responseResult: []
    }
  },
  mounted() {
    this.getCookie();
  },
  methods: {
    login() {
      this.$axios
          .post('/login', {
            username: this.loginForm.username,
            password: this.loginForm.password
          })
          .then(successResponse => {
            if (successResponse.data.code === 200) {
              localStorage.setItem('ms_username', this.loginForm.username);
              this.setCookie(this.loginForm.username, this.loginForm.password, 7);
              this.$router.replace({path: '/home'})
            }
          })
          .catch(failResponse => {
            alert(failResponse)
          })
    },
    //设置cookie
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie = "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
    },
    //读取cookie
    getCookie: function () {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('='); //再次切割
          //判断查找相对应的值
          if (arr2[0] == 'userName') {
            this.loginForm.username = arr2[1]; //保存到保存数据的地方
          } else if (arr2[0] == 'userPwd') {
            this.loginForm.password = arr2[1];
          }
        }
      }
    },
    register() {
      this.$router.push("/register");
    }
  }
}

</script>

<style scoped>
#poster {
  background: url("../assets/login_wallpaper.jpg") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  transform: rotateY(180deg);
  background-size: cover;
  position: fixed;
}

.title {
  width: auto;
  height: 72px;
  font-size: 48px;
  font-weight: bolder;
  letter-spacing: 4px;
  color: #134d6e;
  line-height: 72px;

  background-color: #ebe2d2;
}

body {
  margin: 0px;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: auto auto;
  margin-top: 10%;
  width: 320px;
  padding: 35px 35px 15px 35px;
  background:rgba(255,255,255,.8);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #e3c191;
}

.login_title {
  margin: 0px auto 20px auto;
  text-align: center;
  color: #505458;
}

.logo_css {
  margin: 100px auto 0px auto;
  text-align: center;
}

.BOX1 {
  display: flex;
  height: 100%;
}

.BOX2 {
  display: block;
  width: 50%;
  height: 100%;

}
</style>
