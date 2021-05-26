<template>
    <div>

        <!--  卡片试图区域  -->
        <el-card class="box-card">

<!--    顶部添加按钮       -->
            <el-row >
                <el-row :gutter="20">
                    <el-col :span="6">
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="addPip">添加管线</el-button>
                    </el-col>
                </el-row>
            </el-row>

<!--    管线列表区域        -->
            <el-table :data="showPipTableData" stripe style="width: 100%; margin-top: 35px; margin-bottom: 25px">
                <el-table-column prop="PipName" label="管线名称"></el-table-column>
                <el-table-column prop="AreaName" label="所属分区"></el-table-column>
                <el-table-column prop="PipLeader" label="管理人员-电话"></el-table-column>
                <el-table-column prop="PipCreateTime" label="管线创建时间"></el-table-column>
<!--                <el-table-column prop="PipDesc" label="管线详情"></el-table-column>-->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyPip(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletePip(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

<!--    分页区域    -->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[1, 5, 10, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total>
            </el-pagination>

<!--    添加管线对话框     -->
            <el-dialog title="添加管线" :visible.sync="addDialogVisible" width="35%" @close="addCancel('addPipFormRef')">
                <el-form :model="addPipForm" :rules="addPipFormRules" ref="addPipFormRef" label-width="130px">
                    <el-form-item label="管线名称" prop="pipName">
                        <el-input v-model="addPipForm.pipName"></el-input>
                    </el-form-item>
                    <el-form-item label="所属分区">
                        <el-select v-model="addPipForm.areaID" @change="getArea">
                            <el-option v-for="item in arealist"
                                       :key="item.id"
                                       :label="item.areaName"
                                       :value="item.areaID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="管线管理员">
                        <el-select v-model="addPipForm.pipLeader" multiple @change="getPipLeader">
                            <el-option v-for="item in leaderlist"
                                       :key="item.userID"
                                       :label="item.userName"
                                       :value="item.userID"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCancel('addPipFormRef')">取 消</el-button>
                    <el-button type="primary" @click="addSubmit('addPipFormRef')">确 定</el-button>
                </span>
            </el-dialog>


<!--     修改管线对话框       -->
            <el-dialog title="修改管线" :visible.sync="editDialogVisible" width="35%" @close="modifyCancel('editPipFormRef')">
                <el-form :model="editPipForm" :rules="editPipFormRules" ref="editPipFormRef" label-width="130px">
                    <el-form-item label="管线id" prop="pipID">
                        <el-input v-model="editPipForm.PipID" class="el-input" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="管线名称" prop="PipName">
                        <el-input v-model="editPipForm.PipName" class="el-input"></el-input>
                    </el-form-item>
                    <el-form-item label="所属分区">
                        <el-select v-model="editPipForm.AreaID" @change="getArea" clearable>
                            <el-option v-for="item in arealist"
                                       :key="item.id"
                                       :label="item.areaName"
                                       :value="item.areaID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="管线管理员">
                        <el-select v-model="editPipForm.PipLeader" multiple @change="getPipLeader">
                            <el-option v-for="item in leaderlist"
                                       :key="item.userID"
                                       :label="item.userName"
                                       :value="item.userID"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="modifyCancel('editPipFormRef')">取 消</el-button>
                    <el-button type="primary" @click="modifySubmit('editPipFormRef')">确 定</el-button>
                </span>
            </el-dialog>

        </el-card>

    </div>
</template>

<script>
    // import qs from "qs";

    import qs from "qs";

    export default {
        name: "PipDevice.vue",

        data() {
            return {
                // 存放管线信息
                pipTableData: [],
                // 展示管线信息
                showPipTableData: [],

                // 分页功能部分
                currentPage: 1, // 前往第几页 默认为1
                pageSize: 5,    // 当前页有多少条数据 默认5
                total: 10,      //一共有多少条数据 默认20

                // 添加管线
                addDialogVisible: false,
                addPipForm: {
                    pipName:'',
                    areaID:'',
                    pipLeader:[]
                },
                addPipFormRules: {
                    pipName: [
                        { required: true, message: "请输入管线名称", trigger: "blur"},
                        { min: 2, max:30, message: "长度在 2 到 30 个字符", trigger: "blur"}
                    ]
                },

                // 修改管线
                editDialogVisible: false,
                editPipForm: {
                    PipID:'',
                    PipName:'',
                    AreaID:'',
                    PipLeader: []
                },
                editPipFormRules: {
                    PipName: [
                        { required: true, message: "请输入管线名称", trigger: "blur"},
                        { min: 2, max:30, message: "长度在 2 到 30 个字符", trigger: "blur"}
                    ]
                },
                PipLeaderID: [],

                pipMessage: [],


                // 分区列表
                arealist: [],
                // 管理人员列表
                leaderlist: [],
            }
        },

        created() {
            this.getPipList()

        },
        methods: {
            // 获取管线信息(分页)
            getPipList() {
                this.$axios.get('/getPipList', { params: {
                        page: this.currentPage,
                        size: this.pageSize
                    }})
                    .then(res => {
                        console.log(res)
                        this.pipTableData = res.data
                        this.$axios.get('/getPipSize')
                            .then(res => {
                                console.log(res)
                                this.total = res.data
                                this.showPipTableData = JSON.parse(JSON.stringify(this.pipTableData));
                                console.log(this.showPipTableData,this.pipTableData)
                                this.showLeader()
                                this.timeShow()
                            })
                    })
            },
            // 处理管理人员格式
            showLeader() {
                for (var i = 0; i < this.showPipTableData.length; i++) {
                    var leader = '';
                    // debugger
                    for(var j =0; j<this.showPipTableData[i].PipLeader.length; j++) {
                        // debugger
                        var leaderName = this.showPipTableData[i].PipLeader[j].userName
                        var leaderPhone = this.showPipTableData[i].PipLeader[j].MoPhone
                        leader = leaderName+'-'+leaderPhone+";"+leader
                    }
                    this.showPipTableData[i].PipLeader = leader;
                }
            },
            //  解决前端时间显示的问题
            timeFormat(timestamp){
                var time = new Date(timestamp);
                var year = time.getFullYear();
                var month = time.getMonth()+1;
                var date = time.getDate();
                var hours = time.getHours();
                var minutes = time.getMinutes();
                var seconds = time.getSeconds();
                return year + '-' + this.addZero(month) + '-' + this.addZero(date) + ' ' + this.addZero(hours) + ':' + this.addZero(minutes) + ':' + this.addZero(seconds)
            },
            addZero(num) { return num < 10 ? '0' + num : num },
            timeShow(){
                for(var i = 0; i < this.showPipTableData.length; i++) {
                    this.showPipTableData[i].PipCreateTime =this.timeFormat(this.showPipTableData[i].PipCreateTime.time)
                }
            },

            //  分页功能
            //  每页显示的条数 （点击后将当前页数重置为1）
            handleSizeChange(size) {
                this.pageSize = size
                this.currentPage = 1
                this.getPipList()
            },
            //  当前点击的是第几页 （点击后相当于根据页数获取数据）
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage
                this.getPipList()
            },

            // 得到所有分区列表
            getArea() {
                this.$axios.get('/getAllAreas')
                    .then(res => {
                        console.log(res)
                        this.arealist = res.data
                    })
            },

            // 得到具有管理管线的管理人员的列表
            getPipLeader() {
              this.$axios.get('/getPipLeader')
                .then(res => {
                    console.log(res)
                    this.leaderlist = res.data
                })
            },

            // 添加管线
            addPip() {
                this.addDialogVisible = true
                this.getArea()
                this.getPipLeader()
                console.log("添加",this.addPipForm)

            },
            addSubmit(addPipFormRef) {
                console.log(this.addPipForm)
                if (this.addPipForm.pipName == ''){
                    this.$message.error('请输入管线名称')
                }else if (this.addPipForm.pipName.length <2) {
                    this.$message.error('管线名称为2-30个字符')
                }else if (this.addPipForm.pipName.length >30) {
                    this.$message.error('管线名称为2-30个字符')
                }else {
                    this.$refs['addPipFormRef'].validateField('addPipFormRule')
                    if (this.addPipForm.pipLeader.length==0) {
                        this.addPipForm.pipLeader = -1
                    }
                    var params = qs.stringify({
                        PipName:this.addPipForm.pipName,
                        AreaID:this.addPipForm.areaID,
                        PipLeader:this.addPipForm.pipLeader
                    },{ arrayFormat: 'repeat' })
                    this.$axios.post('/addPip',params)
                        .then(res => {
                            console.log(res)
                            if (res.data == 200) {
                                this.$message.success("添加成功")
                                this.getPipList()
                                this.addPipForm = []
                                this.addDialogVisible = false
                                this.$refs[addPipFormRef].resetFields();
                            } else if (res.data == 201) {
                                this.$message.error("该用管线名已存在")
                            } else {
                                this.$message.error("添加失败")
                            }
                        })
                }

            },
            addCancel(addPipFormRef) {
                this.addDialogVisible = false
                this.addPipForm = {  pipName:'',
                  areaID:'',
                  pipLeader:[]}
                this.$refs[addPipFormRef].resetFields();
            },

            // 修改管线
            modifyPip(row) {
                this.editDialogVisible = true
                this.getArea()
                this.getPipLeader()
                // this.editPipForm.PipLeader=[]
                this.PipLeaderID=[]

                this.editPipForm = row

                // 需要arealeaderid
                for (var i = 0; i < this.pipTableData.length ; i++) {
                    if (this.pipTableData[i].PipID == row.PipID) {
                        this.pipMessage = this.pipTableData[i].PipLeader
                    }
                }
                for (var j = 0; j < this.pipMessage.length ; j++) {
                    this.PipLeaderID[j] = this.pipMessage[j].userID
                }
                console.log(this.editPipForm.PipLeader,"**********")
                if (this.pipMessage == 0) {
                    this.editPipForm.PipLeader = []
                } else {
                    this.editPipForm.PipLeader = this.PipLeaderID
                }

                console.log(this.editPipForm,row,"++++++")

            },
            modifySubmit(editPipFormRef) {
                console.log(this.editPipForm)
                if (this.editPipForm.PipName=='') {
                    this.$message.error("请输入管线名称")
                } else if (this.editPipForm.PipName.length<2) {
                    this.$message.error("管线名称为2-30个字符")
                } else if (this.editPipForm.PipName.length>30) {
                    this.$message.error("管线名称为2-30个字符")
                } else {
                    this.$confirm('此操作将修改该管线, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (this.editPipForm.PipLeader.length==0) {
                            this.editPipForm.PipLeader = -1
                        }
                        var params = qs.stringify({
                            PipID:this.editPipForm.PipID,
                            PipName:this.editPipForm.PipName,
                            AreaID:this.editPipForm.AreaID,
                            PipLeader:this.editPipForm.PipLeader
                        },{ arrayFormat: 'repeat' })
                        this.$axios.post('/updatePip',params)
                            .then(res => {
                                console.log(res)
                                if (res.data == 200) {
                                    this.$message.success('修改成功！')
                                    this.getPipList()
                                    this.editPipForm = []
                                    this.editDialogVisible = false
                                    this.editPipForm.PipLeader = []
                                    this.$refs[editPipFormRef].resetFields();
                                } else if (res.data == 201) {
                                    this.$message.error('该管线名称已存在')
                                } else {
                                    this.$message.error('修改失败')
                                }
                            })
                    })

                }

            },
            modifyCancel(editPipFormRef) {
                this.editDialogVisible = false
                this.editPipForm = {}
                this.$refs[editPipFormRef].resetFields();
                this.getPipList()

            },

            // 删除管线
            deletePip(row) {
                console.log(row)
                this.$confirm('此操作将永久删除该管线, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var params = qs.stringify({
                        PipID:row.PipID
                    })
                    this.$axios.post('/deletePip',params)
                        .then(res => {
                            console.log(res)
                            if(res.data == 200) {
                                this.$message.success("删除成功")
                                this.getPipList()
                            } else {
                                this.$message.error("删除失败")
                            }
                        })
                })

            },





        }
    }
</script>

<style scoped>

</style>
