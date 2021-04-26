<template>
  <div class="container">
    <!--    筛选条-->
    <div class="screenbox">
      <el-select id="select1" v-model="screendata.W_work" ref="select1" clearable placeholder="--工作方式--"
                 class="handle-select"
                 style=" margin-right: 10px">
        <el-option key="1" label="手动" value="11"></el-option>
        <el-option key="2" label="自动方式1" value="21"></el-option>
        <el-option key="3" label="自动方式2" value="22"></el-option>
        <el-option key="4" label="自动方式3" value="23"></el-option>
      </el-select>
      <el-select id="select2" v-model="screendata.defult" ref="select2" placeholder="--异常状态--" class="handle-select"
                 style="margin-right: 10px">
        <el-option key="1" label="正常" value="601"></el-option>
        <el-option key="2" label="轻微" value="602"></el-option>
        <el-option key="3" label="严重" value="603"></el-option>
        <el-option key="4" label="紧急" value="604"></el-option>
      </el-select>
      <el-button type="success" icon="el-icon-delete" @click="clearScreen">清除</el-button>
      <el-button type="primary" icon="el-icon-search" @click="Screen">筛选</el-button>
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
    <!--    表格区-->

    <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="数据加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="width: 100%;color: black"
        :row-class-name="tableRowClassName"
        :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
          prop="update_time"
          label="更新时间"
          :formatter="dateFormat"
          sortable
          width="200">
      </el-table-column>
      <el-table-column
          prop="tmnID"
          label="控制柜名称"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          label="异常状态"
          sortable
          width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.send_error==1"><div class="gif1"></div></div>
          <div v-if="scope.row.send_error==2"><div class="gif2"></div></div>
          <div v-if="scope.row.send_error==3"><div class="gif3"></div></div>
          <div v-if="scope.row.send_error==4"><div class="gif4"></div></div>
        </template>
      </el-table-column>
      <el-table-column
          prop="v_actiontime"
          label="最长阀动作时间"
          sortable
          width="150">
      </el-table-column>
      <el-table-column
          prop="ov_waterline"
          label="开阀水位"
          sortable
          width="100">
      </el-table-column>
      <el-table-column
          prop="cv_waterline"
          label="关阀水位"
          sortable
          width="100">
      </el-table-column>
      <el-table-column
          prop="ov_period"
          label="开阀周期"
          sortable
          width="100">
      </el-table-column>
      <el-table-column
          prop="w_work"
          :formatter="workmod"
          label="工作方式"
          sortable
          width="100">
      </el-table-column>
      <el-table-column
          prop="ov_keeptime"
          label="开阀保持时间"
          sortable
          width="140">
      </el-table-column>
      <el-table-column
          prop="b_status"
          label="蓄电池状态"
          sortable
          width="120">
      </el-table-column>
      <el-table-column
          prop="f_Volume"
          label="流量"
          sortable
          width="80">
      </el-table-column>

    </el-table>
    <el-pagination
        v-show="pageView"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1,5,10,20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      >
    </el-pagination>
  </div>
