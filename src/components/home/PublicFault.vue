<template>
  <div class="container">
    <div>
      <el-button @click="details=true">详情测试</el-button>
    </div>
    <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
          prop="TmnName"
          label="控制柜名称"
          width="90">
      </el-table-column>
      <el-table-column
          prop="tmnID"
          label="故障时间"
          width="80">
      </el-table-column>
      <el-table-column
          prop="v_actiontime"
          label="故障内容"
          width="80">
      </el-table-column>
      <el-table-column
          prop="ov_waterline"
          label="异常等级"
          width="80">
      </el-table-column>
      <el-table-column
          prop="cv_waterline"
          label="查看详情"
          width="80">
        <template>
          <el-button
              size="mini"
              type="primary"
              @click="details()">'详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
          prop="ov_period"
          label="处理方式"
          width="80">

      </el-table-column>
    </el-table>
    <el-dialog style="text-align: left" title="详情信息" :visible.sync="details">
      <div>控制柜名称：{{ Tmnname }}</div>
      <div>控制柜编号：{{ TmnID }}</div>
      <div class="pipearea">
        <span>所属管线：</span>
        <el-select id="select1" v-model="PipName" ref="select1" clearable placeholder="--所属管线--" class="handle-select"
                   style=" margin-right: 10px">
          <el-option v-for="item in Tmn"
                     :key="item.PipName"
                     :label="item.PipName"
                     :value="item.PipName"></el-option>
        </el-select>
        <div class="PA">
          <div>线内编号：{{ this.AreaName }}</div>
          <div>所属分区：{{ this.AreaName }}</div>
        </div>
      </div>
      <div class="faultdetail">
        <div>故障详情：</div>
        <div class="fault-text">1111111111111111111111111111111111111111111111111111111111111111111111111111</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="details = false">取 消</el-button>
        <el-button type="primary" @click="details = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "PublicFault",
  mounted() {

  },
  data() {
    return {
      tableData: [],
      details: false,
      form: {
        name: '',
        region: '',
      },
      PipName: '',
      AreaName: '',
      Tmn: [
        {
          PipName: 'A',
          AreaName: '1',
        }, {
          PipName: 'B',
          AreaName: '2',
        }, {
          PipName: 'C',
          AreaName: '3',
        }
      ],
      Tmnname: "北方工业大学",
      TmnID: '10009',
      ERId:'',
    }
  },
  methods: {
    getdata(){
      this.$axios.post('故障列表').then(res => {
        console.log("请求成功")
        this.Tmn = res.data;
      })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },
    detaildata(){
      this.$axios.post('故障详情',this.ERId).then(res => {
        console.log("请求成功")
        this.Tmn = res.data;
      })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },
    setArea(pipname) {
      for (var i = 0; i < this.Tmn.length; i++) {
        if (pipname == this.Tmn[i].PipName) {
          this.AreaName = this.Tmn[i].AreaName
        }
      }
    }
  },
  watch: {
    PipName() {
      this.setArea(this.PipName)
    },
    immediate: true
  }
}
</script>

<style scoped>
.container {
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.pipearea{
  margin: 10px 0;
}
.pipearea .PA {
  display: inline-block;
}

.PA div {
  display: inline-block;
  margin: 0px 20px;
}
.faultdetail{
  display: flex;
}
.fault-text{

  width: 480px;
  height: 230px;
  padding:20px;
  background-color: #e5f1f6;
  border-radius: 20px;
  text-align: left;
font-size: 16px;
}
/deep/ .el-dialog__body {
  padding: 10px 20px;

}
</style>
