<template>
  <div class="mainbox">
    <div class="top">
      <div class="title">
        个人信息修改
      </div>
      <div class="userid">用户ID--{{ this.data.userID }}</div>
    </div>
    <div class="linetext">
      <div style="width: 150px;line-height:40px;margin-left: 10px">用户名：</div>
      <el-input ref="inputunm" v-model="data.userName" :disabled="this.disabled.disabledunm"></el-input>
      <div style="width: 100px;line-height:40px;">
        <el-button type="primary" size="small" round @click="modifyunm">修改</el-button>
      </div>
    </div>
    <div class="linetext">
      <div style="width: 150px;line-height:40px;margin-left: 10px">密码：</div>
      <el-input ref="inputpsw" v-model="data.userPswd" :disabled="this.disabled.disabledpsw"
                show-password></el-input>
      <div style="width: 100px;line-height:40px;">
        <el-button type="primary" size="small" round @click="modifypsw">修改</el-button>
      </div>
    </div>
    <div class="linetext">
      <div style="width: 150px;line-height:40px;margin-left: 10px">真实姓名：</div>
      <el-input ref="inputunm" v-model="data.realName" :disabled="this.disabled.disabledrn"></el-input>
      <div style="width: 100px;line-height:40px;">
        <el-button type="primary" size="small" round @click="modifyrn">修改</el-button>
      </div>
    </div>
    <div class="linetext">
      <div style="width: 150px;line-height:40px;margin-left: 10px">联系电话：</div>
      <el-input ref="inputunm" v-model="data.moPhone" :disabled="this.disabled.disabledph"></el-input>
      <div style="width: 100px;line-height:40px;">
        <el-button type="primary" size="small" round @click="modifyph">修改</el-button>
      </div>
    </div>
    <div class="linetext">
      <div style="width: 150px;line-height:40px;margin-left: 10px">单位名称：</div>
      <el-input ref="inputunm" v-model="data.dptname" :disabled="this.disabled.disableddpt"></el-input>
      <div style="width: 100px;line-height:40px;">
        <el-button type="primary" size="small" round @click="modifydpt">修改</el-button>
      </div>
    </div>
    <div class="boxfoot">
      <el-button type="primary" plain round @click="confirm">提交</el-button>
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
      disabled: {
        disabledunm: true,
        disabledpsw: true,
        disabledrn: true,
        disabledph: true,
        disableddpt: true,
      },
    }
  },
  mounted() {
    this.getmessage();
  },
  methods: {
    getmessage() {
      console.log('111111111111' + this.$store.state.users.username)
      var param = qs.stringify({
        UserName: this.$store.state.users.username,
      })
      this.$axios
          .post('/getUserMessage', param).then(res => {
        this.data = res.data[0];
        console.log(this.data)
      }).catch(() => {
      })
    },
    modifyunm() {
      if (this.disabled.disabledunm == true) {
        this.disabled.disabledunm = false;
      } else {
        this.disabled.disabledunm = true;
      }
    },
    modifypsw() {
      if (this.disabled.disabledpsw == true) {
        this.disabled.disabledpsw = false;
      } else {
        this.disabled.disabledpsw = true;
      }
    },
    modifyrn() {
      if (this.disabled.disabledrn == true) {
        this.disabled.disabledrn = false;
      } else {
        this.disabled.disabledrn = true;
      }
    },
    modifyph() {
      if (this.disabled.disabledph == true) {
        this.disabled.disabledph = false;
      } else {
        this.disabled.disabledph = true;
      }
    },
    modifydpt() {
      if (this.disabled.disableddpt == true) {
        this.disabled.disableddpt = false;
      } else {
        this.disabled.disableddpt = true;
      }
    },
    //用于解决异步问题 判断成功与否
    checknum(){
      if(this.resnumber==200){
        console.log('ss'+this.resnumber)
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        console.log(this.$store.state.users.username);
        this.getmessage();
      }
    },
    confirm() {
      this.$confirm('确定要修改您的信息？(请牢记您的密码)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = qs.stringify({

          UserID: this.data.userID,
          UserName: this.data.userName,
          UserPswd: this.data.userPswd,
          UClassID: this.data.uclassID,
          MoPhone: this.data.moPhone,
          RealName: this.data.realName,
          DPTName: this.data.dptname,
        });
        this.$axios
            .post('/updstaff', params).then(res => {
              this.resnumber=res.data.code;
              this.$store.state.users.username=this.data.userName;
              window.localStorage.setItem('ms_username',JSON.stringify(this.data.userName))
              this.$store.state.users.password=this.data.userPswd;
          console.log(this.resnumber)
          this.checknum();
              })


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    }
  }
}
</script>

<style scoped>
.mainbox {
  width: 600px;
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
