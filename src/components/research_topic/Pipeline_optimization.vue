<template>
  <div>
    <button v-on:click="test()"></button>
    <div class="pip_view"
         v-loading="loading"
         element-loading-text="管路状态加载中..."
         element-loading-spinner="el-icon-loading"
         >

      <ul style="list-style: none">
        <img src=../../assets/img/pipes/pipe-L.png />
        <li v-for="(item,index) in allData" :key="item.index">
          <div style="position: relative">
            <div class="tmnname_title" >---{{item.tmnname}}---</div>
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
    <el-switch
        v-model="chartswitch"
        active-text="动态数据"
        inactive-text="暂停数据"
        @change="this.c_switch">
    </el-switch>
    <div class="charts" id="main">
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
 import qs from 'qs';
 import * as echarts from 'echarts';
export default {
  name: "Pipeline_optimization",
  mounted() {
    this.getdata();
    this.timer = setInterval(() => {
      setTimeout(this.getdata, 0);
    }, 1000 * 1);


  },
  data() {
    return {
      allData: [],
      loading:true,

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


      chartswitch:true,
      option : {
        title: {
          text: '水流量折线图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top:20,
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          // data:[0,25,50,75,100],
          boundaryGap: [0, '100%'],
          max: 100,
        },
        series: []
      },
    }
  },
  methods: {
    //向后台请求全部的数据
    getdata() {
      var param=qs.stringify({UserName:this.$store.state.users.username})
      this.$axios.post("/getpipebyusername",param).then(successResponse => {
        var list=[];
        var i=0;
        for(var k in successResponse.data){
          list.push({
            tmnname:k,
            data:successResponse.data[k]
          });
          this.option.series.push({
            name: k,
            type: 'line',
            data: []
          })
          this.option.legend.data.push(k)
          console.log(i)
          this.option.series[i].data.push(successResponse.data[k].w_line)

          i++;
        }
        this.allData = list;
        this.loading=false;
        this.setchartdate();

        this.linechart();
        // console.log(JSON.parse(JSON.stringify(this.allData))['昌平控制柜'])
      });
    },
    //对图表时间赋值
    setchartdate(){

      let date = new Date();
      let dateYear = date.getFullYear();             //获取年
      let dateMonth = date.getMonth();               //获取月
      let dateDate = date.getDate();                 //获取当日
      let dateHours = date.getHours();               //获取小时
      let dateMinutes = date.getMinutes();           //获取分钟
      let dateSeconds = date.getSeconds();
      var time=dateYear+'/'+dateMonth+'/'+dateDate+' '+dateHours+':'+dateMinutes+':'+dateSeconds;
      console.log(time)
      this.option.xAxis.data.push(time)
      if(this.option.xAxis.data.length>10)
      {
        this.$delete(this.option.xAxis.data,0)
      }
    },
   c_switch(){
    if(this.chartswitch==true){
      this.timer = setInterval(() => {
        setTimeout(this.getdata, 0);
      }, 1000 * 1);
    }else {
      clearInterval(this.timer);
    }
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
    },

    //统计图
    linechart(){
      var chartDom = document.getElementById('main');
      var myChart = echarts.init(chartDom);



      myChart.setOption(this.option);

    },

test(){
 console.log(this.allData)
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
:hover .pip_view ul img{

}
.tmnname_title{
  width: 200px;
position: absolute;
top:-5px;
  font-size: 24px;
}
.showmsg{
  width: auto;
  height: auto;
  position: absolute;
  background-color: #a0d3fa;
  line-height: 30px;
}
.charts{
  width: 800px;
  height: 800px;
}
</style>
