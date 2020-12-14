<template>
  <div class="maindiv">
    <button @click="test">test</button>
    <div class="card">
      <div>
        <el-tabs v-model="area" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="item in areas" :label="item.AreaName" :key="item.AreaName"
                       :name="item.index"></el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <el-tabs v-model="pipe" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="item in areas[area].pipes" :label="item.PipName" :key="item.PipName"
                       :name="item.index"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="linetitle">
      <span id="1" >{{ this.areas[area].AreaName }}</span><span style="color:#4290d0 ">---</span><span id="2">{{ this.areas[area].pipes[pipe].PipName }}</span>
      控制柜分布情况:
    </div>
    <div class="TmnLine">
      <div class="pictext" v-for="item in areas[area].pipes[pipe].tmns" :key="item.PipName">
        <div class="TmnPic"></div>
        <div class="TmnText">{{ item.TmnName }}</div>

      </div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AreaPipe",
  data() {
    return {
      area: '0',//存选择的分区index
      pipe: '0',//存选择的管线index
      areas: [
          {
        AreaID: '1',
        AreaName: '1分区',
        pipes: [
          {
            PipID: 'a',
            PipName: 'a管线',
            tmns: [
              {
                TmnId: '10001',
                TmnName: '赵家庄',
              },
              {
                TmnId: '10002',
                TmnName: '钱家庄',
              },
              {
                TmnId: '10003',
                TmnName: '孙家庄',
              },
              {
                TmnId: '10004',
                TmnName: '李家庄',
              }
            ]
          },
          {
            PipID: 'b',
            PipName: 'b管线',
            tmns: [
              {
                TmnId: '10005',
                TmnName: '周家庄',
              },
              {
                TmnId: '10006',
                TmnName: '吴家庄',
              },
              {
                TmnId: '10007',
                TmnName: '郑家庄',
              },
              {
                TmnId: '10008',
                TmnName: '王家庄',
              }
            ]
          }],
      },
        {
          AreaID: '2',
          AreaName: '2分区',
          pipes: [
            {
              PipID: 'c',
              PipName: 'c管线',
              tmns: [{
                TmnId: '',
                TmnName: '',
              }]
            },
            {
              PipID: 'd',
              PipName: 'd管线',
              tmns: [{
                TmnId: '',
                TmnName: '',
              }]
            }],
        },
        {
          AreaID: '3',
          AreaName: '3分区',
          pipes: [
            {
              PipID: 'e',
              PipName: 'e管线',
              tmns: [{
                TmnId: '',
                TmnName: '',
              }]
            },
            {
              PipID: 'f',
              PipName: 'f管线',
              tmns: [{
                TmnId: '',
                TmnName: '',
              }]
            }],

        }]
    }

  },
  methods: {
    handleClick() {

    },
    test() {
      console.log(this.area);
      console.log(this.pipe)
    }
  }
}
</script>

<style scoped>
.maindiv {
  background-color: #ffffff;
  border-radius: 20px;
  border: #899eac solid 1px;

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

span{
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

}

ul {
  display: flex;
}

ul li {
  margin-left: 20px;
}
</style>
