<template>
  <div class="mainbox">
    <div class="top">
      <div class="title">
        个人信息修改
      </div>
      <div class="userid">用户ID--{{ this.data.userID }}</div>
    </div>
    <div class="linetext">
      <div style="width: 10px; color: red;font-size: 15px;margin-left: 30px; margin-top: 10px">*</div>
      <div style="width: 80px;line-height:40px">用户名：</div>
      <el-input style="width: 450px" ref="inputunm" v-model="data.userName" ></el-input>
    </div>
    <div class="linetext">
      <div style="width: 10px; color: red;font-size: 15px;margin-left: 30px; margin-top: 10px">*</div>
      <div style="width: 80px;line-height:40px">密码：</div>
      <el-input style="width: 450px" ref="inputpsw" v-model="data.userPswd" show-password></el-input>
    </div>
    <div class="linetext">
      <div style="width: 10px; color: red;font-size: 15px;margin-left: 30px; margin-top: 10px">*</div>
      <div style="width: 80px;line-height:40px">真实姓名：</div>
      <el-input style="width: 450px" ref="inputunm" v-model="data.realName"></el-input>
    </div>
    <div class="linetext">
      <div style="width: 10px; color: red;font-size: 15px;margin-left: 30px; margin-top: 10px">*</div>
      <div style="width: 80px;line-height:40px">联系电话：</div>
      <el-input style="width: 450px" ref="inputunm" v-model="data.moPhone"></el-input>
    </div>
    <div class="linetext">
      <div style="width: 10px; color: red;font-size: 15px;margin-left: 30px; margin-top: 10px">*</div>
      <div style="width: 80px;line-height:40px">单位名称：</div>
      <el-input style="width: 450px" ref="inputunm" v-model="data.dptname"></el-input>
    </div>
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
      resnumber:'',//记录是否更新成功
      ModTime: '',
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


    // 修改用户信息
    async modify() {
      console.log(this.data)

      // 判断用户是否进行用户名称的修改
      // 如果没有修改 就直接进行更新
      // 如果修改了 判断用户名称是否存在

      // var param=qs.stringify({userName: this.data.userName})
      // const {data: res1} = await this.$axios.post(`/checkUserName`,param);
      // if (res1==201) {
      //   this.$message.error("该用户名已存在")
      // } else {
      if (this.data.userName == '') {
        this.$message.error("用户名称不能为空")
      } else if (this.data.userPswd == '') {
        this.$message.error("用户密码不能为空")
      } else if (this.data.realName == ''){
        this.$message.error("真实姓名不能为空")
      } else if(this.data.moPhone == '') {
        this.$message.error("手机号码不能为空")
      } else if (this.data.dptname =='') {
        this.$message.error("单位名称不能为空")
      } else {
        this.$confirm('此操作将修改您的个人信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          var params = qs.stringify({
            UserID: this.data.userID,
            UserName: this.data.userName,
            UserPswd: this.data.userPswd,
            MoPhone: this.data.moPhone,
            RealName: this.data.realName,
            DPTName: this.data.dptname,
            ModTime: this.data.ModTime
          });
          const {data: res} = await this.$axios.post(`/updateUserInfo`,params);
          if (res == 201) {
            this.$message.error("该用户名已存在")
          } else if (res == 200) {
            this.$message.success("更新成功")
            this.$store.state.users.username=this.data.userName;
            window.localStorage.setItem('ms_username',JSON.stringify(this.data.userName))
            this.$store.state.users.password=this.data.userPswd;
          } else {
            this.$message.error("更新失败")
          }
          this.getmessage();
        }).catch(()=>{
          this.$message.info("已取消修改个人信息")
          this.getmessage()
        })
      }

    },

    // confirm() {
    //   console.log(this.data)
    //   this.$confirm('确定要修改您的信息？(请牢记您的密码)', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     console.log("确认")
    //     var params = qs.stringify({
    //       UserID: this.data.userID,
    //       UserName: this.data.userName,
    //       UserPswd: this.data.userPswd,
    //       UClassID: this.data.uclassID,
    //       MoPhone: this.data.moPhone,
    //       RealName: this.data.realName,
    //       DPTName: this.data.dptname,
    //     });
    //     // console.log(params)
    //
    //
    //
    //     this.$axios
    //         .post('/updstaff', params).then(res => {
    //           this.resnumber=res.data.code;
    //           this.$store.state.users.username=this.data.userName;
    //           window.localStorage.setItem('ms_username',JSON.stringify(this.data.userName))
    //           this.$store.state.users.password=this.data.userPswd;
    //       console.log(this.resnumber)
    //       this.checknum();
    //           })
    //   })
    //   //         .catch(() => {
    //   //   this.$message({
    //   //     type: 'info',
    //   //     message: '已取消修改'
    //   //   });
    //   // });
    // }
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

</style>
