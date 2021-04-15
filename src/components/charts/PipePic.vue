<template>
  <div>
    <div style="position: absolute">
      <div class="opall" v-on:click="openall">一键开阀</div>
    </div>
    <!--    1-5阀门和管道-->
    <div class="famen">
<!--      <div class="tmnname_1">-->
<!--        <ul v-for="(item,key) in this.pips.slice(0,5)" :key="key" style="list-style: none;">-->
<!--          <li>{{ item.tmnname }}</li>-->
<!--        </ul>-->
<!--      </div>-->
      <ul>
        <li
            v-for="(item, index) in v_pershow.slice(0,4)"
            :key="index"
            @mouseenter="enter(index,1)"
            @mouseleave="leave"
            @mousemove="updateXY"
        >
          <img src="../../assets/img/pipes/阀门3d.png"/>

        </li>
      </ul>
    </div>
    <div class="pipe">
      <img src="../../assets/img/pipes/pipe-L.png"/>
      <div class="imgbox">
        <img id="pip1"/>
        <div class="tmntext">--{{ this.pips[0].tmnname }}--</div>
        <div class="message">
          水位：{{ pips[0].pipflow }}<br/>
          流速：{{ speed }}
        </div>
      </div>
      <div class="imgbox"><img id="pip2"/>
        <div class="tmntext">--{{ this.pips[1].tmnname }}--</div>
        <div class="message">
          水位：{{ pips[1].pipflow }}<br/>
          流速：{{ speed }}
        </div>
      </div>
      <div class="imgbox"><img id="pip3"/>
        <div class="tmntext">--{{ this.pips[2].tmnname }}--</div>
        <div class="message">
          水位：{{ pips[2].pipflow }}<br/>
          流速：{{ speed }}
        </div>
      </div>
      <div class="imgbox"><img id="pip4"/>
        <div class="tmntext">--{{ this.pips[3].tmnname }}--</div>
        <div class="message">
          水位：{{ pips[3].pipflow }}<br/>
          流速：{{ speed }}
        </div>
      </div>
      <div class="imgbox"><img id="pip5"/>
        <div class="tmntext">--{{ this.pips[4].tmnname }}--</div>
        <div class="message">
          水位：{{ pips[4].pipflow }}<br/>
          流速：{{ speed }}
        </div>
      </div>
      <img src="../../assets/img/pipes/pipe-R.png"/>
    </div>

    <!--    6-10阀门和管道-->
    <div class="famen">
      <ul>
        <li id="famen2"
            v-for="(item, index) in v_pershow.slice(4,8)"
            :key="index"
            @mouseenter="enter(index,2)"
            @mouseleave="leave"
            @mousemove="updateXY"
        >
          <img src="../../assets/img/pipes/阀门3d.png"/>

        </li>
      </ul>
    </div>
    <div class="pipe">
      <img src="../../assets/img/pipes/pipe-L.png"/>
      <div class="imgbox"><img id="pip6"/>
        <div class="tmntext">--{{ this.pips[4].tmnname }}--</div>
        <div class="message">
          水位：{{ pips[4].pipflow }}<br/>
          流速：{{ speed }}
        </div>
      </div>
      <div class="imgbox"><img id="pip7"/>
        <div class="tmntext">--{{ this.pips[5].tmnname }}--</div>
        <div class="message">
          水位：{{ pips[5].pipflow }}<br/>
          流速：{{ speed }}
        </div>
      </div>
      <div class="imgbox"><img id="pip8"/>
        <div class="tmntext">--{{ this.pips[6].tmnname }}--</div>
        <div class="message">
          水位：{{ pips[6].pipflow }}<br/>
          流速：{{ speed }}
        </div>
      </div>
      <div class="imgbox"><img id="pip9"/>
        <div class="tmntext">--{{ this.pips[7].tmnname }}--</div>
        <div class="message">
          水位：{{ pips[7].pipflow }}<br/>
          流速：{{ speed }}
        </div>
      </div>
      <div class="imgbox"><img id="pip10"/>
        <div class="tmntext">--{{ this.pips[8].tmnname }}--</div>
        <div class="message">
          水位：{{ pips[8].pipflow }}<br/>
          流速：{{ speed }}
        </div>
      </div>
      <img src="../../assets/img/pipes/pipe-R.png"/>

    </div>

    <!--    调整阀度按钮-->
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
        <el-form-item class="item">
          <el-button size="mini" @click="modifyForm('setVpre')">修改</el-button>
          <el-button size="mini" type="primary" @click="submitForm('setVpre')"
          >提交
          </el-button
          >
        </el-form-item>
      </el-form>
    </div>
