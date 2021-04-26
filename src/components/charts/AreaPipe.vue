<template>
  <div class="maindiv">
    <div class="block">
      <span class="demonstration">默认 click 触发子菜单</span>
      <el-cascader
          v-model="value"
          :options="tree"
          @change="handleChange"></el-cascader>
    </div>
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
      <span id="1">{{ this.sarea }}</span><span style="color:#4290d0 ">分区</span><span
        id="2">{{ this.spipe.pipName }}</span>
      <span style="color:#4290d0 ">管线</span>的控制柜分布情况:
    </div>
    <div class="TmnLine"
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
      <div class="pictext" v-for="item in tmndata" :key="item.value">
        <div class="TmnPic"></div>
        <div class="TmnText">{{ item }}</div>

      </div>
      <div class="line" v-show="lineshow"></div>
    </div>
  </div>
</template>

<script>
import qs from "qs";

export default {
  name: "AreaPipe",
  mounted() {
    // this.getTreeData();
    this.getAreaData();
  },
  data() {
    return {
      tree:[],//测试用
      treearea:[],
      value:[],

      lineshow:false,
      loading:true,
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
    //构造树
    // async getTreeData(){
    //   await this.$axios.post("/getAreas").then(res => {
    //     this.treearea = res.data;
    //   })
    //       .catch(failResponse => {
    //         console.log(failResponse)
    //         alert(failResponse)
    //       });
    //   for( var i=0;i<this.treearea.length;i++)
    //   {
    //     var a=this.treearea[i].areaName;
    //     var param = qs.stringify({AreaName: this.treearea[i].areaName})
    //     await this.$axios.post("/getPipes", param).then(res => {
    //       var list= {};
    //
    //       // list.push({value: param,
    //       //   label: param,
    //       //   children:res.data[0]},
    //       // )
    //           list.value= a,
    //           list.label= a,
    //           list.children=res.data
    //
    //       this.tree.push(list)
    //
    //     });
    //     for(var j=0;j<this.tree[i].children.length;j++)
    //     {
    //       var b =this.tree[i].children[j].pipID
    //       var para = qs.stringify({
    //         PipID: this.tree[i].children[j].pipID
    //       })
    //       await this.$axios.post("/getTerminals", para).then(res => {
    //         console.log(res.data)
    //         var list= {};
    //         list.value=b;
    //         list.label=b;
    //         list.children=res.data;
    //          this.tree[i].children[j]=list
    //
    //       })
    //       for(var k=0;k<this.tree[i].children[j].children.length;k++)
    //       {
    //         // console.log(this.tree[i].children[j].children[k])
    //         var list={};
    //         list.value=this.tree[i].children[j].children[k];
    //         list.label=this.tree[i].children[j].children[k];
    //         console.log(list)
    //         this.tree[i].children[j].children[k]=list;
    //       }
    //     };
    //
    //   }
    // },
    getAreaData() {
      this.$axios.post("/getAreas").then(res => {
        this.areadata = res.data;
        this.sarea = this.areadata[0].areaName
        this.getPipeData()
      })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
      this.tree=JSON.parse(window.localStorage.getItem('local_tree'))
    },
    getPipeData() {
      var params = qs.stringify({AreaName: this.sarea})
      this.$axios.post("/getPipes", params).then(res => {
        this.pipedata = res.data;
        this.spipe.pipName = this.pipedata[0].pipName
        this.spipe.pipID = this.pipedata[0].pipID
        this.getTmnData()
      })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },
    getTmnData() {
      for(var i=0;i<this.pipedata.length;i++)
      {
        if(this.spipe.pipName==this.pipedata.pipName)
          this.spipe.pipID=this.pipedata.pipID
      }
      var params = qs.stringify({
        PipID: this.spipe.pipID
      })
      this.$axios.post("/getTerminals", params).then(res => {
        this.tmndata = res.data;
        this.lineshow=true;
        this.loading=false;
      })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },
    handleClick() {

    },
    test() {
      // console.log(this.tree)
      console.log(this.tree)

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
@keyframes example {
  from {background-color: #794040;}
  to {background-color: red;}
}
.gif1 {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #794040;
  animation-name: example;
  animation-duration: 0.4s;
  animation-iteration-count: infinite;
}
@keyframes example2 {
  from {background-color: #954100;}
  to {background-color: #ff9900;}
}
.gif2 {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #954100;
  animation-name: example2;
  animation-duration: 0.6s;
  animation-iteration-count: infinite;
}
@keyframes example3 {
  from {background-color: #003290;}
  to {background-color: #005aff;}
}
.gif3 {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #003290;
  animation-name: example3;
  animation-duration: 0.8s;
  animation-iteration-count: infinite;
}
</style>
