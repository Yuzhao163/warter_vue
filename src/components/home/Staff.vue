<template>
  <div class="container">
    <div class="toptable">
      <div class="select">
        <el-input placeholder="请输入用户名称" v-model="searchtext" @input="changeSearch">
        </el-input>
      </div>

      <div class="rightbutton">
        <button class="addbutton" @click="addbox=true, getAreas(),getPipes(),getTerminals()">添加</button>
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
              @click="getAreas(),getPipes(),getTerminals(),handleEdit(scope.$index, scope.row),editbox=true">修改
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
        :total="tableDataShow.length">
      >
    </el-pagination>

    <!--    修改员工信息-->
    <el-dialog  class="dialog" style="text-align: left" title="修改用户信息" :visible.sync="editbox">
<!--      <button @click="test"></button>-->
      <div class="input">
        <div class="left">
          <div class="text"><span style="color: red">*</span>用户名：</div>
          <el-input v-model="staffData.userName" placeholder=staffData.userName v-on:blur="compname2"></el-input>
          <div class="text"><span style="color: red">*</span>密码：</div>
          <el-input v-model="staffData.userPswd" placeholder="请输入密码" v-on:blur="complength2"></el-input>
<!--          <span style="color:#2496ee;font-size: 10px">不填写则设置初始密码为123456</span>-->
          <div class="text"><span style="color: red">*</span>真实姓名：</div>
          <el-input v-model="staffData.realName" placeholder="请输入真实名称"></el-input>
          <div class="text"><span style="color: red">*</span>手机号：</div>
          <el-input v-model="staffData.moPhone" placeholder="请输入手机号"></el-input>
          <div class="text"><span style="color: red">*</span>单位名称：</div>
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
<!--            这是一个多选框-->
            <!--权限选择框-->
            <div class="maindiv" >
              <el-select v-model="UserRight.Right_PP" @change="clears()">
                <el-option  v-for="item in UserRightList"
                           :key="item.id"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </div>

            <!--分区选择框-->
            <div v-if="this.UserRight.Right_PP == 1">
            <div class="text">请选择需要控制的分区：</div>
            <div class="areadiv">
              <el-select v-model="Area.areaID"  multiple placeholder="请选择需要控制的分区" @change="getAreas()">
                <el-option v-for="item in AreaList"
                           :key="item.id"
                           :label="item.areaName"
                           :value="item.areaID">
                </el-option>
              </el-select>
            </div>
            </div>

            <!--管线选择框-->
            <div v-if="this.UserRight.Right_PP == 2">
            <div class="text">请选择需要控制的管线：</div>
            <div class="pipediv">
              <el-select v-model="Pipe.pipID"  multiple placeholder="请选择需要控制的管线" @change="getPipes()">
                <el-option v-for="item in PipeList"
                           :key="item.id"
                           :label="item.pipName"
                           :value="item.pipID">
                </el-option>
              </el-select>
            </div>
            </div>

            <!--控制柜选择框-->
            <div v-if="this.UserRight.Right_PP == 3">
            <div class="text">请选择需要控制的控制柜：</div>
            <div class="tmndiv">
              <el-select v-model="Terminal.tmnId" multiple placeholder="请选择需要控制的控制柜" @change="getTerminals()">
                <el-option  v-for="item in TerminalList"
                            :key="item.id"
                            :label="item.tmnName"
                            :value="item.tmnId">
                </el-option>
              </el-select>
            </div>
            </div>

        </div>
      </div>
      </div>
      <div slot="footer" class="dialog-footer">

        <el-button @click="editbox = false, this.Index_TableData()">取 消</el-button>
        <el-button type="primary" @click="updatestaff(),editbox = false">修 改</el-button>
      </div>
    </el-dialog>


    <!--    添加员工弹框内容-->
    <el-dialog @close="clearbox()" class="dialog" style="text-align: left" title="添加用户" :visible.sync="addbox">