<!--    <div class="tmnname_2">-->
<!--      <ul v-for="(item,key) in this.pips.slice(4,9)" :key="key" style="list-style: none;">-->
<!--        <li>{{ item.tmnname }}</li>-->
<!--      </ul>-->
<!--    </div>-->

    <!--    一键开阀-->
    <el-button type="danger" round v-on:click="openall">一键开阀</el-button>
    <!--    悬浮窗-->
    <div v-show="seen" class="showvper" :style="positionStyle">
      管线id： {{ t_vper.id }}<br>
      阀位： {{ t_vper.vper }}
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
    this.change_pip();
    this.getdata();
    this.timer = setInterval(() => {
      setTimeout(this.getdata, 0);
    }, 1000 * 900);
  },
  data() {
    return {
      allData: '',
      seen: false,//控制悬浮窗是否显示
      timer: null, //定时器
      x: 0,
      y: 0,
      positionStyle: {top: '20px', left: '20px'},
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
      //用于显示漂浮窗
      t_vper: {
        id: '',
        vper: '',
      },
      v_pershow: [
        {
          v_perid: '1',
          v_per: ""
        },
        {
          v_perid: '2',
          v_per: ""
        },
        {
          v_perid: '3',
          v_per: ''
        },
        {
          v_perid: '4',
          v_per: ''
        },
        {
          v_perid: '5',
          v_per: ''
        },
        {
          v_perid: '6',
          v_per: ''
        },
        {
          v_perid: '7',
          v_per: ''
        },
        {
          v_perid: '8',
          v_per: ''
        },

      ]
      ,
      pips: [
        {
          pipid: "1",
          pipflow: "",
          tmnname: ''
        },
        {
          pipid: "2",
          pipflow: "",
          tmnname: ''
        },
        {
          pipid: "3",
          pipflow: "",
          tmnname: ''
        },
        {
          pipid: "4",
          pipflow: "",
          tmnname: ''
        }, {
          pipid: "5",
          pipflow: "",
          tmnname: ''
        }, {
          pipid: "6",
          pipflow: "",
          tmnname: ''
        }, {
          pipid: "7",
          pipflow: "",
          tmnname: ''
        }, {
          pipid: "8",
          pipflow: "",
          tmnname: ''
        }, {
          pipid: "9",
          pipflow: "",
          tmnname: ''
        }, {
          pipid: "10",
          pipflow: "",
          tmnname: ''
        }
      ]
    };
  },
  methods: {
    getdata() {
      this.$axios.get("/getPipe").then(successResponse => {
        this.allData = successResponse.data
        for (var k in this.allData) {
          for (var j = 0; j < this.pips.length; j++) {
            if (this.allData[k].tmnID === this.pips[j].pipid) {
              this.pips[j].pipflow = this.allData[k].w_line;
              this.pips[j].tmnname = k;
              console.log(this.pips[j].tmnname)
            }
          }
          for (var i = 0; i < this.v_pershow.length; i++) {
            if (this.allData[k].tmnID === this.v_pershow[i].v_perid) {
              this.v_pershow[i].v_per = this.allData[k].v_per;
            }
          }


        }
        // for (var i = 0; i < successResponse.data.length; i++) {
        //   for (var j = 0; j < this.pips.length; j++) {
        //     if (successResponse.data[i].tmnID === this.pips[j].pipid) {
        //       this.pips[j].pipflow = successResponse.data[i].w_line;//存水流量
        //       // this.v_pershow[j].v_per = successResponse.data[i].v_per;
        //     }
        //   }
        //   for (var k = 0; k < this.v_pershow.length; k++) {
        //     if (successResponse.data[i].tmnID === this.v_pershow[k].v_perid) {
        //       this.v_pershow[k].v_per = successResponse.data[i].v_per;//存阀位
        //       // this.v_pershow[j].v_per = successResponse.data[i].v_per;
        //     }
        //   }
        // }
        this.change_pip();

      });
    },
    submitForm() {
      this.disabled = true;
    },
    modifyForm() {
      this.disabled = false;
    },
    //判断显示的图片
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
    //切换图片
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
        if (this.pips[i].pipid === "5") {
          document.getElementById("pip5").src = this.changepip(
              this.pips[i].pipflow
          );
        }
        if (this.pips[i].pipid === "6") {
          document.getElementById("pip6").src = this.changepip(
              this.pips[i].pipflow
          );
        }
        if (this.pips[i].pipid === "7") {
          document.getElementById("pip7").src = this.changepip(
              this.pips[i].pipflow
          );
        }
        if (this.pips[i].pipid === "8") {
          document.getElementById("pip8").src = this.changepip(
              this.pips[i].pipflow
          );
        }
        if (this.pips[i].pipid === "9") {
          document.getElementById("pip9").src = this.changepip(
              this.pips[i].pipflow
          );
        }
        if (this.pips[i].pipid === "10") {
          document.getElementById("pip10").src = this.changepip(
              this.pips[i].pipflow
          );
        }

      }
    },
    //一键开阀
    openall() {
      this.$confirm('此操作将完全开启辖区内全部阀门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '开启成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '开阀取消！'
        });
      });
    },
    enter(index, a) {
      this.seen = true;
      if (a == 1) {
        this.t_vper.id = this.v_pershow[index].v_perid;
        this.t_vper.vper = this.v_pershow[index].v_per;
      }
      if (a == 2) {
        this.t_vper.id = this.v_pershow[index + 4].v_perid;
        this.t_vper.vper = this.v_pershow[index + 4].v_per;
      }


    },
    leave() {
      this.seen = false;
    },
    updateXY(event) {
      this.x = event.clientX;
      this.y = event.clientY;
      this.positionStyle = {top: this.y + 'px', left: this.x + 20 + 'px'};
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style scoped>
.tmntext{
  position: absolute;
  left:-10px; right:0; top:-20px; bottom:0;
  margin:auto;
font-size: 22px;
}

.famen {
  position: relative;
  display: flex;
  margin-left: 174px;
  padding: 0px;
  width: auto;
  height: 73px;
}
.famen img {
  margin: 0px 56px 0px 56px;

  height: 73px;
}
.famen ul {
  list-style: none;
  margin-top: 0px;
  margin-left: 0px;
  padding-left: 0px;
  display: flex;
}

.famen ul li {
  display: inline;
}

.pipe {
  position: relative;
  display: flex;

  height: 120px;
}

.pipe img {
  display: inline-block;
}



.imgbox {
  position: relative;
  width: 220px;
  height: 120px;
  display: inline-block;

}


.message {
  position: absolute;
  top: 0px;
  left: 40px;
  height: 120px;
  font-size: 28px;
  line-height: 60px;
}

.setting {
  width: 200px;
  height: 120px;
  background-color: #93d2fa;
  margin: 10PX auto;
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
  margin: 0px 100px 0px 0px !important;
  width: 200px;
  background-color: #c6eafd;
}

.showvper {
  width: auto;
  height: auto;
  position: absolute;
  background-color: #a0d3fa;
  line-height: 30px;
}

.el-form-item__content {
  width: 200px;
  background-color: #2c3e50;
}

.opall {
  position: absolute;
  top:-10px;
  left: 20px;
  width: 80px;
  height: 80px;
  background-color: #ff6363;
  border-radius: 50px;
  font-size: 18px;
  color: #E5F1F6;
  text-align: inherit;
  line-height: 80px;
  z-index: 10;
  cursor: pointer;
  box-shadow: 0px 0px 10px 1px #ff4343;
}

:hover.opall {
  position: absolute;

  left: 20px;
  width: 80px;
  height: 80px;
  background-color: #ff9999;
  border-radius: 50px;
  font-size: 18px;
  color: #ffffff;
  text-align: inherit;
  line-height: 80px;
  z-index: 10;
  cursor: pointer;
  box-shadow: 0px 0px 10px 2px #ff9999;
}
</style>
