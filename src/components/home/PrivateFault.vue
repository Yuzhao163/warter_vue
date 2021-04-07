<template>
  <div class="container">
    <div class="title">
      <div></div>
    </div>
    <div>
      <el-button @click="details=true">详情测试</el-button>
    </div>
<!--    异常处理表格-->
    <div class="table">
      <el-table :data="errorTableData" stripe style="width: 100%; margin-top: 35px; margin-bottom: 25px">
        <el-table-column prop="erid" label="错误id"></el-table-column>
        <el-table-column prop="errorTime" label="故障时间"></el-table-column>
        <el-table-column prop="errorPart" label="异常部位"></el-table-column>
        <el-table-column prop="errorLevel" label="异常等级"></el-table-column>
        <el-table-column prop="errorDetail" label="查看详情">
          <template slot-scope="scope">
            <el-button type="primary" @click="detailDialog(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    弹框内容-->
    <el-dialog style="text-align: left" title="详情信息" :visible.sync="detailDialogVisible">
      <div>控制柜名称：{{ tmnName }}</div>
      <div>控制柜编号：{{ tmnID }}</div>
      <div class="pipearea">
        <span>所属管线：</span>
        <el-select id="select1" v-model="pipName" ref="select1" clearable placeholder="--所属管线--" class="handle-select"
                   style=" margin-right: 10px">
          <el-option v-for="item in pipList"
                     :key="item.PipName"
                     :label="item.PipName"
                     :value="item.PipName"></el-option>
        </el-select>
        <div class="PA">
          <div>线内编号：{{ ptId }}</div>
          <div>所属分区：{{ areaName }}</div>
        </div>
      </div>
      <div class="faultdetail" style="margin-top: 20px">
        <div>故障详情：</div>
        <textarea class="resolvent" v-model="exception"></textarea>
      </div>
      <div class="faultdetail" style="margin-top: 20px">
        <div>解决方案：</div>
        <textarea class="resolvent" v-model="result"></textarea>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateError">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Temperature from "../charts/Temperature";
export default {
  name: "PrivateFault",
  // components: {Temperature},
  mounted() {

  },
  data() {
    return {

      // 故障表格
      errorTableData: [],
      // 详情按钮
      detailDialogVisible: false,
      // 控制柜编号和名称
      tmnName: "",
      tmnID: '',
      // 所属管线
      pipName: '',
      // 所属分区编号和名称
      areaID:'',
      areaName: '',
      // 线内编号
      ptId: '',
      // 故障详情
      exception:'',
      // 解决方案
      result:'',
      // user
      user:'',

      // 所属管线下拉框
      pipList:[],

      Tmn:{},

      erid: '',//故障编码
    }
  },
  created() {
    this.getErrorList()
  },
  methods: {
    //列表详情
    getErrorList() {
      this.$axios.get('/error1').then(res => {
        console.log("请求成功")
        this.errorTableData = res.data
        console.log(res,this.errorTableData)
      }).catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },
    // 详情按钮
    detailDialog(row) {
      this.detailDialogVisible = true
      this.tmnName = row.tmnName
      this.tmnID = row.tmnId
      this.pipName = row.pipName
      this.areaName = row.areaName
      this.ptId = row.ptid
      this.exception = row.exception
      this.result = row.result
      console.log(row)

    },
    // 更新表单
    updateError() {
      this.$axios.post('/adderror', {
        pipName: this.PipName,
        exception: this.exception,
        result: this.result
      })
      .then( res => {
        console.log(res.data)
        if (res.data == 200) {
          console.log("连接成功")
        } else {
          console.log("连接失败")
        }
      })
      .catch(failResponse => {
        alert(failResponse)
      })
    },


    detaildata() {

      this.$axios.post('故障详情', this.ERId).then(res => {
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
    },
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
.title {
  display: flex;
}

.container {
  display: inline-block;
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.table{
  display: inline-block;
}
.pipearea {
  margin: 10px 0;
}

.pipearea .PA {
  display: inline-block;
}

.PA div {
  display: inline-block;
  margin: 0px 20px;
}

.faultdetail {
  display: flex;
}

.fault-text {

  width: 480px;
  height: 230px;
  padding: 20px;
  background-color: #e5f1f6;
  border-radius: 20px;
  text-align: left;
  font-size: 16px;
}

.resolvent {
  width: 480px;
  height: 230px;
  padding: 20px;
  border:2px solid #e8e8e8;
  border-radius: 20px;
  text-align: left;
  font-size: 16px;
  resize: none;/*禁止文本框拉伸*/
}
:hover.resolvent {
  width: 480px;
  height: 230px;
  padding: 20px;
  border:2px solid #d0d0d0;
  border-radius: 20px;
  text-align: left;
  font-size: 16px;
  resize: none;/*禁止文本框拉伸*/
}
:focus.resolvent {
  width: 480px;
  height: 230px;
  padding: 20px;
  border:2px solid #e8e8e8;
  border-radius: 20px;
  box-shadow: 0 0 15px #d0d0d0;
  text-align: left;
  font-size: 16px;
  resize: none;/*禁止文本框拉伸*/
}
/deep/ .el-dialog__body {
  padding: 10px 20px;
}

/*获取焦点元素后的设置*/
textarea:focus {

  outline: none;

}
</style>
