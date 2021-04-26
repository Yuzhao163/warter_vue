<template>
  <div class="">
    <!--        卡片视图区域-->
    <el-card class="box-card">
        <!-- 顶部搜索区域-->
        <el-row class="cat_opt">
            <!--        搜索与添加区域-->
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input prefix-icon="el-icon-search" placeholder="请输入控制柜名称" v-model="tmnName" @input="changeSearch" clearable @clear="clear">
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addButton">添加控制柜</el-button>
                </el-col>
            </el-row>
        </el-row>

      <!--        控制柜列表区域-->
      <el-table :data="tmnTableDataShow.slice((currentPage-1)*pageSize,currentPage*pageSize)" stripe style="width: 100%; margin-top: 35px; margin-bottom: 25px">
<!--      <el-table :data="tmnTableDataShow" stripe style="width: 100%; margin-top: 35px; margin-bottom: 25px">-->
<!--        <el-table-column label="#" type="index"></el-table-column>-->
        <el-table-column prop="tmnId" label="控制柜id" width="50px" ></el-table-column>
        <el-table-column prop="tmnName" label="控制柜名称"></el-table-column>
        <el-table-column prop="u1TmnName" label="上一控制柜" ></el-table-column>
<!--        <el-table-column prop="u2TmnName" label="上一控制柜名称" ></el-table-column>-->
        <el-table-column prop="d1TmnName" label="下一控制柜" ></el-table-column>
