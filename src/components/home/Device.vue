<template>
  <div class="">
      <!--    卡片视图区域    -->
      <el-card class="box-card">

          <!--    顶部搜索区域    -->
          <el-row >
              <el-row :gutter="20">
                  <el-col :span="6">
                      <!--                        <el-input prefix-icon="el-icon-search" placeholder="请搜索控制柜名称"-->
                      <!--                                  v-model="tmnName" @input="changeSearch" clearable @clear="clear"></el-input>-->
                  </el-col>
                  <el-col :span="4">
                      <el-button type="primary" @click="addTmn">添加控制柜</el-button>
                  </el-col>
              </el-row>
          </el-row>


          <!--    控制柜列表区域    -->
          <el-table :data="showTableData" stripe style="width: 100%; margin-top: 35px; margin-bottom: 25px">
              <el-table-column prop="tmnId" label="控制柜id" width="50px" ></el-table-column>
              <el-table-column prop="tmnName" label="控制柜名称"></el-table-column>
              <el-table-column prop="u1TmnName" label="上一控制柜" ></el-table-column>
              <el-table-column prop="d1TmnName" label="下一控制柜" ></el-table-column>
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
                  :page-sizes="[1, 5, 10, 20, 50]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total=total>
          </el-pagination>


          <!--            添加控制柜对话框-->
          <el-dialog title="提示" :visible.sync="addDialogVisible" width="35%" @close="addDialogCancle('addTmnFormRef')">
              <el-form :model="addTmnForm" :rules="addTmnFormRules" ref="addTmnFormRef" label-width="130px">
                  <el-form-item label="控制柜名称" prop="tmnName">
                      <el-input v-model="addTmnForm.tmnName" class="input"></el-input>
                  </el-form-item>
                  <el-form-item label="所属分区">
                      <el-select v-model="addTmnForm.areaID" clearable @change="getAreas">
                          <el-option v-for="item in arealist"
                                     :key="item.id"
                                     :label="item.areaName"
                                     :value="item.areaID">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="所属管线">
                      <el-select v-model="addTmnForm.pipID" clearable @change="getPips">
                          <el-option v-for="item in piplist"
                                     :key="item.id"
                                     :label="item.pipName"
                                     :value="item.pipID">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="上一控制柜名称">
                      <el-select v-model="addTmnForm.u1TmnID" clearable @clear="clearTmn()"  placeholder="默认在该管线的第一个位置" @change="getTmns">
                          <el-option v-for="(item,index) in tmnlist"
                                     :key="index"
                                     :label="item.tmnName"
                                     :value="item.tmnId">
                              <div @click="setTmnindex(index)">{{item.tmnName}}</div>
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="下一控制柜名称">
                      <el-input v-model="nextTmn.tmnname" class="input" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="部件信息1" prop="conPont1">
                      <el-input v-model="addTmnForm.conPont1" class="input"></el-input>
                  </el-form-item>
                  <el-form-item label="描述信息" prop="tmnDesc">
                      <el-input type="textarea" v-model="addTmnForm.tmnDesc"></el-input>
                  </el-form-item>
                  <el-form-item label="管理人员">
                      <el-select v-model="addTmnForm.tmnLeaderID" multiple>
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
                    <el-button type="primary" @click="addSubmit">确 定</el-button>
                </span>
          </el-dialog>

          <!--            编辑控制柜对话框-->
          <el-dialog title="提示" :visible.sync="editTmnDialogVisible" width="35%">
              <el-form :model="editTmnForm" :rules="editTmnFormRules" ref="editTmnFormRef" label-width="145px">
                  <el-form-item label="控制柜id" prop="tmnId" >
                      <el-input v-model="editTmnForm.tmnId" class="input" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="控制柜名称" prop="tmnName">
                      <el-input v-model="editTmnForm.tmnName" @input="onInput()" class="input"></el-input>
                  </el-form-item>
                  <el-form-item label="所属分区">
                      <el-select v-model="editTmnForm.AreaID" @change="getAreas" clearable>
                          <el-option v-for="item in arealist"
                                     :key="item.id"
                                     :label="item.areaName"
                                     :value="item.areaID">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="所属管线">
                      <el-select v-model="editTmnForm.pipID" @change="getPips">
                          <el-option v-for="item in piplist"
                                     :key="item.id"
                                     :label="item.pipName"
                                     :value="item.pipID">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="上一控制柜名称">
                      <el-select v-model="editTmnForm.u1TmnID" placeholder="默认在该管线的第一个位置" @change="getTmns">
                          <el-option v-for="(item,index) in tmnlist"
                                     :key="index"
                                     :label="item.tmnName"
                                     :value="item.tmnId">
                              <div @click="setTmnindex(index)">{{item.tmnName}}</div>
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="下一控制柜名称">
                      <el-input v-model="nextTmn.tmnname" class="input" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="部件信息1" prop="conPont1">
                      <el-input v-model="editTmnForm.conPont1" @input="onInput()" class="input"></el-input>
                  </el-form-item>
                  <el-form-item label="描述信息" prop="tmnDesc">
                      <el-input type="textarea" @input="onInput()" v-model="editTmnForm.tmnDesc"></el-input>
                  </el-form-item>
                  <el-form-item label="管理人员">
                      <el-select v-model="editTmnForm.tmnLeader" multiple @change="getTmnLeader">
                          <el-option v-for="item in leaderlist"
                                     :key="item.userID"
                                     :label="item.userName"
                                     :value="item.userID">
                          </el-option>
                      </el-select>
                  </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                    <el-button @click="editClose()">取 消</el-button>
                    <el-button type="primary" @click="editTmn()">确 定</el-button>
                </span>
          </el-dialog>




      </el-card>
  </div>
