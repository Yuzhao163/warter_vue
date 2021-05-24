<template>
    <div class="container">
        <div class="toptable">
            <div class="select">
                <el-input placeholder="请输入用户名称" v-model="searchtext" @input="changeSearch">
                </el-input>
            </div>

            <div class="rightbutton">
                <button class="addbutton" @click="addbox=true, getAreas(),getPipes(),getTerminals()">添加</button>
            </div>
        </div>
        <el-table
                :data="tableDataShow"

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
                    :formatter="dateFormat"
            >
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            type="primary"
                            size="mini"
                            @click="getAreas(),getPipes(),getTerminals(),handleEdit(scope.$index, scope.row),editbox=true">
                        修改
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
                :total="this.title">
            >
        </el-pagination>

        <!--    修改员工信息-->
        <el-dialog @close="pswfalse(),mbpfalse()" class="dialog" style="text-align: left" title="修改用户信息" :visible.sync="editbox">
            <!--      <button @click="test"></button>-->
            <div class="input">
                <div class="left">
                    <div class="text"><span style="color: red">*</span>用户名：</div>
                    <el-input v-model="staffData.userName" placeholder=staffData.userName
                              v-on:blur="compname2"></el-input>
                    <div class="text"><span style="color: red">*</span>密码：</div>
                    <el-input v-model="staffData.userPswd" placeholder="请输入密码" v-on:focus="pswtipon"
                              v-on:blur="complength2"></el-input>
                    <!--          <span style="color:#2496ee;font-size: 10px">不填写则设置初始密码为123456</span>-->
                    <div style="color: red;font-size: 12px" v-show="ifpswtip">密码规则:密码长度应该在6-12位</div>
                    <div style="color: limegreen;font-size: 12px" v-show="ifpswtipok">密码通过</div>
                    <div class="text"><span style="color: red">*</span>真实姓名：</div>
                    <el-input v-model="staffData.realName" placeholder="请输入真实名称" @blur="edit_checkname"></el-input>
                    <div class="text"><span style="color: red">*</span>手机号：</div>
                    <el-input v-model="staffData.moPhone" v-on:focus="mbptipon" placeholder="请输入手机号" @blur="edit_checkphone"></el-input>
                    <div style="color: red;font-size: 12px"
                         v-show="ifmbptip">手机号规则:长度应该为11位</div>
                    <div style="color: limegreen;font-size: 12px" v-show="ifmbptipok">手机号通过</div>

                    <div class="text">单位名称：</div>
                    <el-input v-model="staffData.dptname" placeholder="请输入单位名称"></el-input>
                </div>

                <div class="right">
                    <div class="text"><span style="color: red">*</span>用户类别：</div>
                    <el-select v-model="staffData.uclassID" ref="select1" placeholder="--用户类别--"
                               style=" margin-right: 10px" @change="clearbox">
                        <el-option key="1" label="设备管理员" value="2"></el-option>
                        <el-option key="2" label="员工管理员" value="3"></el-option>
                    </el-select>
                    <div v-if="ifuclassid()">
                        <div class="text"><span style="color: red">*</span>权限分配：</div>
                        <!--            这是一个多选框-->
                        <!--权限选择框-->
                        <div class="maindiv">
                            <el-select v-model="form.rightnum" @change="clears()">
                                <el-option v-for="item in UserRightList"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </div>

                        <!--分区选择框-->
                        <div v-if="this.form.rightnum == '201'">
                            <div class="text">请选择需要控制的分区：</div>
                            <div class="areadiv">
                                <el-select v-model="Area.areaID" multiple placeholder="请选择需要控制的分区" @change="getAreas()">
                                    <el-option v-for="item in AreaList"
                                               :key="item.id"
                                               :label="item.areaName"
                                               :value="item.areaID">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>

                        <!--管线选择框-->
                        <div v-if="this.form.rightnum == '202'">
                            <div class="text">请选择需要控制的管线：</div>
                            <div class="pipediv">
                                <el-select v-model="Pipe.pipID" multiple placeholder="请选择需要控制的管线" @change="getPipes()">
                                    <el-option v-for="item in PipeList"
                                               :key="item.id"
                                               :label="item.pipName"
                                               :value="item.pipID">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>

                        <!--控制柜选择框-->
                        <div v-if="this.form.rightnum == '203'">
                            <div class="text">请选择需要控制的控制柜：</div>
                            <div class="tmndiv">
                                <el-select v-model="Terminal.tmnId" multiple placeholder="请选择需要控制的控制柜"
                                           @change="getTerminals()">
                                    <el-option v-for="item in TerminalList"
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
                <el-button @click="editbox = false,Index_TableData">取 消</el-button>
                <el-button type="primary" @click="updatestaff(),editbox = false">修 改</el-button>
            </div>
        </el-dialog>


        <!--    添加员工弹框内容-->
        <el-dialog @close="clearboxes(),pswfalse(),mbpfalse()" class="dialog" style="text-align: left" title="添加用户" :visible.sync="addbox">
            <!--      <button @click="test"></button>-->
            <div class="input">
                <div class="left">
                    <div class="text"><span style="color: red">*</span>用户名：</div>
                    <el-input v-model="addmessage.UserName" placeholder="请输入用户名" @blur="compname"></el-input>
                    <div class="text"><span style="color: red">*</span>密码：</div>
                    <el-input v-model="addmessage.UserPswd" placeholder="请输入密码" v-on:focus="pswtipon"
                              @blur="complength()"></el-input>
                    <!--          <span style="color:#2496ee;font-size: 10px">不填写则设置初始密码为123456 changduwei 8</span>-->
                    <div style="color: red;font-size: 12px"
                         v-show="ifpswtip">密码规则:密码长度应该在6-12位</div>
                    <div style="color: limegreen;font-size: 12px" v-show="ifpswtipok">密码通过</div>

                    <div class="text"><span style="color: red">*</span>真实姓名：</div>
                    <el-input v-model="addmessage.RealName" placeholder="请输入真实名称" @blur="checkname"></el-input>
                    <div class="text"><span style="color: red">*</span>手机号：</div>
                    <el-input v-model="addmessage.MoPhone" placeholder="请输入手机号" v-on:focus="mbptipon" @blur="checkphone"></el-input>
                    <div style="color: red;font-size: 12px"
                         v-show="ifmbptip">手机号规则:长度应该为11位</div>
                    <div style="color: limegreen;font-size: 12px" v-show="ifmbptipok">手机号通过</div>

                    <div class="text">
                        单位名称：
                    </div>
                    <el-input v-model="addmessage.DPTName" placeholder="请输入单位名称"></el-input>
                </div>
                <div class="right">
                    <div class="text"><span style="color: red">*</span>用户类别：</div>
                    <el-select v-model="addmessage.UClassID" ref="select1" placeholder="--用户类别--"
                               style=" margin-right: 10px" @change="test">
                        <el-option key="1" label="设备管理员" value="2"></el-option>
                        <el-option key="2" label="员工管理员" value="3"></el-option>
                    </el-select>
                    <div v-if="this.addmessage.UClassID == '2'">
                        <div class="text"><span style="color: red">*</span>权限分配：</div>
                        <!--这是一个多选框-->
                        <!--权限选择框-->
                        <div class="maindiv">
                            <el-select v-model="addUserRight.Right_PP" @change="clears()">
                                <el-option v-for="item in addUserRightList"
                                           :key="item.id"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </div>


                        <div v-if="this.addUserRight.Right_PP == '201'">
                            <!--分区选择框-->
                            <div class="text">请选择需要控制的分区：</div>
                            <div class="areadiv">
                                <el-select v-model="Area.areaID" multiple placeholder="请选择需要控制的分区" @change="getAreas()">
                                    <el-option v-for="item in AreaList"
                                               :key="item.id"
                                               :label="item.areaName"
                                               :value="item.areaID">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>

                        <div v-if="this.addUserRight.Right_PP == '202'">
                            <!--管线选择框-->
                            <div class="text">请选择需要控制的管线：</div>
                            <div class="pipediv">
                                <el-select v-model="Pipe.pipID" multiple placeholder="请选择需要控制的管线" @change="getPipes()">
                                    <el-option v-for="item in PipeList"
                                               :key="item.id"
                                               :label="item.pipName"
                                               :value="item.pipID">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>

                        <div v-if="this.addUserRight.Right_PP == '203'">
                            <!--控制柜选择框-->
                            <div class="text">请选择需要控制的控制柜：</div>
                            <div class="tmndiv">
                                <el-select v-model="Terminal.tmnId" multiple placeholder="请选择需要控制的控制柜"
                                           @change="getTerminals()">
                                    <el-option v-for="item in TerminalList"
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

                <el-button @click="addbox = false,clearboxes()">取 消</el-button>
                <el-button type="primary" @click="addstaff(),clearboxes()">确 定</el-button>
            </div>
        </el-dialog>


    </div>


