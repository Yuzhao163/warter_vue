<template>
  <div class="">
    <!--        卡片视图区域-->
    <el-card class="box-card">

      <!--        搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入控制柜名称" v-model="tmnName" clearable @clear="clear">
            <el-button slot="append" icon="el-icon-search" @click="doFilter"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加控制柜</el-button>
        </el-col>
      </el-row>

      <!--        控制柜列表区域-->
      <el-table :data="tmnTableDataShow" stripe style="width: 100%; margin-top: 35px; margin-bottom: 25px">
        <!--        <el-table-column label="" type="index"></el-table-column>-->
        <el-table-column prop="tmnId" label="控制柜id"></el-table-column>
        <el-table-column prop="tmnName" label="控制柜名称"></el-table-column>
        <el-table-column prop="u1TmnID" label="上一控制柜名称" ></el-table-column>
        <el-table-column prop="u2TmnID" label="下一控制柜名称" ></el-table-column>
        <el-table-column prop="pipID" label="所属管线" ></el-table-column>
        <!--                <el-table-column prop="areaID" label="所属分区"></el-table-column>-->
        <el-table-column prop="tmnDesc" label="描述信息"></el-table-column>
        <el-table-column label="操作信息">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editTmnList(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--        分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems">
      </el-pagination>

      <!--            添加控制柜对话框-->
      <el-dialog
          title="提示"
          :visible.sync="addDialogVisible"
          width="50%"
          @close="addDialogClose"
      >

        <el-form :model="addTmnForm" :rules="addTmnFormRules" ref="addTmnFormRef" label-width="120px">
          <el-form-item label="控制柜id" prop="tmnID">
            <el-input v-model="addTmnForm.tmnID"></el-input>
          </el-form-item>
          <el-form-item label="控制柜名称" prop="tmnName">
            <el-input v-model="addTmnForm.tmnName"></el-input>
          </el-form-item>
          <el-form-item label="上一控制柜名称" prop="u1TmnID">
            <el-input v-model="addTmnForm.u1TmnID"></el-input>
          </el-form-item>
          <el-form-item label="上一控制柜名称" prop="u2TmnID">
            <el-input v-model="addTmnForm.u2TmnID"></el-input>
          </el-form-item>
          <el-form-item label="下一控制柜名称" prop="d1TmnID">
            <el-input v-model="addTmnForm.d1TmnID"></el-input>
          </el-form-item>
          <el-form-item label="下一控制柜名称" prop="d2TmnID">
            <el-input v-model="addTmnForm.d2TmnID"></el-input>
          </el-form-item>
          <el-form-item label="分区id" prop="pipID">
            <el-input v-model="addTmnForm.pipID"></el-input>
          </el-form-item>
          <el-form-item label="部件信息1" prop="conPont1">
            <el-input v-model="addTmnForm.conPont1"></el-input>
          </el-form-item>
          <el-form-item label="部件信息2" prop="conPont2">
            <el-input v-model="addTmnForm.conPont2"></el-input>
          </el-form-item>
          <el-form-item label="部件信息3" prop="conPont3">
            <el-input v-model="addTmnForm.conPont3"></el-input>
          </el-form-item>
          <el-form-item label="描述信息" prop="tmnDesc">
            <el-input v-model="addTmnForm.tmnDesc"></el-input>
          </el-form-item>
        </el-form>


        <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogCancle('addTmnFormRef')">取 消</el-button>
                    <el-button type="primary" @click="addTmn">确 定</el-button>
                </span>
      </el-dialog>

      <!--            编辑控制柜对话框-->
      <el-dialog
          title="提示"
          :visible.sync="editTmnDialogVisible"
          width="50%">

        <el-form :model="editTmnForm" :rules="editTmnFormRules" ref="editTmnFormRef" label-width="120px">
          <el-form-item label="控制柜id" prop="tmnId">
            <el-input v-model="editTmnForm.tmnId"></el-input>
          </el-form-item>
          <el-form-item label="控制柜名称" prop="tmnName">
            <el-input v-model="editTmnForm.tmnName"></el-input>
          </el-form-item>
          <el-form-item label="上一控制柜名称(1)" prop="u1TmnID">
            <el-input v-model="editTmnForm.u1TmnID"></el-input>
          </el-form-item>
          <el-form-item label="上一控制柜名称(2)" prop="u2TmnID">
            <el-input v-model="editTmnForm.u2TmnID"></el-input>
          </el-form-item>
          <el-form-item label="下一控制柜名称(1)" prop="d1TmnID">
            <el-input v-model="editTmnForm.d1TmnID"></el-input>
          </el-form-item>
          <el-form-item label="下一控制柜名称(2)" prop="d1TmnID">
            <el-input v-model="editTmnForm.d2TmnID"></el-input>
          </el-form-item>
          <el-form-item label="分区id" prop="pipID">
            <el-input v-model="editTmnForm.pipID"></el-input>
          </el-form-item>
          <el-form-item label="部件信息(1)" prop="conPont1">
            <el-input v-model="editTmnForm.conPont1"></el-input>
          </el-form-item>
          <el-form-item label="部件信息(2)" prop="conPont2">
            <el-input v-model="editTmnForm.conPont2"></el-input>
          </el-form-item>
          <el-form-item label="部件信息(3)" prop="conPont3">
            <el-input v-model="editTmnForm.conPont3"></el-input>
          </el-form-item>
          <el-form-item label="描述信息" prop="tmnDesc">
            <el-input v-model="editTmnForm.tmnDesc"></el-input>
          </el-form-item>
        </el-form>


        <span slot="footer" class="dialog-footer">
                    <el-button @click="editTmnDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editTmn()">确 定</el-button>
                </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Device",
  data() {
    return {
      // 搜索功能 存储搜索信息
      tmnName: "",
      // 分页功能  前往第4页
      currentPage: 1,
      // 当前页有多少数据
      pageSize: 5,
      // 共有多少数据
      totalItems: 0,
      // 搜索后需要展示的内容
      filterTableData: [],
      // 用来判断是否检索过
      flag: '',
      // 控制柜表信息
      tmnTableData:[],
      // 需要展示的控制柜
      tmnTableDataShow:[],
      // 添加控制柜对话框的显示与隐藏
      addDialogVisible: false,
      // 添加控制柜表单
      addTmnForm: {
        tmnID:'',
        tmnName: '',
        u1TmnID: '',
        u2TmnID: '',
        d1TmnID: '',
        d2TmnID: '',
        pipID: '',
        conPont1: '',
        conPont2: '',
        conPont3: '',
        tmnDesc: '',
      },
      // 添加控制柜表单规则
      addTmnFormRules: {
        tmnID: [
          { required: true, message: "请输入控制柜id1", trigger: "blur"},
        ],
        tmnName: [
          { required: true, message: "请输入用户名", trigger: "blur"},
          // { min: 3, max:10, message: "长度在 3 到 10 个字符", trigger: "blur"}
        ],
        u1TmnID: [
          { required: true, message: "请输入上一控制柜id1", trigger: "blur"},
        ],
        u2TmnID: [
          { required: true, message: "请输入上一控制柜id2", trigger: "blur"},
        ],
        d1TmnID: [
          { required: true, message: "请输入下一控制柜id1", trigger: "blur"},
        ],
        d2TmnID: [
          { required: true, message: "请输入下一控制柜id2", trigger: "blur"},
        ],
        pipID: [
          { required: true, message: "请输入分区id", trigger: "blur"},
        ],
        conPont1: [
          { required: false, message: "请输入部件信息1", trigger: "blur"},
        ],
        conPont2: [
          { required: false, message: "请输入部件信息2", trigger: "blur"},
        ],
        conPont3: [
          { required: false, message: "请输入部件信息3", trigger: "blur"},
        ],
        tmnDesc: [
          { required: false, message: "请输入控制柜描述信息", trigger: "blur"},
        ],
      },
      // 编辑控制柜表单
      editTmnForm: {
        tmnId: '',
        tmnName: '',
        u1TmnID: '',
        u2TmnID: '',
        d1TmnID: '',
        d2TmnID: '',
        pipID: '',
        conPont1: '',
        conPont2: '',
        conPont3: '',
        tmnDesc: '',
      },
      // 编辑控制柜表单规则
      editTmnFormRules: {
      },
      // 编辑控制柜详细信息对话框的显示
      editTmnDialogVisible: false,
    }
  },
  created() {
    // 获取列表信息
    this.getTmnList()
  },
  methods:{
    //获取控制柜列表信息
    async getTmnList() {
      // console.log('获取控制柜列表信息')
      const {data: res} = await this.$axios.get('/getAllTmnList')
      // console.log(res)
      this.tmnTableData = res
      // 判断有多少条数据需要被输出
      this.totalItems = res.length
      // console.log('tmnTableDataShow',this.tmnTableDataShow)
      // console.log('tmnTableData',this.tmnTableData)
      // 判断当前数据是否大于当前页要展示的数据 如果大于 把需要展示的几条展示出来 如果小于 直接展示即可
      if (this.totalItems > this.pageSize){
        for (var i = 0; i < this.pageSize; i++) {
          this.tmnTableDataShow.push(this.tmnTableData[i]);
        }
      } else {
        this.tmnTableDataShow = this.tmnTableData;
      }
    },
    // 清空搜索框
    clear() {
      this.tmnTableDataShow = [];
      this.getTmnList()
    },
    // 搜索功能
    doFilter() {
      // 当查询条件为空时
      if (this.tmnName == '') {
        this.$message.warning('查询条件不能为空！')
        return;
      } else {
        // 当查询条件不为空时
        console.log(this.tmnName)
        this.tmnTableDataShow = []
        this.filterTableData = []
        this.tmnTableData.forEach((value) =>  {
          // 找到所有要搜素的控制柜
          if (value.tmnName) {
            // 在遍历中满足条件的数据存到搜索结果中去
            if (value.tmnName.indexOf(this.tmnName) >= 0) {
              // console.log(value)
              this.filterTableData.push(value)
              // console.log(this.filterTableData)
            }
          }
        })
        // console.log(this.filterTableData)
        // 经过搜索之后的页面展示数据总数变了 下面对页面的展示进行修改
        this.currentPage = 1
        this.totalItems = this.filterTableData.length
        //  计算页面
        let start = (this.currentPage - 1) * this.pageSize
        let end = this.currentPage * this.pageSize
        this.tmnTableDataShow = [];
        for (var i = start; i < end ; i++) {
          // 如果所有的数据都被遍历完就不继续遍历了
          if (this.filterTableData[i]) {
            this.tmnTableDataShow.push(this.filterTableData[i])
          }
        }
      }
      // // 页面根据改变重新统计数据数量和当前页
      // this.currentPage = 1
      // this.totalItems = this.filterTableData.length
      // // 根据值渲染表格
      // this.currentChangePage(this.filterTableData)
      // // 页面初始化数据需要判断是否检索过
      // this.flag = true
    },
    // 分页功能
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.handleCurrentChange(this.currentPage)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      // 需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tmnTableDataShow)
      } else {
        this.currentChangePage(this.filterTableData)
      }
    },
    // 监控当前页码
    currentChangePage() {
      // 计算展示页面的数组从哪个地方开始与结束
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      this.tmnTableDataShow = [];
      for (var i = start; i < end ; i++) {
        // 如果所有的数据都被遍历完就不继续遍历了
        if (this.tmnTableData[i]) {
          this.tmnTableDataShow.push(this.tmnTableData[i])
        }
      }
    },
    // 添加控制柜
    addTmn() {
      this.$axios.post(`/addTmn`,{
        tmnId: this.addTmnForm.tmnID,
        tmnName: this.addTmnForm.tmnName,
        u1TmnID: this.addTmnForm.u1TmnID,
        u2TmnID: this.addTmnForm.u2TmnID,
        d1TmnID: this.addTmnForm.d1TmnID,
        d2TmnID: this.addTmnForm.d2TmnID,
        pipID: this.addTmnForm.pipID,
        conPont1:this.addTmnForm.conPont1,
        conPont2:this.addTmnForm.conPont2,
        conPont3:this.addTmnForm.conPont3,
        tmnDesc: this.addTmnForm.tmnDesc,
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          console.log(200)
          this.addDialogVisible = false
          this.tmnTableDataShow = [];
          this.getTmnList()
          this.currentPage = 1
          this.$message.success("添加成功")
        } else {
          console.log(400)
        }
      }).catch(failResponse => {
        alert(failResponse)
      })
    },
    // 取消添加控制柜
    addDialogCancle(addTmnFormRef) {
      this.addDialogVisible = false
      this.$refs[addTmnFormRef].resetFields();
    },
    // 关闭添加控制柜对话框
    addDialogClose() {
      this.addTmnForm = {}
    },
    // 编辑控制柜
    editTmnList(row) {
      console.log(row)
      console.log(this.editTmnForm)
      console.log("=======")
      this.editTmnForm = row
      console.log(this.editTmnForm)
      this.editTmnDialogVisible = true
      console.log(this.editTmnForm.tmnId)
      console.log(this.editTmnForm.id)
    },
    // 发起编辑控制柜的请求
    editTmn(){
      this.$axios.post('/modifyTmn',{
        id: this.editTmnForm.id,
        tmnId: this.editTmnForm.tmnId,
        tmnName: this.editTmnForm.tmnName,
        u1TmnID: this.editTmnForm.u1TmnID,
        u2TmnID: this.editTmnForm.u2TmnID,
        d1TmnID: this.editTmnForm.d1TmnID,
        d2TmnID: this.editTmnForm.d2TmnID,
        pipID: this.editTmnForm.pipID,
        conPont1:this.editTmnForm.conPont1,
        conPont2:this.editTmnForm.conPont2,
        conPont3:this.editTmnForm.conPont3,
        tmnDesc: this.editTmnForm.tmnDesc,
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          console.log(200)
          this.$message.success('更新成功')
          this.editTmnDialogVisible = false
          this.tmnTableDataShow = [];
          this.getTmnList()
        } else {
          console.log(400)
        }
      }).catch(err => err)
    },
    // 删除控制柜
    removeById(row) {
      console.log(row)
      console.log(row.tmnId)
      this.$confirm('此操作将永久删除该控制柜, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('确认删除！')
        this.$axios
            .post('/deleteTmn',{tmnId:row.tmnId})
            .then(successResponse => {
              if (successResponse.data.code === 200) {
                console.log(200)
                this.$message.success('删除成功')
                this.currentPage = 1
                this.tmnTableDataShow = [];
                this.getTmnList()
              } else {
                console.log(400)
              }
            })
            .catch(failResponse => {
              alert(failResponse)
            })
      }).catch(() => {
        this.$message.info('已经取消删除')
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
.input{
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
