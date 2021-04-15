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
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        stripe
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
          prop="id"
          label="日期"
          sortable
          width="80">
      </el-table-column>
      <el-table-column
          prop="tmnID"
          label="控制柜名称"
          sortable
          width="180">
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
      <el-table-column
          prop="create_time"
          label="创建时间"
          sortable
          width="100">
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
    </el-table>
    <el-pagination
        v-show="pageView"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1,5,10,20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length">
      >
    </el-pagination>
  </div>
</template>
//首页组件
<script>
import qs from 'qs';

export default {
  name: "AppIndex",
  created() {
    this.Index_TableData();
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
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10 // 每页的数据条数
    }
  },
  methods: {
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
    clearScreen() {
      // var elselect1=document.getElementById("select1");
      // this.$refs.select1.getAttribute('placeholder');
      this.$refs.select1.value = '';
      this.screendata.W_work = '';
      this.$refs.select2.value = '';
      this.screendata.defult = '';
      this.Index_TableData();
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
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    refreshOpen() {
      if (this.refresh == true) {
        this.timer = setInterval(() => {
          setTimeout(this.Index_TableData, 0);
        }, 1000 * 1);//1s刷新一次
        this.pageView = false;
      }
      if (this.refresh == false) {
        clearInterval(this.timer);
        this.pageView = true;
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
    background-color: #954100;
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
