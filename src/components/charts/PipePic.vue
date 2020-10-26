<template>
  <div>
    <div class="famen">
      <img src="../../assets/img/pipes/阀门3d.png"/>
      <img src="../../assets/img/pipes/阀门3d.png"/>
      <img src="../../assets/img/pipes/阀门3d.png"/>
    </div>
    <div class="pipe">
      <img src="../../assets/img/pipes/pipe-L.png"/>
      <img src="../../assets/img/pipes/pipe-25.png"/>
      <img src="../../assets/img/pipes/pipe-50.png"/>
      <img src="../../assets/img/pipes/pipe-75.png"/>
      <img src="../../assets/img/pipes/pipe-100.png"/>
      <img src="../../assets/img/pipes/pipe-R.png"/>
      <div class="message-box">
        <div class="message">
          流量：{{flow}}<br>
          流速：{{speed}}
        </div>
        <div class="message">
          流量：{{flow}}<br>
          流速：{{speed}}
        </div>
        <div class="message">
          流量：{{flow}}<br>
          流速：{{speed}}
        </div>
        <div class="message">
          流量：{{flow}}<br>
          流速：{{speed}}
        </div>
      </div>
    </div>
    <div class="setting">
      <el-form v-model="setVpre" ref="setVpre" label-position="right"	  label-width="50px" class="setForm">
        <el-form-item
            label="阀位"
            prop="V_pre"
        >
          <el-input type="V_pre" v-model="setVpre.V_pre" autocomplete="off" :placeholder="setVpre.V_pre" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item__content" >
          <el-button size="mini" @click="modifyForm('setVpre')">修改</el-button>
          <el-button size="mini" type="primary" @click="submitForm('setVpre')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
export default {
  name: "PipePic",
  data() {
    return {
      disabled:true,
      // disabled:false,
      flow:'1',
      speed:'2',
      setVpre: {
        V_pre:' '
      }
    }
  },
  methods:{
    submitForm(){

      // this.$axios
      //     .post('/manage', {
      //       V_pre: this.form.V_pre,//阀位
      //            })
      this.disabled=true;

    },
    modifyForm(){
      this.disabled=false;
    }
  }
}
</script>

<style scoped>
  .famen {
    margin: 0px;
    padding: 0px;
    width: auto;
    height: 73px;
  }

  .pipe {
    position: relative;
    width: 100%;
    height: 120px;
  }

  .famen img {
    margin: 0px 56px 0px 56px;
    width: auto;
    height: 73px;
  }

  .message-box {
    position: absolute;
    left: 14%;
    top: 20px;
    width: 880px;
    line-height: 40px;
    display: flex;
    margin: auto;
  }

  .message {
    width: 140px;
    margin-right: 10%;
    /*background-color: rgba(255,255,0,0.5);*/
    font-size: 22px;

  }

  .setting {
    width: 200px;
    height: 120px;
    background-color: #93d2fa;
    margin: auto;
    border-radius: 10px;
  }

  .setForm {

    width: 200px;
    height: 120px;
  }

  .item {
    background-color: #2c3e50;
  }

  .item /deep/ .el-form-item__content {
    margin: 0px 100px 0px 0px;
    width: 200px;
    background-color: #2c3e50;
  }

  .el-form-item__content {
    margin: 0px 100px 0px 0px !important;
    width: 200px;
    background-color: #2c3e50;
  }

  /*.grid-cont-right {*/
  /*  flex: 1;*/
  /*  text-align: center;*/
  /*  font-size: 14px;*/
  /*  color: #999;*/
  /*}*/

</style>