</template>

<script>
    import qs from 'qs';
    import moment from "moment";

    export default {
        name: "Staff",
        mounted() {
            this.Index_TableData();
            // this.getAreaData();

        },
        data() {
            return {
                areaname_view: [],
                addbox: false,
                editbox: false,
                ifpswtip: false,
                ifpswtipok: false,
                ifmbptip: false,
                ifmbptipok: false,
                searchtext: '',//搜索条件
                tableData: [],
                tableDataShow: [],
                staffData: [],//修改数据时用于存放行数据
                staffData1: [],//修改权限分配时存放数据
                staffDatas: [],//接受修改时，username传回后端后返回的所有用户的值5.3
                flag1: false,
                flag2: false,
                flag3: false,
                flag4: false,
                screendata: {
                    condition: '',
                    selectcontent: ''
                },
                form: {
                    rightnum: 0,

                },//
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
                    Area_Pip_Tmn: '',
                },
                currentPage: 1, // 当前页码
                total: 20, // 总条数
                pageSize: 10, // 每页的数据条数

                //权限分配
                // options:[],
                // xuanze:[{

                // }],
                a: [],
                value: [],
                o_value: [],//单个tmn数据
                tree: [],
                treearea: [],
                area: '0',//存选择的分区index
                pipe: '0',//存选择的管线index
                areadata: [],
                pipedata: [],
                tmndata: [],
                sarea: '',//暂存区域选择框数据
                spipe: {
                    pipName: '',
                    pipID: ''
                },//暂存管线选择框数据
                preUserName: "",

                //權限分配
                clear: true,
                UserRight: {
                    Right_PP: '',
                    UserID: '',
                },
                Area: {
                    areaID: '',
                    areaName: '',
                    areaCreateDate: '',
                    areaLeader: '',
                    areaLeaderPhone: '',
                },
                Pipe: {
                    pipID: '',
                    pipName: '',
                    pipCreateDate: '',
                    pipLeader: '',
                    pipLeaderPhone: '',
                },
                Terminal: {
                    tmnId: '',
                    tmnName: '',
                    tmnLeader: '',
                },

                UserRightList: [

                    {
                        value: 201,
                        label: '分区管理员'
                    }, {
                        value: 202,
                        label: '管线管理员'
                    }, {
                        value: 203,
                        label: '控制柜管理员'
                    },
                ],
                addUserRight: {
                    Right_PP: '',
                    UserID: '',
                },
                addUserRightList: [{
                    value: 201,
                    label: '分区管理员'
                }, {
                    value: 202,
                    label: '管线管理员'
                }, {
                    value: 203,
                    label: '控制柜管理员'
                },
                ],
                AreaList: [],
                PipeList: [],
                TerminalList: [],

                areaid: [],
                pipid: [],
                tmnid: [],
                rightpp: "",
                tests:{
                    right: 0,
                },//
                title:''

            }
        },
        methods: {
            ifuclassid(){
                if(this.staffData.uclassID == '2'||this.staffData.uclassID == '201'||this.staffData.uclassID == '202'||this.staffData.uclassID == '203')
                    return true
            },
            pswtipon() {
                this.ifpswtip = true;
                this.ifpswtipok = false;
            },
            pswfalse() {
                this.ifpswtip = false;
                this.ifpswtipok = false;
            },
            mbptipon(){
                this.ifmbptip = true;
                this.ifmbptipok = false;
            },
            mbpfalse() {
                this.ifmbptip = false;
                this.ifmbptipok = false;
            },

            handleClick() {

            },
            handleChange() {
                console.log(this.value)
            },

            //-----------------------------------------------------------------------------------------------------------------
            //清理填框内容
            clearbox() {
                if(this.staffData.uclassID==2){
                    this.form.rightnum=201;
                }

                this.addmessage = {}
                this.addUserRight = {}
                this.Area = {}
                this.Pipe = {}
                this.Terminal = {}
            },
            clearboxes(){
                this.addmessage = {}
                this.addUserRight = {}
                this.Area = {}
                this.Pipe = {}
                this.Terminal = {}
            },
            //清理下拉框内容
            clears() {
                this.Area = {}
                this.Pipe = {}
                this.Terminal = {}

            },
            //-----------------------------------------------------------------------------------------------------------------
            getAreas() {
                this.$axios
                    .get('/getArea')
                    .then(res => {
                        this.AreaList = res.data
                        this.areaname_view = this.AreaList.areaName
                        console.log('111111' + this.AreaList)
                        console.log('aaaaaaaaaaaaaaaaaaaa', this.Area.areaID)
                    })
                    .catch(failResponse => {
                        console.log(failResponse)
                        alert(failResponse)
                    })

            },

            getPipes() {
                console.log(this.Area.areaID)
                this.$axios.get('/getPip').then(res => {
                    console.log('222222' + res.data)
                    this.PipeList = res.data
                    console.log('bbbbbbbbbbbbbbbbbbbb', this.Pipe.pipID)
                })
                    .catch(failResponse => {
                        console.log(failResponse)
                        alert(failResponse)
                    })
            },

            getTerminals() {
                this.$axios.get('/getTerminal').then(res => {
                    this.TerminalList = res.data

                })
                    .catch(failResponse => {
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
                        console.log("piplist add", this.piplist, res)
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
                this.$axios.get('/getTmns', {params: {pipID: this.addTmnForm.pipID}})
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

            //真实姓名判断
            checkname(){
                if(this.addmessage.RealName.length == 0){
                    this.$message({
                        type: 'info',
                        message: '请填写真实姓名'
                    });
                }
            },
            edit_checkname(){
                if(this.staffData.realName.length == 0){
                    this.$message({
                        type: 'info',
                        message: '请填写真实姓名'
                    });
                }
            },
            checkphone(){
                this.ifmbptip = false;
                if(this.addmessage.MoPhone.length == 0){
                    this.ifmbptipok = false;
                    this.$message({
                        type: 'info',
                        message: '请填写手机号'
                    });
                } else if(this.addmessage.MoPhone.length == 11){
                    this.ifmbptipok = true;
                }
            },
            edit_checkphone(){
                this.ifmbptip = false;
                if(this.staffData.moPhone.length == 0){
                    this.ifmbptipok = false;
                    this.$message({
                        type: 'info',
                        message: '请填写手机号'
                    });
                } else if(this.staffData.moPhone.length == 11){
                    this.ifmbptipok = true;
                }
            },

            //密码长度判断
            complength() {
                this.ifpswtip = false;
                if (this.addmessage.UserPswd.length < 6 || this.addmessage.UserPswd.length > 12) {
                    this.ifpswtipok = false;
                    this.$message({
                        type: 'info',
                        message: '密码长度应大于等于6位且小于12位'
                    });
                } else{
                    this.ifpswtipok = true;
                }
            },
            complength2() {
                this.ifpswtip = false;
                if (this.staffData.userPswd.length < 6 || this.staffData.userPswd.length > 12) {
                    this.ifpswtipok = false;
                    this.$message({
                        type: 'info',
                        message: '密码长度应大于等于6位且小于12位'
                    });
                } else {
                    this.ifpswtipok = true;
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
                console.log("这个人的名称是" + this.staffData.userName);
                console.log(this.tableData[i].userName);
                console.log("这个人之前的名字是", this.preUserName)
                //-----------------------------------------------------------------------------------
                var param = qs.stringify({UserName: this.staffData.userName})
                this.$axios.post('/getstaff', param).then(res => {
                    console.log("这是我获取到的后端除了该名称之外的人的信息" + res.data)
                    this.staffDatas = res.data
                    console.log(this.staffDatas)
                })

                if (this.staffData.userName != this.preUserName) {
                    for (i; i < this.tableData.length; i++) {
                        if (this.staffData.userName == this.tableData[i].userName) {
                            this.$message({
                                type: 'info',
                                message: '账号已经注册'
                            });
                        }
                    }
                }


            },
            //5.18
            // Index_TableData() {
            //     this.$axios
            //         .get('/staff')
            //         .then(res => {
            //             this.tableData = res.data;
            //             this.tableDataShow = res.data;
            //         })
            //         .catch(failResponse => {
            //             console.log(failResponse)
            //             alert(failResponse)
            //         })
            // },
            Index_TableData() {
                this.$axios
                    .get('/staff',{ params:{
                        UserName: this.searchtext,
                        page: this.currentPage,
                            size: this.pageSize,
                        }})
                    .then(res => {
                        console.log(res)
                        this.tableData = res.data;
                        this.tableDataShow = res.data
                        this.$axios.get('/getSize',{params:{
                            UserName: this.searchtext,
                            }

                        })
                        .then(res =>{
                            console.log(res)
                            this.title = res.data;
                    })
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
                        if(res.data == 200){
                            this.$message({
                                type: 'success',
                                message: '成功删除！'
                            });
                        }
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
                            message: '添加失败，账号已经注册'
                        });
                    } else {
                        this.flag1 = true;
                    }
                }
                // if(this.addmessage.UserPswd.length<=6 || this.addmessage.UserPswd.length>12){
                //     this.$message({
                //       type: 'info',
                //       message: '密码长度应大于6位且小于12位'
                //     });
                // }
                if (this.addmessage.UserPswd.length < 6 || this.addmessage.UserPswd.length > 12) {
                    this.flag2 = false;
                    this.$message({
                        type: 'info',
                        message: '添加失败，密码长度应大于等于6位且小于12位'
                    });
                } else {
                    this.flag2 = true;
                }
                console.log(this.flag1);
                console.log(this.flag2);
                //判断姓名
                if(this.addmessage.RealName.length == 0){
                    this.flag3 = false;
                    this.$message({
                        type: 'info',
                        message: '添加失败，请输入真实姓名'
                    });
                } else {
                    this.flag3 = true;
                }
                //判断电话号码
                if(this.addmessage.MoPhone.length == 0){
                    this.flag4 = false;
                    this.$message({
                        type: 'info',
                        message: '添加失败，请输入手机号'
                    });
                } else if(this.addmessage.MoPhone.length == 11){
                    this.flag4 = true;
                }

                if (this.flag1 == true && this.flag2 == true && this.flag3 == true && this.flag4 == true) {
                    if (this.addmessage.UClassID == '2') {
                        this.form.rightnum = this.addUserRight.Right_PP
                    } else {
                        this.form.rightnum = '3';
                    }
                    var params = qs.stringify({
                        UserName: this.addmessage.UserName,
                        UserPswd: this.addmessage.UserPswd,
                        UClassID: this.form.rightnum,
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
                    }, {arrayFormat: 'repeat'})
                    this.a = params
                    console.log(params)
                    if (this.addmessage.UClassID == '' ||
                        this.addmessage.UClassID == null ||
                        this.form.rightnum == null ||
                        this.addUserRight.Right_PP == '') {
                        this.$message({
                            type: 'warning',
                            message: '请选择对应权限及类别'
                        });
                    } else {
                        this.$axios.post('/addstaff', params).then(res => {
                            if (res.data === 200)
                                this.$message({
                                    type: 'success',
                                    message: '成功添加！'
                                });
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
                // var j = 0;
                // if (this.searchtext == '') {
                //     this.tableDataShow = this.tableData;
                //     console.log('10' + this.tableData)
                // } else {
                //     for (var i = 0; i < this.tableData.length; i++) {
                //
                //         if (this.tableData[i].userName.search(this.searchtext) >= 0) {
                //             this.tableDataShow[j] = this.tableData[i];
                //             j++;
                //             console.log(j)
                //         }
                //     }
                // }


            },
            changeSearch() {
                this.tableDataShow = [];
                this.searchstaff();
                this.Index_TableData()
            },
            dateFormat: function (row, column) {
                var date = row[column.property];
                if (date === undefined) {
                    return ''
                }
                ;
                return moment(date).format("YYYY-MM-DD HH:mm:ss")
            },

            handleEdit(index, row) {
                console.log("我所取的这一行数据",index, row);
                // this.UserRight.Right_PP = this.UserRightList[0].value;
                this.staffData = JSON.parse(JSON.stringify(row));
                this.form.rightnum = this.staffData.uclassID;
                this.form.rightnum = Number(this.form.rightnum);
                //新增的变量
                this.tests.right =
                this.staffData.uclassID = this.staffData.uclassID.substring(0, 1);
                console.log("我所取的这一行数据",index, row);
                for (var i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].userID == row.userID) {
                        console.log("这个当前行数匹配的userID是", this.tableData[i].userID)
                        this.rightpp = this.tableData[i].right_PP;
                        console.log("这个当前行数匹配的uclassid是", this.form.rightnum)
                        // if (this.tableData[i].right_PP == 1) {
                        //     this.areaid = this.tableData[i].areaID
                        // } else if (this.tableData[i].right_PP == 2) {
                        //     this.pipid = this.tableData[i].pipID
                        // } else if (this.tableData[i].right_PP == 3) {
                        //     this.tmnid = this.tableData[i].tmnID
                        // }
                        if (this.form.rightnum == 201) {
                            this.areaid = this.tableData[i].areaID
                        } else if (this.form.rightnum == 202) {
                            this.pipid = this.tableData[i].pipID
                        } else if (this.form.rightnum == 203) {
                            this.tmnid = this.tableData[i].tmnID
                        }

                    }
                }

                // this.UserRight.Right_PP = this.rightpp
                if (this.form.rightnum == 201) {
                    this.Area.areaID = this.areaid
                } else if (this.form.rightnum == 202) {
                    this.Pipe.pipID = this.pipid
                } else if (this.form.rightnum == 203) {
                    this.Terminal.tmnId = this.tmnid
                }
                console.log(this.staffData)
                this.preUserName = this.staffData.userName
            },

            updatestaff() {
                console.log("这里输出的是员工的UserRight的值", this.UserRight.Right_PP)
                this.$confirm('将更新员工信息, 是否确定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // ------------------------------------------------------------------------------------
                    var count = 0
                    this.flag1 = false
                    this.flag2 = false
                    if (this.staffData.userName != this.preUserName) {
                        for (var i = 0; i < this.tableData.length; i++) {
                            if (this.staffData.userName == this.tableData[i].userName) {
                                this.$message({
                                        type: 'info',
                                        message: '修改失败，账号已经注册'
                                    },
                                    console.log("我的flag变成了啥", this.flag1));
                                count++
                            } else if (this.staffData.userName == "") {
                                this.$message({
                                    type: 'info',
                                    message: '修改失败，账号不能为空'
                                });
                            }
                        }
                        if (count == 0) {
                            this.flag1 = true;
                        } else {
                            this.flag1 = false;
                        }
                        count = 0

                    } else if (this.staffData.userName == this.preUserName) {

                        console.log("flag1是真的")
                        this.flag1 = true;
                        // }
                    }

                    if (this.staffData.userPswd.length < 6 || this.staffData.userPswd.length > 12) {
                        this.flag2 = false;
                        this.$message({
                            type: 'info',
                            message: '修改失败，密码长度应大于等于6位且小于12位'
                        });
                    } else {
                        console.log("flag2是真的")
                        this.flag2 = true;
                    }
                    //判断姓名
                    if(this.staffData.realName.length == 0){
                        this.flag3 = false;
                        this.$message({
                            type: 'info',
                            message: '修改失败，请输入真实姓名'
                        });
                    } else {
                        this.flag3 = true;
                    }
                    //判断电话号码
                    console.log("这里是输出的修改框中的手机号的长度",this.staffData.moPhone.length)
                    if(this.staffData.moPhone.length == 0){
                        this.flag4 = false;
                        this.$message({
                            type: 'info',
                            message: '修改失败，请输入手机号'
                        });
                    } else if(this.staffData.moPhone.length == 11){
                        this.flag4 = true;
                    }


                    console.log('10084')
                    if (this.flag1 == true && this.flag2 == true && this.flag3 == true && this.flag4 == true) {
                        if (this.staffData.uclassID == '3') {
                            //this.staffData.uclassID = this.UserRight.Right_PP
                            this.form.rightnum = this.staffData.uclassID
                        }
                        console.log('10085')
                        var params = qs.stringify({

                            UserID: this.staffData.userID,
                            UserName: this.staffData.userName + "+" + this.preUserName,
                            UserPswd: this.staffData.userPswd,
                            // UClassID: this.staffData.uclassID,
                            UClassID: this.form.rightnum,
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
                        console.log(10086)
                        console.log(this.UserRight.Right_PP)
                        console.log(this.staffData.uclassID)

                        if (this.UserRight.Right_PP == null || this.staffData.uclassID == '') {
                            this.$message({
                                type: 'info',
                                message: '请选择对应权限'
                            });
                        }
                            this.$axios.post('/updstaff', params).then(res => {
                                console.log("修改完成", res)
                                this.$message({
                                    type: 'success',
                                    message: '成功修改！'
                                });
                                this.Index_TableData()
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消修改'
                                })
                            })

                    }
                })
            },

            //每页条数改变时触发 选择一页显示多少行
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.currentPage = 1;
                this.pageSize = val;
                //5.18
                this.Index_TableData();

            },
            //当前页改变时触发 跳转其他页
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                //5.18
                this.Index_TableData();
            },
            test() {
                console.log(this.form.rightnum);
                console.log(this.staffData.uclassID)
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
