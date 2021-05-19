<template>
  <div class="main">
    <div class="btn-title">
      <div class="btn">
        <el-button style="width: 200px;height: 60px;font-size: 24px" type="primary" @click="check">故障检测</el-button>
<!--        <el-button style="width: 200px;height: 60px;font-size: 24px" type="danger" @click="forecast">故障预测</el-button>-->
      </div>
    </div>
    <div class="msg">
      <div class="check_loading"
           v-loading="if_check"
           element-loading-text="正在诊断当前管路状态..."
           element-loading-spinner="el-icon-loading">
      </div>
      <div class="forecast_loading"
           v-loading="if_forecast"
           element-loading-text="正在预测高概率故障部位..."
           element-loading-spinner="el-icon-loading">
      </div>
    </div>
    <el-dialog
        style="text-align: left"
        title="故障诊断结果"
        :visible.sync="dialogVisible"
        width="30%"
       >
      <span>共检测{{ this.faultnummsg.faultnum }}条数据<br><span
          style="color: red">严重</span>{{ this.faultnummsg.yanzhong }}条<br><span
          style="color: orange">紧急</span>{{ this.faultnummsg.jinji }}条<br><span
          style="color: cornflowerblue">轻微</span>{{ this.faultnummsg.jinggao }}条</span><br><span>请及时处理！</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
// import tmn from '../../assets/img/logo.png'
export default {
  mounted() {
  },
  name: "Fault_diagnosis",
  data() {
    return {
      faultnummsg: {},
      timer:null,
      dialogVisible: false,
      tmndata: [{tmnName: '一号柜'}, {tmnName: '二号柜'}, {tmnName: '三号柜'}, {tmnName: '三号柜'},
        {tmnName: '三号柜'}, {tmnName: '三号柜'}, {tmnName: '三号柜'}, {tmnName: '三号柜'}, {tmnName: '三号柜'}, {tmnName: '三号柜'}],
      if_check: false,
      if_forecast: false,
    }
  },
  methods: {
    getdata() {
      var param = qs.stringify(this.$store.state.users.username)
      this.$axios.post('/请求tmn数据', param).then(res => {
        this.tmndata = res;
      }).catch(failResponse => {
        alert(failResponse)
      })

    },
    //故障检测
     check() {
      this.if_check = true;

      this.$axios.post('/getAllMessageToException').then(res => {
        clearTimeout(this.timer);  //清除延迟执行
        this.timer = setTimeout(()=>{   //设置延迟执行
          this.if_check = false;
          this.faultnummsg = res.data[0];
          this.faultnummsg.faultnum = this.faultnummsg.jinggao + this.faultnummsg.jinji + this.faultnummsg.yanzhong;
          console.log(this.faultnummsg)

          this.dialogVisible = true;
        },3000);




      }).catch(failResponse => {
        alert(failResponse)
      })

    },
    //故障预测
    forecast() {
      this.if_check = false;
      if (this.if_forecast != true)
        this.if_forecast = true;
      else this.if_forecast = false;
    },

  }
}
</script>

<style scoped>
.main {
  width: 100%;
  height: 700px;
  display: inline-block;
  background-color: #ffffff;
  border-radius: 20px;
}

.btn-title {
  display: flex;
  width: 100%;
  height: 100px;
  background-color: #99b6cd;
  border-radius: 20px 20px 0px 0px;
}

.btn {
  align-items: center;
  display: flex;
  margin: auto 25px;
}

.msg {
  height: 600px;
  width: 100%;
}

.check_loading {

  position: absolute;
  width: 400px;
  height: 300px;
  left: calc(50% - 200px);
}

.forecast_loading {

  position: absolute;
  width: 400px;
  height: 300px;
  left: calc(50% - 200px);
}
</style>
