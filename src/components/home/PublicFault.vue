<template>
  <div class="container">
    <div>
      <el-button @click="details=true,test()">详情测试</el-button>
    </div>
    <!--        控制柜列表区域-->
    <el-table :data="tmnTableDataShow" stripe style="width: 100%; margin-top: 35px; margin-bottom: 25px">
      <!--        <el-table-column label="" type="index"></el-table-column>-->
      <el-table-column prop="tmnId" label="控制柜id"></el-table-column>
      <el-table-column prop="tmnName" label="控制柜名称"></el-table-column>
      <el-table-column prop="u1TmnName" label="上一控制柜名称" ></el-table-column>
      <el-table-column prop="u2TmnName" label="上一控制柜名称" ></el-table-column>'
      <el-table-column prop="d1TmnName" label="上一控制柜名称" ></el-table-column>
      <el-table-column prop="d2TmnName" label="下一控制柜名称" ></el-table-column>
      <el-table-column prop="pipName" label="所属管线" ></el-table-column>
      <el-table-column prop="tmnDesc" label="描述信息"></el-table-column>
      <el-table-column label="操作信息">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editTmnList(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>



    <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
          prop="tmnName"
          label="控制柜名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="Time"
          label="故障时间"
          width="160">
      </el-table-column>
      <el-table-column
          prop="exception"
          label="异常部位"
          width="80">
      </el-table-column>
      <el-table-column
          prop="user"
          label="维护人员"
          width="80">
      </el-table-column>
      <el-table-column
          label="查看详情"
          width="80">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              @click="details=true;detailbutton(scope.$index,scope.row)">详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    弹框内容-->
    <el-dialog style="text-align: left" title="详情信息" :visible.sync="details">
            <div>控制柜名称：{{ tableData[this.tableindex].tmnName }}</div>
            <div>控制柜编号：{{ tableData[this.tableindex].tmnId }}</div>
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
        <div class="fault-text">{{ tableData[this.tableindex].exception }}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="details = false">取 消</el-button>
        <el-button type="primary" @click="details = false">确 定</el-button>
      </div>
      <div>
        <button @click="test()">test</button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "PublicFault",
  mounted() {
    this.getdata()
  },
  data() {
    return {
      tableData: [],
      details: false,
      tableindex: '',
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
      ERId: '',
      faultdetil: '222',//故障详情
    }
  },
  methods: {
    getdata() {
      this.$axios.post("/error").then(res => {
        console.log("请求成功")
        console.log(res.data[0])
        this.tableData = res.data;

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
    detailbutton(index, row) {
      this.tableindex = index
      console.log(row)
    },
    setArea(pipname) {
      for (var i = 0; i < this.Tmn.length; i++) {
        if (pipname == this.Tmn[i].PipName) {
          this.AreaName = this.Tmn[i].AreaName
        }
      }
    },
    test() {
      console.log('11111')
      console.log(this.tableindex)
      console.log(this.tableData[0].tmnName)

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
.container {
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
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

/deep/ .el-dialog__body {
  padding: 10px 20px;

}
</style>