<!--        <el-table-column prop="d2TmnName" label="下一控制柜名称" ></el-table-column>-->
        <el-table-column prop="AreaName" label="所属分区" ></el-table-column>
        <el-table-column prop="pipName" label="所属管线" ></el-table-column>
        <el-table-column prop="conPont1" label="部件信息" ></el-table-column>
        <el-table-column prop="tmnDesc" label="描述信息"></el-table-column>
        <el-table-column prop="tmnLeader" label="管理人员"></el-table-column>
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
            :total="tmnTableDataShow.length">
      </el-pagination>

      <!--            添加控制柜对话框-->
      <el-dialog
          title="提示"
          :visible.sync="addDialogVisible"
          width="35%"
          @close="addDialogClose"
      >
          <el-form :model="addTmnForm" :rules="addTmnFormRules" ref="addTmnFormRef" label-width="145px">
          <el-form-item label="控制柜id" prop="tmnID">
              <el-input v-model="addTmnForm.tmnID" class="input"></el-input>

          </el-form-item>
          <el-form-item label="控制柜名称" prop="tmnName">
              <el-input v-model="addTmnForm.tmnName" class="input"></el-input>
          </el-form-item>

          <el-form-item label="所属分区">
              <el-select v-model="addTmnForm.areaID" @change="getAreas">
                  <el-option v-for="item in arealist"
                             :key="item.id"
                             :label="item.areaName"
                             :value="item.areaID">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="所属管线">
              <el-select v-model="addTmnForm.pipID"  @change="getPips">
                  <el-option v-for="item in piplist"
                             :key="item.id"
                             :label="item.pipName"
                             :value="item.pipID">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="上一控制柜名称">
              <el-select v-model="addTmnForm.u1TmnID" @change="getTmns">
                  <el-option v-for="item in tmnlist"
                             :key="item.id"
                             :label="item.tmnName"
                             :value="item.tmnId">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="下一控制柜名称">
              <el-select v-model="addTmnForm.d1TmnID" @change="getNextTmns">
                  <el-option v-for="item in tmnlist2"
                             :key="item.id"
                             :label="item.tmnName"
                             :value="item.tmnId">
                  </el-option>
              </el-select>
          </el-form-item>

          <el-form-item label="部件信息1" prop="conPont1">
            <el-input v-model="addTmnForm.conPont1" class="input"></el-input>
          </el-form-item>
          <el-form-item label="部件信息2" prop="conPont2">
            <el-input v-model="addTmnForm.conPont2" class="input"></el-input>
          </el-form-item>
          <el-form-item label="部件信息3" prop="conPont3">
            <el-input v-model="addTmnForm.conPont3" class="input"></el-input>
          </el-form-item>
          <el-form-item label="描述信息" prop="tmnDesc">
            <el-input type="textarea" v-model="addTmnForm.tmnDesc"></el-input>
          </el-form-item>
          <el-form-item label="管理人员">
              <el-select v-model="addTmnForm.tmnLeaderID" @change="getAreas">
                  <el-option v-for="item in leaderlist"
                             :key="item.userID"
                             :label="item.userName"
                             :value="item.userID">
                  </el-option>
              </el-select>
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
          width="35%">
        <el-form :model="editTmnForm" :rules="editTmnFormRules" ref="editTmnFormRef" label-width="145px">
          <el-form-item label="控制柜id" prop="tmnId">
            <el-input v-model="editTmnForm.tmnId" class="input"></el-input>
          </el-form-item>
          <el-form-item label="控制柜名称" prop="tmnName">
            <el-input v-model="editTmnForm.tmnName" class="input"></el-input>
          </el-form-item>
            <el-form-item label="所属分区">
                <el-select v-model="editTmnForm.AreaID" @change="getAreas">
                    <el-option v-for="item in arealist"
                               :key="item.id"
                               :label="item.areaName"
                               :value="item.areaID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属管线">
                <el-select v-model="editTmnForm.pipID"  @change="getPips">
                    <el-option v-for="item in piplist"
                               :key="item.id"
                               :label="item.pipName"
                               :value="item.pipID">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上一控制柜名称">
                <el-select v-model="editTmnForm.u1TmnID" @change="getTmns">
                    <el-option v-for="item in tmnlist"
                               :key="item.id"
                               :label="item.tmnName"
                               :value="item.tmnId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="下一控制柜名称">
                <el-select v-model="editTmnForm.d1TmnID" @change="getNextTmns">
                    <el-option v-for="item in tmnlist2"
                               :key="item.id"
                               :label="item.tmnName"
                               :value="item.tmnId">
                    </el-option>
                </el-select>
            </el-form-item>
          <el-form-item label="部件信息(1)" prop="conPont1">
            <el-input v-model="editTmnForm.conPont1" class="input"></el-input>
          </el-form-item>
          <el-form-item label="部件信息(2)" prop="conPont2">
            <el-input v-model="editTmnForm.conPont2" class="input"></el-input>
          </el-form-item>
          <el-form-item label="部件信息(3)" prop="conPont3">
            <el-input v-model="editTmnForm.conPont3" class="input"></el-input>
          </el-form-item>
          <el-form-item label="描述信息" prop="tmnDesc">
            <el-input type="textarea" v-model="editTmnForm.tmnDesc"></el-input>
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
        arealist:[],
        //  记录拿到的id去找管线
        piplist:[],
        tmnlist:[],
        //  记录下一控制柜信息
        tmnlist2:[],
        //  控制柜管理人员
        leaderlist:[],


      // 搜索功能 存储搜索信息
      tmnName: "",

      // 分页功能  前往第4页
      currentPage: 1,
      // 当前页有多少数据
      pageSize: 5,
      // 共有多少数据
      totalItems: 20,

      // 搜索后需要展示的内容
      filterTableData: [],
      // 用来判断是否检索过
      flag: 0,

      // 控制柜表信息
      tmnTableData:[],
      // 需要展示的控制柜
      tmnTableDataShow:[],



      // 添加控制柜对话框的显示与隐藏
      addDialogVisible: false,
      // 添加功能下拉框选项
      // 添加控制柜表单
      addTmnForm: {
        tmnID:'',
        tmnName: '',
        u1TmnID: '',
        u1TmmnName:'',
        u2TmnID: '',
        d1TmnID: '',
        d2TmnID: '',
        conPont1: '',
        conPont2: '',
        conPont3: '',
        tmnDesc: '',
        pipID:'',
        areaID:'',
        tmnLeaderID:''
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
          d1TmnName: '',
        d2TmnID: '',
          d2TmnName: '',
        conPont1: '',
        conPont2: '',
        conPont3: '',
        tmnDesc: '',
        pipID:'',
          AreaID:'',
          AreaName:'',
          tmnLeader: ''
      },
      // 编辑控制柜表单规则
      editTmnFormRules: {},
      // 编辑控制柜详细信息对话框的显示
      editTmnDialogVisible: false,


      // 解决下拉框问题新建的数组

    }
  },
  created() {
    // 获取列表信息
    this.getTmnList()

  },
  methods:{
      getAreas() {
          //测试是否拿到分区
              this.$axios.get('/getAllAreas').then(res => {
                  this.arealist = res.data
                  // this.areaid = this.arealist.areaid

                  console.log(this.arealist,"res",res)
                  this.getPips()
              })

      },
      getPips() {
          // 将分区id 传入 请求后端 获得管线名称和id
          console.log(this.addTmnForm.areaID)
          if (this.addDialogVisible === true) {
              this.$axios.get('/getPips',{params:{areaID:this.addTmnForm.areaID}})
                    .then(res => {
                        this.piplist = res.data
                        console.log("piplist add",this.piplist,res)
                    })
          } else if (this.editTmnDialogVisible === true) {
              this.$axios.get('/getPips',{params:{areaID:this.editTmnForm.AreaID}})
                    .then(res2 => {
                        this.piplist = res2.data
                        console.log("piplist edit",this.piplist,res2)
                    })
          }
          this.getTmns()
      },
      getTmns() {
          // 前端控制柜下拉框
          // 如果管线内没有控制柜 要显示 我是第一个控制柜
          // 如果管线内有控制柜 插在这个控制柜前面 上一控制柜显示 我是第一个控制柜 下一控制柜显示已经有的控制柜名称
          //                    插在这个控制柜后面 上一控制柜显示已有控制柜名称 下一控制柜显示 我是最后一个控制柜
          this.$axios.get('/getTmns',{params:{pipID:this.addTmnForm.pipID}})
                .then(res => {
                    console.log(res)
                    this.tmnlist = res.data
                    this.getNextTmns()
                })
      },
      getNextTmns() {
          this.tmnlist2 = this.tmnlist
      },
      //获取控制柜管理人员列表
      getTmnLeader() {
          this.$axios.get('/getTmnLeader')
            .then(res => {
                console.log(res.data)
                this.leaderlist = res.data
            })

      },
    //获取控制柜列表信息
    getTmnList() {
      this.$axios.get('/getTmnList').then(res => {
          this.tmnTableData = res.data
          console.log(this.tmnTableData)
          this.handleTmnTableDataShow()
      })

    },
    //  分页功能
      handleSizeChange(size) {
          this.currentPage = 1;
          this.pagesize = size;
          console.log(this.pagesize)  //每页下拉显示数据
      },
      handleCurrentChange(currentPage){
          this.currentPage = currentPage;
          console.log(this.currentPage)  //点击第几页
      },
      handleTmnTableDataShow() {
        this.tmnTableDataShow = this.tmnTableData
          console.log("show",this.tmnTableDataShow)
      },
    // 搜索功能（利用双向绑定）
    changeSearch() {
      this.tmnTableDataShow = []
      var j = 0
      if (this.tmnName === '') {
        this.tmnTableDataShow = this.tmnTableData
      } else {
        for(var i=0; i<this.tmnTableData.length; i++) {
          if(this.tmnTableData[i].tmnName.search(this.tmnName) >= 0) {
            this.tmnTableDataShow[j] = this.tmnTableData[i]
            j++
          }
        }
      }
    },
    // 清空搜索框
    clear() {
      this.tmnTableDataShow = [];
      this.getTmnList()
        this.pagesize = 5
        this.currentPage = 1
    },

    // 管线下拉框部分（二维数组的增加）
    // arrayPipPush() {
    //     this.pipArrayList.push({
    //         arrayPipID: this.arrayPipID,
    //         arrayPipName: this.arrayPipName
    //     })
    // },
    // // 更新管线的下拉框
    // updatePipOption() {
    //     // addTmnNewList[0]
    //     // 首先将第一个第一个值进行赋值
    //     this.arrayPipID = this.tmnTableData[0].pipID
    //     this.arrayPipName = this.tmnTableData[0].pipName
    //     this.arrayPipPush()
    //     // 定义变量记录循环的每一次pipid和pipname
    //     for (var i=0; i<this.tmnTableData.length; i++) {
    //         var a = this.tmnTableData[i].pipID
    //         var b = this.tmnTableData[i].pipName
    //         // 判断是否相等
    //         for (var j=0; this.pipArrayList[j]; j++) {
    //             if ((this.pipArrayList[j].arrayPipID===a) && (this.pipArrayList[j].arrayPipName===b)) {
    //                 this.index++
    //             }
    //         }
    //         // 不存在相等加入数组
    //         if (this.index === 0) {
    //             this.arrayPipID = a
    //             this.arrayPipName = b
    //             this.arrayPipPush()
    //         }
    //         this.index = 0
    //     }
    // },
    // // 添加控制柜按钮
    addButton() {
        this.addDialogVisible = true
        // this.updatePipOption()
        this.getAreas()
        this.getTmnLeader()
    },
    // 添加控制柜
    async addTmn() {

        const {data: res} = await this.$axios.get('/addTmn',{params:{
                TmnID:this.addTmnForm.tmnID,
                TmnName:this.addTmnForm.tmnName,
                U1TmnID:this.addTmnForm.u1TmnID,
                U2TmnID:this.addTmnForm.u2TmnID,
                D1TmnID:this.addTmnForm.d1TmnID,
                D2TmnID:this.addTmnForm.d2TmnID,
                ConPont1:this.addTmnForm.conPont1,
                ConPont2:this.addTmnForm.conPont2,
                ConPont3:this.addTmnForm.conPont3,
                TmnDesc:this.addTmnForm.tmnDesc,
                PipID:this.addTmnForm.pipID,
                AreaID:this.addTmnForm.areaID,
                TmnLeadID: this.addTmnForm.tmnLeaderID
            }})
        if(res == 1) {
            this.addDialogVisible = false
            this.tmnTableDataShow = [];
            this.getTmnList()
            this.currentPage = 1
            this.$message.success("添加成功")
        } else {
            this.$message.error("添加失败")
        }
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
      this.editTmnForm = row

        console.log("row",row)
        console.log("editForm",this.editTmnForm)
      // this.updatePipOption()
      this.editTmnDialogVisible = true
        this.getAreas()
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
        if (successResponse.data === 1) {
          this.$message.success('更新成功')
          this.editTmnDialogVisible = false
          this.currentPage = 1
          this.tmnTableDataShow = [];
          this.getTmnList()
        } else {
            this.$message.error('更新失败')
        }
      }).catch(err => err)
    },
    // 删除控制柜
    removeById(row) {
      this.$confirm('此操作将永久删除该控制柜, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          console.log(row)
          console.log(row.tmnId)

        this.$axios.post('/deleteTmn',{
                tmnID: row.tmnId,
                tmnName: row.tmnName,
                u1TmnID: row.u1TmnID,
                u2TmnID: row.u2TmnID,
                d1TmnID: row.d1TmnID,
                d2TmnID: row.d2TmnID,
                conPont1:row.conPont1,
                conPont2:row.conPont2,
                conPont3:row.conPont3,
                tmnDesc: row.tmnDesc,
                pipID: row.pipID,
                areaID: row.AreaID,
        }
        // {
        //     tmnId:row.tmnId}
            )
          .then(successResponse => {
              if (successResponse.data === 1){
                  this.$message.success('删除成功')
                  this.currentPage = 1
                  this.tmnTableDataShow = [];
                  this.getTmnList()
              } else {
                  this.$message.error('删除失败')
              }
          })
          .catch(failResponse => {
              alert(failResponse)
          })
      }).catch(err => err)
    },
    // 选项部分
    changeValue(value) {
      console.log(value)
    }
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
  /*width: 218px;*/
  /*padding-left: 30px;*/
  /*  position: relative;*/
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
