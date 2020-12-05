<template>
  <div class="container">
    <!--    筛选条-->
    <div class="screenbox">
      <el-select id="select1" v-model="screendata.W_work" ref="select1" clearable placeholder="--工作方式--" class="handle-select"
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
    </div>
    <!--    表格区-->

    <el-table
        :data="tableData"
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
          label="控制柜ID"
          sortable
          width="80">
      </el-table-column>
      <el-table-column
          prop="v_actiontime"
          label="最长阀动作时间"
          sortable
          width="80">
      </el-table-column>
      <el-table-column
          prop="ov_waterline"
          label="开阀水位"
          sortable
          width="80">
      </el-table-column>
      <el-table-column
          prop="cv_waterline"
          label="关阀水位"
          sortable
          width="80">
      </el-table-column>
      <el-table-column
          prop="ov_period"
          label="开阀周期"
          sortable
          width="80">
      </el-table-column>
      <el-table-column
          prop="w_work"
          label="工作方式"
          sortable
          width="80">
      </el-table-column>
      <el-table-column
          prop="ov_keeptime"
          label="开阀保持时间"
          sortable
          width="80">
      </el-table-column>
      <el-table-column
          prop="b_status"
          label="蓄电池状态"
          sortable
          width="80">
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
          width="80">
      </el-table-column>
    </el-table>
  </div>
</template>
//首页组件
<script>
import qs from 'qs';

export default {
  name: "AppIndex",
  mounted() {
    this.Index_TableData();
  },
  data() {
    return {
      tableData: [],
      W_work: [],
      defult: [],
      screendata: {
        W_work: '',
        defult: '',
      }
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
  float: left;
  margin-bottom: 20px;

}

</style>
