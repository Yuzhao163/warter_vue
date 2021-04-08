<template>
  <div class="maindiv">
    <button @click="test">test</button>
    <div class="select">
      <el-select class="selecttext" v-model="sarea" @change="getPipeData">
        <el-option
            v-for="item in areadata"
            :key="item.areaID"
            :label="item.areaName"
            :value="item.areaName"
        >
        </el-option>
      </el-select>
      <el-select class="selecttext" v-model="spipe.pipName" @change="getTmnData">
        <el-option
            v-for="item in pipedata"
            :key="item.pipID"
            :label="item.pipName"
            :value="item.pipName">
        </el-option>
      </el-select>
    </div>
<!--    <div class="card">-->
<!--      <div>-->
<!--        <el-tabs v-model="area" type="card" @tab-click="handleClick">-->
<!--          <el-tab-pane v-for="item in areas" :label="item.AreaName" :key="item.AreaName"-->
<!--                       :name="item.index"></el-tab-pane>-->
<!--        </el-tabs>-->
<!--      </div>-->
<!--      <div>-->
<!--        <el-tabs v-model="pipe" type="card" @tab-click="handleClick">-->
<!--          <el-tab-pane v-for="item in areas[area].pipes" :label="item.PipName" :key="item.PipName"-->
<!--                       :name="item.index"></el-tab-pane>-->
<!--        </el-tabs>-->
<!--      </div>-->
<!--    </div>-->
    <div class="linetitle">
      <span id="1">{{ this.sarea }}</span><span style="color:#4290d0 ">---</span><span
        id="2">{{ this.spipe.pipName }}</span>
      控制柜分布情况:
    </div>
    <div class="TmnLine">
      <div class="pictext" v-for="item in tmndata" :key="item.value">
        <div class="TmnPic"></div>
        <div class="TmnText">{{ item }}</div>

      </div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
import qs from "qs";

export default {
  name: "AreaPipe",
  mounted() {
    this.getAreaData()
  },
  data() {
    return {
      area: '0',//存选择的分区index
      pipe: '0',//存选择的管线index
      areadata: [],
      pipedata: [],
      tmndata: [],
      sarea: '',//暂存区域选择框数据
      spipe: {
        pipName:'',
        pipID:''
      },//暂存管线选择框数据

    }

  },
  methods: {
    getAreaData() {
      this.$axios.post("/getAreas").then(res => {
        console.log("请求成功")
        console.log(res.data[0])
        this.areadata = res.data;
        this.sarea = this.areadata[0].areaName
        this.getPipeData()
      })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },
    getPipeData() {
      var params = qs.stringify({AreaName: this.sarea})
      this.$axios.post("/getPipes", params).then(res => {
        console.log("请求成功")
        console.log(res.data[0])
        this.pipedata = res.data;
        this.spipe.pipName = this.pipedata[0].pipName
        this.spipe.pipID = this.pipedata[0].pipID
        this.getTmnData()
      })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    }, getTmnData() {
      for(var i=0;i<this.pipedata.length;i++)
      {
        if(this.spipe.pipName==this.pipedata.pipName)
          this.spipe.pipID=this.pipedata.pipID
      }
      var params = qs.stringify({
        PipID: this.spipe.pipID
      })
      this.$axios.post("/getTerminals", params).then(res => {
        console.log("请求成功")
        console.log(res.data)
        this.tmndata = res.data;
      })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },
    handleClick() {

    },
    test() {
      console.log(this.$store.state.users)
      console.log(this.sarea);
      console.log(this.spipe)
    }
  }
}
</script>

<style scoped>
.maindiv {
  background-color: #ffffff;
  border-radius: 20px;
  border: #899eac solid 1px;
padding-bottom: 160px;
}
.select{
  display: flex;
}
.selecttext{
  margin-left: 20px;
}
.card {
  /*border: #3D7797 solid 1px;*/
}

.linetitle {
  display: flex;
  margin-left: 20px;
  text-align: center;
  line-height: 40px
}

span {
  font-size: 18px;
  color: #fd8c10;
}

.TmnLine {
  position: relative;
  margin: 30px 0;
}

.line {
  position: absolute;
  top: 9px;
  left: 50%;
  margin-left: -400px;
  height: 6px;
  width: 800px;
  background-color: #4290d0;
  border-radius: 3px;
}

.pictext {
  display: inline-block;
  position: relative;
  margin: 0 10px 0 10px;
}

.TmnPic {
  position: relative;
  height: 20px;
  width: 20px;
  margin: 0 auto 0 auto;
  background-color: #fdc072;
  border-radius: 12px;
  border: 2px solid #7293c4;
  z-index: 10;
}

.TmnText {
position: absolute;
}

ul {
  display: flex;
}

ul li {
  margin-left: 20px;
}
</style>
