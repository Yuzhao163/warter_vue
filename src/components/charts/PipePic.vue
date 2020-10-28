<template>
  <div>
    <div class="famen">
      <img src="../../assets/img/pipes/阀门3d.png" />
      <img src="../../assets/img/pipes/阀门3d.png" />
      <img src="../../assets/img/pipes/阀门3d.png" />
    </div>
    <div class="pipe">
      <img src="../../assets/img/pipes/pipe-L.png" />
      <!--      <img src="../../assets/img/pipes/pipe-25.png"/>-->
      <img id="pip1" />
      <img id="pip2" />
      <img id="pip3" />
      <img id="pip4" />
      <img src="../../assets/img/pipes/pipe-R.png" />
      <div class="message-box">
        <div class="message">
          流量：{{ pips[0].pipflow }}<br />
          流速：{{ speed }}
        </div>
        <div class="message">
          流量：{{ pips[1].pipflow }}<br />
          流速：{{ speed }}
        </div>
        <div class="message">
          流量：{{ pips[2].pipflow }}<br />
          流速：{{ speed }}
        </div>
        <div class="message">
          流量：{{ pips[3].pipflow }}<br />
          流速：{{ speed }}
        </div>
      </div>
    </div>
    <div class="setting">
      <el-form
        v-model="setVpre"
        ref="setVpre"
        label-position="right"
        label-width="50px"
        class="setForm"
      >
        <el-form-item label="阀位" prop="V_pre">
          <el-input
            type="V_pre"
            v-model="setVpre.V_pre"
            autocomplete="off"
            :placeholder="setVpre.V_pre"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item__content">
          <el-button size="mini" @click="modifyForm('setVpre')">修改</el-button>
          <el-button size="mini" type="primary" @click="submitForm('setVpre')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import pip25 from "../../assets/img/pipes/pipe-25.png";
import pip50 from "../../assets/img/pipes/pipe-50.png";
import pip75 from "../../assets/img/pipes/pipe-75.png";
import pip100 from "../../assets/img/pipes/pipe-100.png";
import pip0 from "../../assets/img/pipes/pipe-0.png";

export default {
  name: "PipePic",

  mounted() {
    this.getdata();
    this.timer = setInterval(() => {
      setTimeout(this.getdata, 0);
    }, 1000*100);
  },
  data() {
    return {
      timer: null, //定时器
      pip25: pip25,
      pip50: pip50,
      pip75: pip75,
      pip100: pip100,
      pip0: pip0,
      disabled: true, //控制文本框能否选中
      speed: "2",
      pipflow: "",
      setVpre: {
        V_pre: " "
      },
      pips: [
        {
          pipid: "1",
          pipflow: ""
        },
        {
          pipid: "2",
          pipflow: ""
        },
        {
          pipid: "3",
          pipflow: ""
        },
        {
          pipid: "4",
          pipflow: ""
        }
      ]
    };
  },
  methods: {
    getdata() {
      this.$axios.get("/getPipe").then(successResponse => {
        for (var i = 0; i < successResponse.data.length; i++) {
          for (var j = 0; j < this.pips.length; j++) {
            if (successResponse.data[i].tmnID === this.pips[j].pipid) {
              this.pips[j].pipflow = successResponse.data[i].v_per;
            }
          }
        }
        this.change_pip();
      });
    },
    submitForm() {
      this.disabled = true;
    },
    modifyForm() {
      this.disabled = false;
    },

    changepip(status) {
      if (status > 0 && status <= 25) {
        return pip25;
      }
      if (status > 25 && status <= 50) {
        return pip50;
      }
      if (status > 50 && status <= 75) {
        return pip75;
      }
      if (status > 75 && status <= 100) {
        return pip100;
      } else {
        return pip0;
      }
    },
    change_pip() {
      for (var i = 0; i < this.pips.length; i++) {
        if (this.pips[i].pipid === "1") {
          document.getElementById("pip1").src = this.changepip(
            this.pips[i].pipflow
          );
        }
        if (this.pips[i].pipid === "2") {
          document.getElementById("pip2").src = this.changepip(
            this.pips[i].pipflow
          );
        }
        if (this.pips[i].pipid === "3") {
          document.getElementById("pip3").src = this.changepip(
            this.pips[i].pipflow
          );
        }
        if (this.pips[i].pipid === "4") {
          document.getElementById("pip4").src = this.changepip(
            this.pips[i].pipflow
          );
        }
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
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
  left: 50%;
  top: 20px;
  margin-left: -400px;
  width: 100%;
  line-height: 40px;
  display: flex;
}

.message {
  width: 140px;
  margin-right: 80px;
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

</style>