<!--      <button @click="test"></button>-->
      <div class="input">
        <div class="left">
          <div class="text"><span style="color: red">*</span>用户名：</div>
          <el-input v-model="addmessage.UserName" placeholder="请输入用户名" @blur="compname"></el-input>
          <div class="text"><span style="color: red">*</span>密码：</div>
          <el-input v-model="addmessage.UserPswd" placeholder="请输入密码" @blur="complength()"></el-input>
<!--          <span style="color:#2496ee;font-size: 10px">不填写则设置初始密码为123456 changduwei 8</span>-->
          <div class="text"><span style="color: red">*</span>真实姓名：</div>
          <el-input v-model="addmessage.RealName" placeholder="请输入真实名称"></el-input>
          <div class="text"><span style="color: red">*</span>手机号：</div>
          <el-input v-model="addmessage.MoPhone" placeholder="请输入手机号"></el-input>
          <div class="text"><spn style="color: red">*</spn>单位名称：</div>
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
            <!--这是一个多选框-->
            <!--权限选择框-->
            <div class="maindiv" >
              <el-select v-model="addUserRight.Right_PP" @change="clears()">
                <el-option v-for="item in addUserRightList"
                           :key="item.id"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </div>


            <div v-if="this.addUserRight.Right_PP == '1'">
              <!--分区选择框-->
              <div class="text">请选择需要控制的分区：</div>
              <div class="areadiv">
                <el-select v-model="Area.areaID"  multiple placeholder="请选择需要控制的分区" @change="getAreas()">
                  <el-option v-for="item in AreaList"
                             :key="item.id"
                             :label="item.areaName"
                             :value="item.areaID">
                  </el-option>
                </el-select>
              </div>
            </div>

            <div v-if="this.addUserRight.Right_PP == '2'">
              <!--管线选择框-->
              <div class="text">请选择需要控制的管线：</div>
              <div class="pipediv">
                <el-select v-model="Pipe.pipID"  multiple placeholder="请选择需要控制的管线" @change="getPipes()">
                  <el-option v-for="item in PipeList"
                             :key="item.id"
                             :label="item.pipName"
                             :value="item.pipID">
                  </el-option>
                </el-select>
              </div>
            </div>

            <div v-if="this.addUserRight.Right_PP == '3'">
              <!--控制柜选择框-->
              <div class="text">请选择需要控制的控制柜：</div>
              <div class="tmndiv">
                <el-select v-model="Terminal.tmnId" multiple placeholder="请选择需要控制的控制柜" @change="getTerminals()">
                  <el-option  v-for="item in TerminalList"
                             :key="item.id"
                             :label="item.tmnName"
                             :value="item.tmnId">
                  </el-option>
                </el-select>
              </div>
            </div>
            <!------------------------------------------------------------------------------->


          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">

        <el-button @click="addbox = false,clearbox()">取 消</el-button>
        <el-button type="primary" @click="addstaff(),clearbox()">确 定</el-button>
      </div>
    </el-dialog>








  </div>





</template>

<script>
import qs from 'qs';

