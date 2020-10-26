<template>
    <body id = "poster">
    <el-form class="login-container" label-position="left"
             label-width="0px">
        <h3 class="login_title">用户注册</h3>
        <el-form-item>
            <el-input type="text" v-model="loginForm.username"
                      auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="password" v-model="loginForm.password1"
                      auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="password" v-model="loginForm.password2"
                      auto-complete="off" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="text" v-model="loginForm.telephone"
                      auto-complete="off" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="text" v-model="loginForm.email"
                      auto-complete="off" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="regist">注册</el-button>
        </el-form-item>
        <el-form-item>
            <el-link type="text" href="/login">已经有账号？立刻登录</el-link>
        </el-form-item>
    </el-form>
    </body>
</template>

<script>
    export default {
        name: 'regist',
        data () {
            return {
                loginForm: {
                    username: 'admin',
                    password1: '123456',
                    password2: '',
                    telephone: '',
                    email: '',
                },
                responseResult: []
            }
        },
        methods: {
            regist () {
                if (this.loginForm.password1 == this.loginForm.password2){
                    this.$axios
                        .post('/regist', {
                            username: this.loginForm.username,
                            password: this.loginForm.password1,
                            telephone: this.loginForm.telephone,
                            email: this.loginForm.email
                        })
                        .then(successResponse => {
                            if (successResponse.data.code === 200) {
                                this.$router.replace({path: '/login'})
                            }
                        })
                        .catch(failResponse => {
                            alert(failResponse)
                        })
                }
                else {
                    alert("两次密码不一致，请重新输入")
                }

            }
        }
    }
</script>

<style scoped>
    .login-container {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 90px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .login_title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    #poster {
        background:url("../assets/login_wallpaper.jpg") no-repeat;
        background-position: center;
        height: 100%;
        width: 100%;
        background-size: cover;
        position: fixed;
    }
    body{
        margin: 0px;
    }
</style>