</template>

<script>
    import qs from "qs";

export default {
  name: "Device",
    data() {
        return {
            // 存放控制柜信息
            tmnTableData:[],
            // 存放修改格式的控制柜信息
            showTableData:[],

            // 分页功能部分
            currentPage: 1, // 前往第几页 默认为1
            pageSize: 5,    // 当前页有多少条数据 默认5
            total: 10,      //一共有多少条数据 默认20

            // 添加控制柜
            addDialogVisible: false,
            addTmnForm: {
                tmnID:'',
                tmnName: '',
                u1TmnID: '',
                u1TmnName:'',
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
                tmnName: [
                    { required: true, message: "请输入控制柜名称", trigger: "blur"},
                    { min: 3, max:15, message: "长度在 3 到 15 个字符", trigger: "blur"}
                ],
                u1TmnID: [
                    { required: true, message: "请输入上一控制柜id1", trigger: "blur"},
                ],
                d1TmnID: [
                    { required: true, message: "请输入下一控制柜id1", trigger: "blur"},
                ],
                pipID: [
                    { required: true, message: "请输入分区id", trigger: "blur"},
                ],
            },

            // 下拉框存储
            arealist:[],    // 分区列表
            piplist:[],     // 管线列表
            tmnlist:[],     // 控制柜列表
            nextTmn:{       // 下一控制柜
                tmnIndex:'',
                tmnid:'',
                tmnname:'',
            },
            leaderlist:[],  // 控制柜管理人员

            // 编辑控制柜
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
                // tmnLeadID: '',
                tmnLeader:[]
            },
            // 编辑控制柜表单规则
            editTmnFormRules: {
                tmnName: [
                    { required: true, message: "请输入控制柜名称", trigger: "blur"},
                    { min: 3, max:15, message: "长度在 3 到 15 个字符", trigger: "blur"}
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
            },
            // 编辑控制柜详细信息对话框的显示
            editTmnDialogVisible: false,
            leadermessage:[],
            TmnLeaderID:[],

        }
    },
  created() {
    // 获取列表信息
    this.getTmnList()

  },
    methods: {
        // 获取控制柜信息
        getTmnList() {
            this.$axios.get('/getTmnListByPage',{ params: {
                    page: this.currentPage,
                    size: this.pageSize
                }})
                .then(res => {
                    this.tmnTableData = res.data
                    this.$axios.get('/getTmnSize')
                        .then(res => {
                            this.total = res.data
                            this.showTableData = JSON.parse(JSON.stringify(this.tmnTableData))
                            this.showLeader()
                        })
                })
        },
        // 解决管理人员名称拼接的问题
        showLeader() {
            for (var i = 0; i < this.showTableData.length; i++) {
                var leader = '';
                for(var j =0; j<this.showTableData[i].TmnLeader.length; j++) {
                    var leaderName = this.showTableData[i].TmnLeader[j].userName
                    var leaderPhone = this.showTableData[i].TmnLeader[j].MoPhone
                    leader = leaderName+'-'+leaderPhone+";"+leader
                }
                this.showTableData[i].tmnLeader = leader;
            }
        },

        // 分页功能
        //  每页显示的条数 （点击后将当前页数重置为1）
        handleSizeChange(size) {
            this.pageSize = size
            this.currentPage = 1
            this.getTmnList()
        },
        //  当前点击的是第几页 （点击后相当于根据页数获取数据）
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
            this.getTmnList()
        },

        // 添加控制柜对话框
        addTmn(){
            this.addDialogVisible = true
            this.getAreas()
            this.getTmnLeader()
        },
        // 得到分区下拉框
        getAreas() {
            //测试是否拿到分区
            this.$axios.get('/getAllAreas').then(res => {
                this.arealist = res.data
                // 分区变化时候下面置空
                this.addTmnForm.pipID=''
                this.addTmnForm.u1TmnID=''
                this.nextTmn.tmnname=''
                this.getPips()
            })
        },
        // 得到管线下拉框
        getPips() {
            if (this.addDialogVisible === true) {
                this.addTmnForm.u1TmnID=''
                this.nextTmn.tmnname=''
                this.$axios.get('/getPips',{params:{areaID:this.addTmnForm.areaID}})
                    .then(res => {
                        this.piplist = res.data
                    })
            } else if (this.editTmnDialogVisible === true) {
                this.$axios.get('/getPips',{params:{areaID:this.editTmnForm.AreaID}})
                    .then(res2 => {
                        this.piplist = res2.data
                    })
            }
            this.getTmns()
        },
        getTmns() {
            if (this.addDialogVisible === true) {
                this.$axios.get('/getTmns',{params:{pipID:this.addTmnForm.pipID}})
                    .then(res => {
                        this.tmnlist = res.data
                    })
            } else if (this.editTmnDialogVisible === true) {
                this.$axios.get('/getTmns',{params:{pipID:this.editTmnForm.pipID}})
                    .then(res => {
                        this.tmnlist = res.data
                    })
            }
        },
        // 获取控制柜管理人员列表
        getTmnLeader() {
            this.$axios.get('/getTmnLeader')
                .then(res => {
                    this.leaderlist = res.data
                })

        },
        // 当分区发生变化时清空管线控制柜选项
        clearTmn() {
            this.nextTmn.tmnname=''
        },
        // 设置下一控制柜
        setTmnindex(index){
            console.log(index)
            console.log(this.tmnlist.length)
            if(index<this.tmnlist.length-1){
                this.nextTmn.tmnIndex=index
                this.nextTmn.tmnid=this.tmnlist[index+1].tmnId
                this.nextTmn.tmnname=this.tmnlist[index+1].tmnName
                this.editTmnForm.d1TmnID= this.nextTmn.tmnid
            }
            else{
                this.nextTmn.tmnid=0
                this.nextTmn.tmnname='无'
                this.editTmnForm.d1TmnID = ''
            }


        },
        // 提交添加请求
        async addSubmit() {
            if (this.addTmnForm.tmnName==='') {
                this.$message.error('请填写控制柜名称！')
            } else if (this.addTmnForm.areaID==='') {
                this.$message.error('请选择分区！')
            } else if (this.addTmnForm.pipID==='') {
                this.$message.error('请选择管线！')
            } else {
                var params = qs.stringify({
                    TmnName:this.addTmnForm.tmnName,
                    U1TmnID:this.addTmnForm.u1TmnID,
                    U2TmnID:this.addTmnForm.u2TmnID,
                    D1TmnID:this.nextTmn.tmnid,
                    D2TmnID:this.addTmnForm.d2TmnID,
                    ConPont1:this.addTmnForm.conPont1,
                    ConPont2:this.addTmnForm.conPont2,
                    ConPont3:this.addTmnForm.conPont3,
                    TmnDesc:this.addTmnForm.tmnDesc,
                    PipID:this.addTmnForm.pipID,
                    AreaID:this.addTmnForm.areaID,
                    TmnLeader: this.addTmnForm.tmnLeaderID
                },{arrayFormat: 'repeat'})
                const {data: res} = await this.$axios.post('/addTmn',params)
                if(res == 1) {
                    this.addDialogVisible = false
                    this.showTableData = []
                    this.nextTmn = []
                    this.getTmnList()
                    this.$message.success("添加成功")
                } else {
                    this.$message.error("添加失败")
                }
            }
        },
        // 取消或关闭添加控制柜对话框
        addDialogCancle(addTmnFormRef){
            this.addDialogVisible = false
            this.$refs[addTmnFormRef].resetFields();
            // 取消添加 列表置空
            this.arealist=[]
            this.piplist=[]
            this.leaderlist=[]
            this.nextTmn=[]
        },

        // 编辑控制柜
        editTmnList(row) {
            console.log("row",row)
            console.log("form",this.editTmnForm)
            this.editTmnForm = {}
            this.TmnLeaderID = []

            // this.editTmnForm = row
            this.editTmnForm.tmnId = row.tmnId
            this.editTmnForm.tmnName = row.tmnName,
                this.editTmnForm.u1TmnID = row.u1TmnID,
                this.editTmnForm.u2TmnID = row.u2TmnID,
                this.nextTmn.tmnname = row.d1TmnName,
                this.editTmnForm.d1TmnID =this.nextTmn.tmnid,
                // this.editTmnForm.d1TmnID = row.d1TmnID,
                this.editTmnForm.d2TmnID = row.d2TmnID,
                this.editTmnForm.conPont1 = row.conPont1,
                this.editTmnForm.conPont2 = row.conPont2,
                this.editTmnForm.conPont3 = row.conPont3,
                this.editTmnForm.tmnDesc = row.tmnDesc,
                this.editTmnForm.pipID = row.pipID,
                this.editTmnForm.AreaID = row.AreaID,
                this.editTmnForm.AreaName = row.AreaName

            console.log("赋值之后的form",this.editTmnForm)

            // 拿到管理人员的id
            for (var i = 0; i < this.tmnTableData.length ; i++) {
                if(this.tmnTableData[i].tmnId === row.tmnId) {
                    this.leadMessage = this.tmnTableData[i].TmnLeader
                }
            }
            for (var j = 0; j < this.leadMessage.length; j++) {
                this.TmnLeaderID[j] = this.leadMessage[j].userID
            }
            if(this.leadMessage.length == 0) {
                this.editTmnForm.tmnLeader = []
            } else {
                this.editTmnForm.tmnLeader = this.TmnLeaderID
            }

            this.editTmnDialogVisible = true
            this.getAreas()
            this.getTmnLeader()

        },
        // 发起编辑控制柜的请求
        editTmn() {
            console.log("发起请求的form",this.editTmnForm)
            if (this.editTmnForm.tmnLeader.length==0) {
                this.editTmnForm.tmnLeader = []
            }
            var params = qs.stringify({
                id: this.editTmnForm.id,
                TmnID: this.editTmnForm.tmnId,
                TmnName: this.editTmnForm.tmnName,
                U1TmnID: this.editTmnForm.u1TmnID,
                U2TmnID: this.editTmnForm.u2TmnID,
                D1TmnID: this.editTmnForm.d1TmnID,
                D2TmnID: this.editTmnForm.d2TmnID,
                PipID: this.editTmnForm.pipID,
                ConPont1:this.editTmnForm.conPont1,
                ConPont2:this.editTmnForm.conPont2,
                ConPont3:this.editTmnForm.conPont3,
                TmnDesc: this.editTmnForm.tmnDesc,
                TmnLeader: this.editTmnForm.tmnLeader,
                AreaID: this.editTmnForm.AreaID
            },{arrayFormat: 'repeat'})
            this.$axios.post('/modifyTmn',params)
                .then(res => {
                    if (res.data === 200) {
                        this.$message.success('更新成功')
                        this.editTmnDialogVisible = false
                        this.nextTmn=[]
                        this.getTmnList()
                    } else if (res.data === 201){
                        this.$message.error('该控制柜名称已存在')
                    } else {
                        this.$message.error('修改失败')
                    }
                }).catch(err => err)
        },
        // 取消或关闭编辑对话框
        editClose() {
            this.editTmnDialogVisible = false
            this.nextTmn=[]
            this.editTmnForm = []
            this.editTmnForm.tmnLeader=[]
            this.getTmnList()
        },
        // 解决input框不能输入的问题
        onInput() {this.$forceUpdate();},

        // 删除控制柜
        removeById(row) {
            this.$confirm('此操作将永久删除该控制柜, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
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
                )
                    .then(successResponse => {
                        if (successResponse.data === 1){
                            this.$message.success('删除成功')
                            this.showTableData = [];
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
