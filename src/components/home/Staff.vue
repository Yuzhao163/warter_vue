<template>
  <div class="container">
    <div class="toptable">
      <div class="select">
        <el-select id="select1" v-model="screendata.condition" clearable placeholder="--搜索条件--" class="handle-select"
                   style=" margin-right: 10px">
          <el-option key="1" label="按员工编号搜索" value="11"></el-option>
          <el-option key="2" label="按姓名搜索" value="21"></el-option>
          <el-option key="3" label="按控制柜编码" value="22"></el-option>
          <el-option key="4" label="自动方式3" value="23"></el-option>
        </el-select>
      </div>
      <div class="rightbutton">
        <button class="addbutton" @click="addbox=true">添加</button>
        <button class="addbutton" @click="delconfirm">测试</button>
      </div>
    </div>

    <el-table
        :data="tableData"

        stripe
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
          prop="userID"
          label="用户ID"
          >
      </el-table-column>
      <el-table-column
          prop="userName"
          label="用户名称"
          >
      </el-table-column>
      <el-table-column
          prop="realName"
          label="真实姓名"
          >
      </el-table-column>
      <el-table-column
          prop="uclassID"
          label="用户类别"
          >
      </el-table-column>
      <el-table-column
          prop="moPhone"
          label="联系电话"
          >
      </el-table-column>
      <el-table-column
          prop="dptname"
          label="单位名称"
          >
      </el-table-column>
      <el-table-column
          prop="regTime"
          label="注册时间"
          >
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
              @click="delconfirm(scope.$index,scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    添加员工弹框内容-->
    <el-dialog class="dialog" style="text-align: left" title="添加用户" :visible.sync="addbox">
      <div class="input">
        <div class="left">
          <div class="text"><span style="color: red">*</span>用户名：</div>
          <el-input v-model="addmessage.UserName" placeholder="请输入用户名"></el-input>
          <div class="text"><span style="color: red">*</span>密码：</div>
          <el-input v-model="addmessage.UserPswd" placeholder="请输入密码"></el-input>
          <span style="color:#2496ee;font-size: 10px">不填写则设置初始密码为123456</span>
          <div class="text">真实姓名：</div>
          <el-input v-model="addmessage.RealName" placeholder="请输入真实名称"></el-input>
          <div class="text">手机号：</div>
          <el-input v-model="addmessage.MoPhone" placeholder="请输入手机号"></el-input>
          <div class="text">单位名称：</div>
          <el-input v-model="addmessage.DPTName" placeholder="请输入单位名称"></el-input>
        </div>
        <div class="right">
          <div class="text"><span style="color: red">*</span>用户类别：</div>
          <el-select v-model="addmessage.UClassID" ref="select1" placeholder="--用户类别--"
                     style=" margin-right: 10px">
            <el-option key="1" label="操作人员" value="101"></el-option>
            <el-option key="2" label="管理人员" value="102"></el-option>
          </el-select>
          <div>
            <div class="text"><span style="color: red">*</span>权限分配：</div>
            <el-tree
                :props="props"
                :load="loadNode"
                lazy
                show-checkbox
                @check-change="handleCheckChange">
            </el-tree>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">

        <el-button @click="addbox = false">取 消</el-button>
        <el-button type="primary" @click="addstaff();addbox = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--    删除弹框内容-->

  </div>
</template>

<script>
import qs from 'qs';
export default {
  name: "Staff",
  mounted() {
    this.Index_TableData();
  },
  data() {
    return {
      addbox: false,

      tableData: [],
      screendata: {
        condition: '',
        selectcontent: ''
      },
      addmessage: {
        UserName: '',
        UserPswd: '',
        UClassID: '',
        MoPhone: '',
        RealName: '',
        DPTName: '',
      }
    }
  },
  methods: {
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
    delconfirm(index,row) {
      this.$confirm('将删除该用户, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = qs.stringify({
          UserID:row.userID,
        });
        console.log(row.userID)
        console.log(index)
        this.$axios
            .post('/delstaff', params).then(res => {
          console.log(res);this.updateTable()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addstaff(){
      var params = qs.stringify({
        UserName:this.UserName,
        UserPswd:this.UserPswd,
        UClassID:this.UClassID,
        MoPhone:this.MoPhone,
        RealName:this.RealName,
        DPTName:this.DPTName,
      })
      this.$axios.post('/addstaff', params).then(res => {
        if (res.data.code === 200)
        console.log(res)
      })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },
    // 触发更新事件
    updateTable(){
      // 卸载
      this.tableShow= false
      // 建议加上 nextTick 微任务
      // 否则在同一事件内同时将tableShow设置false和true有可能导致组件渲染失败
      this.$nextTick(function(){
        // 加载
        this.tableShow= true
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

.rightbutton {
  float: right;
}

.select {
  float: left;
}

.addbutton {
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

.input {
  display: flex;
}

.right {
  margin-left: 40px;


}

.text {
  margin: 10px 0;
}


</style>
