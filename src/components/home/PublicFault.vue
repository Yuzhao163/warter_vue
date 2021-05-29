<template>
  <div class="container"
       v-loading="loading"
       element-loading-text="数据加载中..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="tool-bar">
      <el-switch
          style="display: block;margin: auto 20px"
          v-model="refresh"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="动态刷新"
          inactive-text="静态数据"
          @change="this.refreshOpen">
      </el-switch>
    </div>
    <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
          prop="tmnName"
          label="控制柜名称"
          width="240">
      </el-table-column>
      <el-table-column
          prop="time"
          label="故障时间"
          width="320"
          :formatter="dateFormat">
      </el-table-column>
      <el-table-column
          prop="error_Position"
          label="异常部位"
          width="160">
      </el-table-column>
      <el-table-column
          prop="user"
          label="维护人员"
          width="160">
      </el-table-column>
      <el-table-column
          prop="if_deal"
          sortable
          label="处理状态"
          width="200"
      :formatter="if_deal">
      </el-table-column>
      <el-table-column
          label="查看详情"
          width="80">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              @click="details=true,detailbutton(scope.$index,scope.row),gettableDatas()">详情
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
        v-show="pageView"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1,5,10,20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total=total>
      >
    </el-pagination>
    <!--    弹框内容-->
    <el-dialog style="text-align: left" title="详情信息" :visible.sync="details">
            <div >控制柜名称：{{ this.row_msg.tmnName }}</div>
            <div style="margin: 20px 0px">控制柜编号：{{ this.row_msg.tmnId }}</div>
            <div style="margin: 20px 0px">异常部位：{{this.row_msg.error_Position}}</div>
<!--      <div class="pipearea">-->
<!--        <span>所属管线：</span>-->
<!--        <el-select id="select1" v-model="PipName" ref="select1" clearable placeholder="&#45;&#45;所属管线&#45;&#45;" class="handle-select"-->
<!--                   style=" margin-right: 10px">-->
<!--          <el-option v-for="item in Tmn"-->
<!--                     :key="item.PipName"-->
<!--                     :label="item.PipName"-->
<!--                     :value="item.PipName"></el-option>-->
<!--        </el-select>-->
<!--        <div class="PA">-->
<!--          <div>线内编号：{{ this.AreaName }}</div>-->
<!--          <div>所属分区：{{ this.AreaName }}</div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="faultdetail">-->
<!--        <div>故障详情：</div>-->
<!--        <div  class="fault-text">{{ this.row_msg.exception }}</div>-->
<!--      </div>-->
<!--      <div class="faultdetail" style="margin-top: 20px">-->
<!--        <div>解决方案：</div>-->
<!--        <div  class="fault-text"> {{ this.row_msg.result }}</div>-->
<!--      </div>-->

      <div class="text_form">
        <el-table
                :data="tableDatas"
                style="width: 100%"
                :default-sort="{prop: 'date', order: 'descending'}"
        >
          <el-table-column
                  prop="c_t"
                  label="时间 "
                  sortable
                  width="210"
                  :formatter="dateFormat">
          </el-table-column>
          <el-table-column
                  prop="exception"
                  label="故障详情"
                  sortable
                  width="210">
          </el-table-column>
          <el-table-column
                  prop="result"
                  label="解决方案"
                  :formatter="formatter"
                  width="210">
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="details = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import qs from "qs";
import moment from "moment";

export default {
  name: "PublicFault",
  created() {
    this.getTotalData();
  },
  mounted() {
    this.timer = setInterval(() => {
      setTimeout(this.getTotalData, 0);
    }, 1000 * 1);//1s刷新一次
  },
  data() {
    return {
      pageView:false,//控制分页显示，false为显示
      tableData: [],
      tableDatas: [],//用于存储某控制柜的异常情况和处理结果
      loading:true,
      daindex:0,//记录每页的第几个数(没用了)
      refresh: true,//动态刷新
      details: false,
      tableindex: 0,
      form: {
        name: '',
        region: '',
      },
      timer: null,
      PipName: '',
      AreaName: '',
      row_msg:{
        tmnName:'',
        tmnId:'',
        exception:'',
        result:'',
        error_Position:'',
      },
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
    //请求总条数
    getTotalData(){
      this.$axios.post('/Errorcount').then(res=>{
        console.log(res)
        this.total=res.data;
        var params=qs.stringify({page:1,
          size:this.pageSize})
        this.$axios.post('/SelectErrorMessageByPage',params).then(res=>{
          this.tableData=res.data
          this.loading=false;
          console.log(this.tableData)
        })
      })
    },
    gettableDatas(){//用来获取某控制柜的异常和处理结果
      var params = qs.stringify({
        //TmnID:this.row_msg.tmnId
        Erid:this.row_msg.erid
      })
      this.$axios.post('/getTerminalError',params).then(res=>{
        console.log(res)
        this.tableDatas = res.data
      })
    },

    //后端分页请求
    getPageData(){
      var params=qs.stringify({page:this.currentPage,
        size:this.pageSize})
      this.$axios.post('/SelectErrorMessageByPage',params).then(res=>{
        this.tableData=res.data
console.log(res.data)
      })
    },
    dateFormat:function(row,column){
      var date = row[column.property];
      if(date === undefined){
        return ''
      } ;
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },
    // getdata() {
    //   this.$axios.post("/error").then(res => {
    //     console.log("请求成功")
    //     console.log(res.data[0])
    //     this.tableData = res.data;
    //
    //   })
    //       .catch(failResponse => {
    //         console.log(failResponse)
    //         alert(failResponse)
    //       })
    // },

    //刷新按钮切换时触发
    refreshOpen() {
      if (this.refresh == true) {
        this.timer = setInterval(() => {
          setTimeout(this.getTotalData, 0);
        }, 1000 * 1);//1s刷新一次
        this.pageView = false;
      }
      if (this.refresh == false) {
        clearInterval(this.timer);
        this.pageView = true;
        this.Index_TableData;
      }
    },
    // detaildata() {
    //
    //   this.$axios.post('故障详情', this.ERId).then(res => {
    //     console.log("请求成功")
    //     this.Tmn = res.data;
    //   })
    //       .catch(failResponse => {
    //         console.log(failResponse)
    //         alert(failResponse)
    //       })
    // },
    detailbutton(index, row) {
      this.tableindex = index;
      this.row_msg.tmnName=row.tmnName;
      this.row_msg.tmnId=row.tmnId
      this.row_msg.exception=row.exception
      this.row_msg.result=row.result
      this.row_msg.error_Position = row.error_Position
      this.row_msg.erid = row.erid

      console.log(row.error_Position)
    },
    if_deal(row){
      switch (row.if_deal){
        case '1':
            return '未处理';
        case '2':
          return '已处理';
      }

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
      this.getTotalData();
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getPageData()
    },
    test() {
      console.log('11111')
      console.log(this.tableindex)
      console.log(this.tableData[0].tmnName)
      console.log("异常部位",this.tableData)

    },
  },
  watch: {
    PipName() {
      this.setArea(this.PipName)
    },
    immediate: true
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
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
.tool-bar{
  display: flex;
  margin-bottom: 20px;
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