export default {
  name: "Staff",
  mounted() {
    this.Index_TableData();
      this.getAreaData()

  },
  data() {
    return {
      areaname_view:[],
      addbox: false,
      editbox: false,
      searchtext: '',//搜索条件
      tableData: [],
      tableDataShow: [],
      staffData: [],//修改数据时用于存放行数据
      staffData1:[],//修改权限分配时存放数据
      staffDatas:[],//接受修改时，username传回后端后返回的所有用户的值5.3
      flag1: false,
      flag2: false,
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
        // AreaName:'',
        // PipName:'',
        // TmnName:'',
        Area_Pip_Tmn:'',
      },
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5, // 每页的数据条数

      //权限分配
      // options:[],
      // xuanze:[{

      // }],
      a:[],
      value:[],
      o_value:[],//单个tmn数据
      tree:[],
      treearea:[],
      area: '0',//存选择的分区index
      pipe: '0',//存选择的管线index
      areadata: [],
      pipedata: [],
      tmndata: [],
      sarea: '',//暂存区域选择框数据
      spipe: {
        pipName:'',
        pipID:''
      },//暂存管线选择框数据
      preUserName:"",

      //權限分配
      clear:true,
      UserRight:{
        Right_PP:'',
        UserID:'',
      },
      Area:{
        areaID:'',
        areaName:'',
        areaCreateDate:'',
        areaLeader:'',
        areaLeaderPhone:'',
      },
      Pipe:{
        pipID:'',
        pipName:'',
        pipCreateDate:'',
        pipLeader:'',
        pipLeaderPhone:'',
      },
      Terminal:{
        tmnId:'',
        tmnName:'',
        tmnLeader:'',
      },

      UserRightList: [{
        value: -1,
        label: '保留权限'
      },{
       value: '0',
       label: '清空权限(警告：选中后权限清空)'
      },{
      value: '1',
      label: '分区管理员'
    }, {
      value: '2',
      label: '管线管理员'
    }, {
      value: '3',
      label: '控制柜管理员'
    },
    ],
      addUserRight:{
        Right_PP:'',
        UserID:'',
      },
      addUserRightList: [{
        value: '1',
        label: '分区管理员'
      }, {
        value: '2',
        label: '管线管理员'
      }, {
        value: '3',
        label: '控制柜管理员'
      },
      ],
      AreaList:[],
      PipeList:[],
      TerminalList:[],

    }
  },
  methods: {
    handleClick() {

    },
    handleChange() {
      console.log(this.value)
    },

    //-----------------------------------------------------------------------------------------------------------------
    //清理填框内容
    clearbox(){
      this.addmessage = {}
      this.addUserRight = {}
      this.Area = {}
      this.Pipe = {}
      this.Terminal = {}
    },

    //清理下拉框内容
    clears(){
      this.Area = {}
      this.Pipe = {}
      this.Terminal = {}
    },
    //-----------------------------------------------------------------------------------------------------------------
    getAreas(){
      this.$axios
              .get('/getArea')
              .then(res =>{
                this.AreaList = res.data
                this.areaname_view=this.AreaList.areaName
                console.log('111111'+this.AreaList)
                console.log('aaaaaaaaaaaaaaaaaaaa',this.Area.areaID)
              })
              .catch(failResponse => {
                console.log(failResponse)
                alert(failResponse)
              })

    },

    getPipes(){
      console.log(this.Area.areaID)
      this.$axios.get('/getPip').then(res => {
        console.log('222222'+res.data)
        this.PipeList = res.data
        console.log('bbbbbbbbbbbbbbbbbbbb',this.Pipe.pipID)
      })
      .catch(failResponse =>{
        console.log(failResponse)
        alert(failResponse)
      })
    },

    getTerminals(){
      this.$axios.get('/getTerminal').then(res =>{
        console.log('33333333'+res.data)
        this.TerminalList = res.data
        console.log('ccccccccccccccccccccccc',this.Terminal.tmnId)
      })
      .catch(failResponse =>{
        console.log(failResponse)
        alert(failResponse)
      })
    },


    getPipe() {
      // 将分区id 传入 请求后端 获得管线名称和id
      console.log(this.Area.areaID)
      // if (this.addDialogVisible === true) {
      //   this.$axios.get('/getPipes',{params:{areaID:this.addTmnForm.areaID}})
      this.$axios.get('/getPipes',)
                .then(res => {
                  this.piplist = res.data
                  console.log("piplist add",this.piplist,res)
                })
      // // } else if (this.editTmnDialogVisible === true) {
      //   this.$axios.get('/getPips',{params:{areaID:this.editTmnForm.AreaID}})
      //           .then(res2 => {
      //             this.piplist = res2.data
      //             console.log("piplist edit",this.piplist,res2)
      //           })
      // }
      // this.getTmns()
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
    //---------------------------------------------------------------------------------------------------

    try() {

      this.$axios
              .get('/getFistPip')
              .then(res => {
                console.log(res.data)
                this.options = res.data
              })
              .catch(failResponse => {
                console.log(failResponse)
                alert(failResponse)
              })
    },


    complength(){
      if(this.addmessage.UserPswd.length<6 || this.addmessage.UserPswd.length>12 )
      {
        this.$message({
          type: 'info',
          message: '密码长度应大于等于6位且小于12位'
        });
      }
    },
    complength2(){
      if(this.staffData.userPswd.length<6 || this.staffData.userPswd.length>12 ) {
        console.log(this.staffData);
        this.$message({
          type: 'info',
          message: '密码长度应大于等于6位且小于12位'
        });
      }
    },
    compname() {
      var i = 0
      console.log(this.addmessage.UserName);
      console.log(this.tableData[i].userName);
      for (i; i < this.tableData.length; i++) {
        if (this.addmessage.UserName == this.tableData[i].userName) {
          this.$message({
            type: 'info',
            message: '账号已经注册'
          });
        }
      }
    },
    compname2() {
      var i = 0
      console.log("这个人的名称是"+this.staffData.userName);
      console.log(this.tableData[i].userName);
      console.log("这个人之前的名字是",this.preUserName)
      //-----------------------------------------------------------------------------------
        var param = qs.stringify({UserName: this.staffData.userName})
        this.$axios.post('/getstaff', param).then(res => {
          console.log("这是我获取到的后端除了该名称之外的人的信息"+res.data)
          this.staffDatas = res.data
          console.log(this.staffDatas)
        })

      if(this.staffData.userName != this.preUserName){
        for(i; i < this.tableData.length; i++){
          if(this.staffData.userName == this.tableData[i].userName){
            this.$message({
              type: 'info',
              message: '账号已经注册'
            });
          }
        }
      }

            //-------------------------------------------------------------------------------
    //   for (i; i < this.tableData.length; i++) {
    //     if (this.staffData.userName == this.tableData[i].userName) {
    //       this.$message({
    //         type: 'info',
    //         message: '账号已经注册'
    //       });
    //     }
    //   }
    },

    Index_TableData() {
      console.log("调用了");
      this.$axios
          .get('/staff')
          .then(res => {
            console.log("请求成功")
            console.log(res)
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
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.addmessage.UserName == this.tableData[i].userName) {
          console.log(this.addmessage.UserName);
          console.log(this.tableData[i].userName);
          this.$message({
            type: 'info',
            message: '账号已经注册'
          });
        }else{
          this.flag1 = true;
        }
      }
      // if(this.addmessage.UserPswd.length<=6 || this.addmessage.UserPswd.length>12){
      //     this.$message({
      //       type: 'info',
      //       message: '密码长度应大于6位且小于12位'
      //     });
      // }
      if(this.addmessage.UserPswd.length<6 || this.addmessage.UserPswd.length>12){
        this.flag2 = false;
        this.$message({
          type: 'info',
          message: '密码长度应大于等于6位且小于12位'
        });
      } else{
        this.flag2 = true;
      }
      console.log(this.flag1);
      console.log(this.flag2);
      // var vlength;
      // for(var m=0;m<this.value.length;m++)
      // {
      //
      //   vlength=this.value[m].length;
      //   this.o_value.push(this.value[m][vlength-1])
      //
      // }
      if(this.flag1==true && this.flag2==true){
        var params = qs.stringify({
        UserName: this.addmessage.UserName,
        UserPswd: this.addmessage.UserPswd,
        UClassID: this.addmessage.UClassID,
        MoPhone: this.addmessage.MoPhone,
        RealName: this.addmessage.RealName,
        DPTName: this.addmessage.DPTName,
        AreaID: this.Area.areaID,
        AreaName: this.Area.areaName,
        PipID: this.Pipe.pipID,
        PipName: this.Pipe.pipID,
        TmnId: this.Terminal.tmnId,
        TmnName: this.Terminal.tmnName,
        Right_PP: this.addUserRight.Right_PP,
        // Area_Pip_Tmn:this.o_value,
      },{ arrayFormat: 'repeat' })
        this.a=params
        console.log(params)
        if(this.addUserRight.Right_PP == "" || this.addmessage.UClassID == '' || this.addmessage.UClassID == null){
          this.$message({
            type: 'warning',
            message: '请选择对应权限及类别'
          });
        } else{
          this.$axios.post('/addstaff', params).then(res => {
            if (res.data.code === 200)
              console.log(res);
            this.Index_TableData();
            this.addbox = false;

          })
                  .catch(failResponse => {
                    console.log(params)
                    console.log(failResponse)
                    alert(failResponse)
                  })
        }

      }

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
      // this.UserRight.Right_PP = this.UserRightList[0].value;
      this.staffData = JSON.parse(JSON.stringify(row));
      console.log(this.staffData)
      this.preUserName = this.staffData.userName
    },
    updatestaff() {
      this.$confirm('将更新用户信息, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // ------------------------------------------------------------------------------------
        var count = 0
        this.flag1 = false
        this.flag2 = false
        if(this.staffData.userName != this.preUserName){
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.staffData.userName == this.tableData[i].userName) {
              this.$message({
                type: 'info',
                message: '账号已经注册'
              },
              console.log("我的flag变成了啥",this.flag1));
              count++
            } else if(this.staffData.userName == ""){
              this.$message({
                type: 'info',
                message: '账号不能为空'
              });
            }
          }
          if(count == 0){
            this.flag1 = true;
          }else{
            this.flag1 = false;
          }
          count = 0

        }else if(this.staffData.userName == this.preUserName){

              console.log("flag1是真的")
              this.flag1 = true;
          // }
          }
        // }
        // ------------------------------------------------------------------------------------

        // for (var i = 0; i < this.tableData.length; i++) {
        //   if (this.staffData.userName == this.tableData[i].userName) {
        //     this.$message({
        //       type: 'info',
        //       message: '账号已经注册'
        //     });
        //   } else {
        //     console.log("flag1是真的")
        //     this.flag1 = true;
        //   }
        // }
        // if(this.addmessage.UserPswd.length<=6 || this.addmessage.UserPswd.length>12){
        //     this.$message({
        //       type: 'info',
        //       message: '密码长度应大于6位且小于12位'
        //     });
        // }
        if (this.staffData.userPswd.length < 6 || this.staffData.userPswd.length > 12) {
          this.flag2 = false;
          this.$message({
            type: 'info',
            message: '密码长度应大于等于6位且小于12位'
          });
        } else {
          console.log("flag2是真的")
          this.flag2 = true;
        }

        if (this.flag1 == true && this.flag2 == true) {
          var params = qs.stringify({

            UserID: this.staffData.userID,
            UserName: this.staffData.userName + "+" + this.preUserName,
            UserPswd: this.staffData.userPswd,
            UClassID: this.staffData.uclassID,
            MoPhone: this.staffData.moPhone,
            RealName: this.staffData.realName,
            DPTName: this.staffData.dptname,
            AreaID: this.Area.areaID,
            AreaName: this.Area.areaName,
            PipID: this.Pipe.pipID,
            PipName: this.Pipe.pipID,
            TmnId: this.Terminal.tmnId,
            TmnName: this.Terminal.tmnName,
            Right_PP: this.UserRight.Right_PP,
            // Area_Pip_Tmn: this.staffData1,

          }, {arrayFormat: 'repeat'})
          if (this.UserRight.Right_PP == ""||this.staffData.uclassID == '' || this.staffData.uclassID == null) {
            this.$message({
              type: 'info',
              message: '请选择对应权限'
            });
          } else {
            this.$axios.post('/updstaff', params).then(res => {
              console.log("修改完成",res)
              this.Index_TableData()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消修改'
              })
            })
          }
        }
      })
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
      console.log(this.addUserRight.Right_PP)
      console.log(this.addmessage)
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
