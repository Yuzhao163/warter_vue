<template>
  <div class="mainbox">
    <div class="top">
      <div class="title">
        个人信息修改
      </div>
      <div class="userid">用户ID--{{ this.data.userID }}</div>
    </div>


    <el-form :model="data" :rules="rules" ref="data" label-width="120px" >
      <el-form-item label="用户名：" prop="userName">
        <el-input style="width: 450px" v-model="data.userName" @blur="checkName()"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="userPswd">
        <el-input style="width: 450px" v-model="data.userPswd"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名：" prop="realName">
        <el-input style="width: 450px" v-model="data.realName"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="moPhone">
        <el-input style="width: 450px" v-model="data.moPhone"></el-input>
      </el-form-item>
      <el-form-item label="单位名称：" prop="dptname">
        <el-input style="width: 450px" v-model="data.dptname"></el-input>
      </el-form-item>

    </el-form>



<!--    <div class="linetext">-->
<!--      <div style="width: 150px;line-height:40px;margin-left: 10px">用户名：</div>-->
<!--      <el-input style="width: 450px" ref="inputunm" v-model="data.userName" @blur="checkName()"></el-input>-->
<!--    </div>-->
<!--    <div class="linetext">-->
<!--      <div style="width: 150px;line-height:40px;margin-left: 10px">密码：</div>-->
<!--      <el-input style="width: 450px" ref="inputpsw" v-model="data.userPswd" show-password></el-input>-->
<!--    </div>-->
<!--    <div class="linetext">-->
<!--      <div style="width: 150px;line-height:40px;margin-left: 10px">真实姓名：</div>-->
<!--      <el-input style="width: 450px" ref="inputunm" v-model="data.realName"></el-input>-->
<!--    </div>-->
<!--    <div class="linetext">-->
<!--      <div style="width: 150px;line-height:40px;margin-left: 10px">联系电话：</div>-->
<!--      <el-input style="width: 450px" ref="inputunm" v-model="data.moPhone"></el-input>-->
<!--    </div>-->
<!--    <div class="linetext">-->
<!--      <div style="width: 150px;line-height:40px;margin-left: 10px">单位名称：</div>-->
<!--      <el-input style="width: 450px" ref="inputunm" v-model="data.dptname"></el-input>-->
<!--    </div>-->
    <div class="boxfoot">
      <el-button type="primary" plain round @click="cancel">重 置</el-button>
<!--      <el-button type="primary" plain round @click="confirm">修  改</el-button>-->
      <el-button type="primary" plain round @click="modify">修改</el-button>
    </div>
  </div>
</template>

<script>
import qs from 'qs';

export default {
  name: "UserMessage",
  data() {
    return {
      data: [],
      rules: {
        userName:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
        ],
        userPswd:[
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min:6, max:15, message: '长度在6到15位之间', trigger: 'blur'}
        ],
        realName:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
        ],
        moPhone:[],
        dptname:[]
      },
      resnumber:'',//记录是否更新成功
      ModTime: '',

      // 记录用户名修改是否合法
      flag:1,
    }
  },
  mounted() {
    this.getmessage();
  },
  methods: {
    getmessage() {
      var param = qs.stringify({
        // 把当前用户存入并传到后端去
        UserName: this.$store.state.users.username,
      })
      this.$axios
          .post('/getUserMessage', param).then(res => {
        this.data = res.data[0];
        console.log(this.data)
      }).catch(() => {
      })
    },
    cancel(){
      this.getmessage();
    },
    //用于解决异步问题 判断成功与否
    checknum(){
      if(this.resnumber==200){
        console.log('ss'+this.resnumber)
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        // console.log(this.$store.state.users.username);
        this.getmessage();
      }
    },


    // 失去焦点判断用户修改的名称是否有效
    checkName() {
      console.log("登录人：",this.$store.state.users.username)
      if (this.data.userName === this.$store.state.users.username) {
        // 用户名称没有变化 可以直接进行修改操作
        this.flag=1
      } else {
        // 用户名称发生变化 判断修改后的用户名称是否有重复
        var params = qs.stringify({
          userID: this.data.userID,
          userName: this.data.userName
        })
        console.log(params)
        // this.$message.error("不 可以直接操作")
        this.$axios.post(`/checkUserName`,params)
          .then(res => {
            console.log(res)
            console.log(res.data)
            if (res.data === 201) {
              this.$message.error('该用户名已存在')
              this.flag=0
            } else {
              this.$message.success('该用户名可以使用')
              this.flag=1
            }
          })
      }

    },

    // 修改用户信息
    modify() {
      console.log(this.data)
      // 判断用户是否进行用户名称的修改
      // 如果没有修改 就直接进行更新
      // 如果修改了 判断用户名称是否存在

      // 判断flag=1? 等于直接更新 不等于进行报错
      if (this.flag === 0) {
        this.$message.error('请重新设置用户名')
      } else {
        var params = qs.stringify({
          UserID: this.data.userID,
          UserName: this.data.userName,
          UserPswd: this.data.userPswd,
          MoPhone: this.data.moPhone,
          RealName: this.data.realName,
          DPTName: this.data.dptname,
          ModTime: this.data.ModTime
        });
        this.$confirm('确定要修改您的信息？(请牢记您的密码)', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
        const {data: res} = await this.$axios.post(`/updateUserInfo`,params);
        if (res == 201) {
          this.$message.error("该用户名已存在")
        } else if (res == 200) {
          this.$message.success("更新成功")
          this.$store.state.users.username=this.data.userName;
          window.localStorage.setItem('ms_username',JSON.stringify(this.data.userName))
          this.$store.state.users.password=this.data.userPswd;
          this.flag = 1
        } else {
          this.$message.error("更新失败")
        }
        this.getmessage();
      }
      )}
    },
  }
}
</script>

<style scoped>
.mainbox {
  width: 650px;
  border-radius: 20px;
  background-color: #ffffff;
  margin: 0 auto;
  overflow: hidden
}

.top {


}

.title {
  display: flex;
  font-size: 24px;
  font-weight: bolder;
  margin: 10px 0 10px 10px;
}

.userid {
  size: 12px;
  display: flex;
  color: #616180;
  font-weight: bolder;
  margin: 10px 0 10px 15px;
}

.linetext {
  display: flex;
  margin: 20px 0;

}
.boxfoot {
  margin: 20px;
}

/deep/ .el-input.is-disabled .el-input__inner {
  color: black;
}

/deep/ .el-form-item__error {
  padding-left:50px
}

</style>
