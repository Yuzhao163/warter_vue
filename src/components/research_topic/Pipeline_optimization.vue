<template>
  <div>
    <div class="pip_view">

      <ul style="list-style: none">
        <img src=../../assets/img/pipes/pipe-L.png />
        <li v-for="(item,index) in allData" :key="item.index">
          <div style="position: relative">
            <div class="tmnname_title" >{{item.tmnname}}</div>
            <img
                @mouseenter="enter(index)"
                @mouseleave="leave"
                @mousemove="updateXY"
                :id="getForID(index)" :src="change_pip(index)"/>
          </div>
        </li>
        <img src=../../assets/img/pipes/pipe-R.png />
      </ul>
    </div>

    <!--    悬浮窗-->
    <div v-show="seen" class="showmsg" :style="positionStyle">
      控制柜ID：{{ this.boxmsg.tmnID}}<br>水位：{{ this.boxmsg.w_line}}
      <br>阀位：{{ this.boxmsg.v_per}}<br>
    </div>
  </div>
</template>

<script>
 import pip25 from "../../assets/img/pipes/25.gif";
 import pip50 from "../../assets/img/pipes/50.gif";
 import pip75 from "../../assets/img/pipes/75.gif";
 import pip100 from "../../assets/img/pipes/100.gif";
import pip0 from "../../assets/img/pipes/pipe-0.png";
 import pipL from "../../assets/img/pipes/pipe-L.png";
 import pipR from "../../assets/img/pipes/pipe-R.png";
export default {
  name: "Pipeline_optimization",
  mounted() {
    this.getdata();
    this.timer = setInterval(() => {
      setTimeout(this.getdata, 0);
    }, 1000 * 90000);
  },
  data() {
    return {
      allData: [],

      pip0: pip0,
      pip25: pip25,
      pip50: pip50,
      pip75: pip75,
      pip100: pip100,
      pipL:pipL,
      pipR:pipR,

      timer:null,
      seen: false,//控制悬浮窗是否显示
      boxmsg:{
        w_line:'',
        tmnID:'',
        v_per:'',
      },
      x: 0,
      y: 0,
      positionStyle: {top: '20px', left: '20px'},
    }
  },
  methods: {
    //向后台请求全部的数据
    getdata() {
      this.$axios.get("/getPipe").then(successResponse => {
        var list=[];
        for(var k in successResponse.data){
          list.push({
            tmnname:k,
            data:successResponse.data[k]
          })
        }
        this.allData = list;
        console.log(this.allData[0].data.w_line);
        // console.log(JSON.parse(JSON.stringify(this.allData))['昌平控制柜'])
      });
    },
    //对img标签赋予ID值 例如id=pip0
    getForID(index){

      return 'pip'+index;
    },
    //根据水为判断
    change_pip(i){
      if (this.allData[i].data.w_line > 0 && this.allData[i].data.w_line <= 25) {
        return this.pip25;
      }
      if (this.allData[i].data.w_line  > 25 && this.allData[i].data.w_line  <= 50) {
        return pip50;
      }
      if (this.allData[i].data.w_line  > 50 && this.allData[i].data.w_line  <= 75) {
        return pip75;
      }
      if (this.allData[i].data.w_line  > 75 && this.allData[i].data.w_line  <= 100) {
        return pip100;
      } else {
        return pip0;
      }
    },

    enter(index) {
        this.seen = true;
      this.boxmsg.w_line= this.allData[index].data.w_line;
      this.boxmsg.tmnID= this.allData[index].data.tmnID;
      this.boxmsg.v_per= this.allData[index].data.v_per;

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
  watch(){

  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
}
</script>

<style scoped>
.pip_view ul{
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.pip_view ul img{
  margin: 20px 0px;
}
.tmnname_title{
  width: 200px;
position: absolute;
top:-5px
}
.showmsg{
  width: auto;
  height: auto;
  position: absolute;
  background-color: #a0d3fa;
  line-height: 30px;
}
</style>
