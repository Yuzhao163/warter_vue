<template>
  <div class="container">
    <div>
      <el-button @click="details=true,test()">详情测试</el-button>
    </div>
    <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
      <!--      <el-table-column-->
      <!--          prop="ov_period"-->
      <!--          label="处理方式"-->
      <!--          width="80">-->

      <!--      </el-table-column>-->
    </el-table>
    <el-pagination

        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1,5,10,20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length">
      >
    </el-pagination>
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
      tableindex: '0',
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
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5 // 每页的数据条数
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
      this.tableindex = index;
      console.log(row)
    },
    setArea(pipname) {
      for (var i = 0; i < this.Tmn.length; i++) {
        if (pipname == this.Tmn[i].PipName) {
          this.AreaName = this.Tmn[i].AreaName
        }
      }
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
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
