<template>
  <div class="main">
    <div class="btn-title">
      <div class="btn">
        <el-button style="width: 200px;height: 60px;font-size: 24px" type="primary" @click="check">故障检测</el-button>
        <el-button style="width: 200px;height: 60px;font-size: 24px" type="danger" @click="forecast">故障预测</el-button>
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
      if (this.if_check != true)
        this.if_check = true;
      else this.if_check = false;
      this.if_forecast = false;
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
.msg{
  height:600px;
  width: 100%;
}
.check_loading {

  position: absolute;
  width: 400px;
  height: 300px;
  left:  calc(50% - 200px);
}
.forecast_loading {

  position: absolute;
  width: 400px;
  height: 300px;
  left:  calc(50% - 200px);
}
</style>
