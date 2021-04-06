<template>
  <div class="container">
    <div class="toptable">
      <div class="select">
        <el-input placeholder="请输入用户名称" v-model="searchtext" @input="changeSearch">
        </el-input>
      </div>

      <!--      <div class="leftbutton">-->
      <!--        <button class="searchbutton">查找</button>-->
      <!--        <button class="addbutton">清除</button>-->
      <!--      </div>-->
      <div class="rightbutton">
        <button class="addbutton" @click="addbox=true">添加</button>
        <button class="addbutton" @click="test()">测试</button>
      </div>
    </div>

    <el-table
        :data="tableDataShow.slice((currentPage-1)*pageSize,currentPage*pageSize)"

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
              @click="handleEdit(scope.$index, scope.row),editbox=true">修改
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="delconfirm(scope.$index,scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
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
    <!--    修改员工信息-->
    <el-dialog class="dialog" style="text-align: left" title="修改用户信息" :visible.sync="editbox">
      <div class="input">

        <div class="left">
          <div class="text"><span style="color: red">*</span>用户名：</div>
          <el-input v-model="staffData.userName" placeholder=staffData.userName></el-input>
          <div class="text"><span style="color: red">*</span>密码：</div>
          <el-input v-model="staffData.userPswd" placeholder="请输入密码"></el-input>
          <span style="color:#2496ee;font-size: 10px">不填写则设置初始密码为123456</span>
          <div class="text">真实姓名：</div>
          <el-input v-model="staffData.realName" placeholder="请输入真实名称"></el-input>
          <div class="text">手机号：</div>
          <el-input v-model="staffData.moPhone" placeholder="请输入手机号"></el-input>
          <div class="text">单位名称：</div>
          <el-input v-model="staffData.dptname" placeholder="请输入单位名称"></el-input>
        </div>
        <div class="right">
          <div class="text"><span style="color: red">*</span>用户类别：</div>
          <el-select v-model="staffData.uclassID" ref="select1" placeholder="--用户类别--"
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

        <el-button @click="editbox = false, this.Index_TableData()">取 消</el-button>
        <el-button type="primary" @click="editbox = false,updatastaff()">修 改</el-button>
      </div>
    </el-dialog>
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
        <el-button type="primary" @click="addstaff(),addbox = false">确 定</el-button>
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
      editbox: false,
      searchtext: '',//搜索条件
      tableData: [],
      tableDataShow: [],
      staffData: [],//修改数据时用于存放行数据
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
      },
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5, // 每页的数据条数
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
            this.tableDataShow= res.data;

          })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          })
    },
    delconfirm(index, row) {
      this.$confirm('将删除该用户, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = qs.stringify({
          UserID: row.userID,
        });
        console.log(row.userID)
        console.log(index)
        this.$axios
            .post('/delstaff', params).then(res => {
          console.log(res);
          this.Index_TableData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addstaff() {
      var params = qs.stringify({
        UserName: this.addmessage.UserName,
        UserPswd: this.addmessage.UserPswd,
        UClassID: this.addmessage.UClassID,
        MoPhone: this.addmessage.MoPhone,
        RealName: this.addmessage.RealName,
        DPTName: this.addmessage.DPTName,
      })
      this.$axios.post('/addstaff', params).then(res => {
        if (res.data.code === 200)
          console.log(res);
        this.Index_TableData()
      })
          .catch(failResponse => {
            console.log(params)
            console.log(failResponse)
            alert(failResponse)
          })
    },
    searchstaff() {
      var j = 0;
      if (this.searchtext == '') {
        this.tableDataShow = this.tableData;
        console.log('10' + this.tableData)
      } else {
        for (var i = 0; i < this.tableData.length; i++) {

        if (this.tableData[i].userName.search(this.searchtext) >= 0) {
          this.tableDataShow[j] = this.tableData[i];
          j++;
          console.log(j)
        }
        }
      }

    },
    changeSearch() {
      this.tableDataShow=[];
this.searchstaff();
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.staffData = JSON.parse(JSON.stringify(row));
      console.log(this.staffData)
    },
    updatastaff() {
      this.$confirm('将更新用户信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = qs.stringify({

          UserID: this.staffData.userID,
          UserName: this.staffData.userName,
          UserPswd: this.staffData.userPswd,
          UClassID: this.staffData.uclassID,
          MoPhone: this.staffData.moPhone,
          RealName: this.staffData.realName,
          DPTName: this.staffData.dptname,
        });
        this.$axios
            .post('/updstaff', params).then(res => {
          console.log(res);
          this.Index_TableData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
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
      console.log(this.tableData[0])
      console.log(this.tableDataShow)
    }

  }
}
</script>

<style scoped>
.toptable {

}

.container {
  padding: 20px 30px 30px 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.leftbutton {
  float: left;
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

.searchbutton {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #3f9dfe;
  border: 1px solid #a5cfff;
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