</template>
//首页组件
<script>
import qs from 'qs';
import moment from 'moment'
export default {
  name: "AppIndex",
  created() {
    this.getTotalData()
    // this.Index_TableData();
  },
  mounted() {



  },
  data() {
    return {
      tableData: [],
      errorData:'',
      refresh: false,
      timer: null,
      pageView: true,//控制分页显示，false为显示
      W_work: [],
      defult: [],
      screendata: {
        W_work: '',
        defult: '',
      },
      loading:true,
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10 // 每页的数据条数
    }
  },
  methods: {
    //请求总条数
    getTotalData(){
    this.$axios.post('/count').then(res=>{
    console.log(res)
      this.total=res.data;
      var params=qs.stringify({page:1,
        size:this.pageSize})
      this.$axios.post('/SelectMessageByPage',params).then(res=>{
        this.tableData=res.data
        this.loading=false;
        console.log(this.tableData)
      })
})
    },
    //后端分页请求
    getPageData(){
      var params=qs.stringify({page:this.currentPage,
      size:this.pageSize})
      this.$axios.post('/SelectMessageByPage',params).then(res=>{
        this.tableData=res.data

      })
    },
    //静态时请求的数据
    Index_TableData() {
      console.log("调用了")
      this.$axios
          .get('/allmessage')
          .then(res => {
            console.log("请求成功")
            this.tableData = res.data;
          })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },
    //动态时请求的数据，每几秒请求10条数据
    Index_refreshData() {
      console.log("调用了")
      this.$axios
          .get('/MessageDesc')
          .then(res => {
            console.log("请求成功")
            this.tableData = res.data;
          })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },
    //工作方式格式化
    workmod(row){
     console.log(row.w_work)
    switch(row.w_work){
      case 11:
        return "手动";
      case 21:
        return "自动方式1";
      case 22:
        return "自动方式2";
       case 23:
          return "自动方式3";
    }
    },
    clearScreen() {
      // var elselect1=document.getElementById("select1");
      // this.$refs.select1.getAttribute('placeholder');
      this.$refs.select1.value = '';
      this.screendata.W_work = '';
      this.$refs.select2.value = '';
      this.screendata.defult = '';
      this.getTotalData();
    },
    screenEvent() {

      if (this.screendata.W_work == '' && this.screendata.defult == '') {
        this.Index_TableData();
      } else {
        var params = qs.stringify({
          W_work: this.screendata.W_work,
          defult: this.screendata.defult,
        })

        console.log(this.screendata)
        this.$axios.post('/SelectMessage', params).then(res => {
          console.log("请求成功")
          this.tableData = res.data;
        })
            .catch(failResponse => {
              console.log(failResponse)
              alert(failResponse)
            })
      }
    },
    Screen() {
      this.screenEvent();
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
      this.getTotalData()
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getPageData()
    },
    //动态静态切换时触发
    refreshOpen() {
      if (this.refresh == true) {
        this.timer = setInterval(() => {
          setTimeout(this.Index_refreshData, 0);
        }, 1000 * 1);//1s刷新一次
        this.pageView = false;
      }
      if (this.refresh == false) {
        clearInterval(this.timer);
        this.pageView = true;
        this.Index_TableData;
      }
    },
    //判断故障紧急程度控制css
    errtips(errtip) {
      if(errtip=='1')
      {
        this.errorData= 'one';
      }
    },
    test(){

    },
    dateFormat:function(row,column){
      var date = row[column.property];
      if(date === undefined){
        return ''
      } ;
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },
    tableRowClassName({row}) {

      if (row.send_error == 3) {

        return 'three_row';
      } else if (row.send_error == 1) {
        return 'one_row';
      }else if (row.send_error == 2) {
        return 'two_row';
      }
      else if (row.send_error == 4) {
        return 'four_row';
      }
      return '';
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style scoped>
.container {
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.screenbox {
  display: flex;
  float: left;
  margin-bottom: 20px;

}
/*高亮部分*/
/deep/.el-table .three_row {
  background: #a6d2ff;
}

/deep/.el-table .one_row {
  background: #ff9d9d;
}
/deep/.el-table .two_row {
  background: #ffd09d;
}
/deep/.el-table .four_row {
  background: #c6ff9d;
}

/*动画部分*/
@keyframes example {
  from {
    background-color: #794040;
  }
  to {
    background-color: red;
  }
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
  from {
    background-color: #d58105;
  }
  to {
    background-color: #ff9900;
  }
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
  from {
    background-color: #003290;
  }
  to {
    background-color: #005aff;
  }
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

@keyframes example4 {
  from {
    background-color: #1cad00;
  }
  to {
    background-color: #2aff00;
  }
}
.gif4 {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #1cad00;
  animation-name: example4;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}
</style>
