<template>
  <div class="container">
    <div class="toptable">
      <div class="select">
        <el-select id="select1" v-model="screendata.condition"  clearable placeholder="--搜索条件--" class="handle-select"
                   style=" margin-right: 10px">
          <el-option key="1" label="按员工编号搜索" value="11"></el-option>
          <el-option key="2" label="按姓名搜索" value="21"></el-option>
          <el-option key="3" label="按控制柜编码" value="22"></el-option>
          <el-option key="4" label="自动方式3" value="23"></el-option>
        </el-select>
      </div>
      <div class="rightbutton">
        <button class="addbutton">添加</button>
      </div>
    </div>

    <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
          prop="UserName"
          label="用户名称"
          width="80">
      </el-table-column>
      <el-table-column
          prop="RealName"
          label="真实姓名"
          width="80">
      </el-table-column>
      <el-table-column
          prop="UClassName"
          label="用户类别"
          width="80">
      </el-table-column>
      <el-table-column
          prop="MoPhone"
          label="联系电话"
          width="80">
      </el-table-column>
      <el-table-column
          prop="DPTName"
          label="单位名称"
          width="80">
      </el-table-column>
      <el-table-column
          prop="RegTime"
          label="注册时间"
          width="80">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Staff",
  data() {
    return {
      tableData: [],
      screendata:{
        condition:'',
        selectcontent:''
      },
    }
  },
  methods:{
    Index_TableData() {
      console.log("调用了")
      this.$axios
          .get('/staff')
          .then(res => {
            console.log("请求成功")
            this.tableData = res.data;
          })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },

  }
}
</script>

<style scoped>
.container {
  padding: 20px 30px 30px 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.rightbutton{
  float: right;
}
.select {
  float: left;
}
.addbutton{
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #ffa900;
  border: 1px solid #fcebc3;
  color: #fff2d7;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 20px;
}
</style>
