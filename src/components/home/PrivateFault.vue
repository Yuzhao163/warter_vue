<template>
  <div class="container">
    <div class="title">
      <div></div>
    </div>
    <div>
      <el-button @click="details=true">详情测试</el-button>
    </div>
    <div class="table">
      <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column
            prop="TmnName"
            label="控制柜名称"
            width="120">
        </el-table-column>
        <el-table-column
            prop="Time"
            label="故障时间"
            width="160">
        </el-table-column>
        <el-table-column
            prop="Error_Psition"
            label="异常部位"
            width="80">
        </el-table-column>
        <el-table-column
            prop="error_level"
            label="异常等级"
            width="80">
        </el-table-column>
        <el-table-column
            label="查看详情"
            width="80">
          <template>
            <el-button
                size="mini"
                type="primary"
                @click="details=true;details()">详情
            </el-button>
          </template>
        </el-table-column>
        <!--      <el-table-column-->
        <!--          prop="ov_period"-->
        <!--          label="处理方式"-->
        <!--          width="80">-->

        <!--      </el-table-column>-->
      </el-table>
    </div>
    <!--    弹框内容-->
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
<!--      <div class="faultdetail">-->
<!--        <div>故障详情：</div>-->
<!--        <div class="fault-text">1111111111111111111111111111111111111111111111111111111111111111111111111111</div>-->
<!--      </div>-->
      <div class="faultdetail" style="margin-top: 20px">
        <div>故障详情：</div>
        <textarea class="resolvent" v-model="faultdetil"></textarea>
      </div>
      <div class="faultdetail" style="margin-top: 20px">
        <div>解决方案：</div>
        <textarea class="resolvent" v-model="resolvent"></textarea>
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
  name: "PrivateFault",
  mounted() {

  },
  data() {
    return {
      tableData: [{
        TmnName: "石景山控制柜", Time: "2020/11/24 16:51:33", Error_Psition: "水位", error_level: "",
      }, {
        TmnName: "石景山控制柜", Time: "2020/11/24 16:51:33", Error_Psition: "水位", error_level: "",
      }, {
        TmnName: "石景山控制柜", Time: "2020/11/24 16:51:33", Error_Psition: "水位", error_level: "",
      }, {
        TmnName: "石景山控制柜", Time: "2020/11/24 16:51:33", Error_Psition: "水位", error_level: "",
      }],
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
      resolvent: '',//解决方案
      faultdetil:'',//故障描述
      Tmnname: "北方工业大学",
      TmnID: '10009',
      ERId: '',//故障编码
    }
  },
  methods: {
    getdata() {
      this.$axios.post('故障列表').then(res => {
        console.log("请求成功")
        this.Tmn = res.data;
      })
          .catch(failResponse => {
            console.log(failResponse)
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
