<template>
<div>

<!--  卡片试图区域  -->
    <el-card class="box-card">

<!--    顶部添加按钮区域    -->
        <el-row >
            <el-row :gutter="20">
                <el-col :span="6">
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addArea">添加分区</el-button>
                </el-col>
            </el-row>
        </el-row>

<!--    分区列表区域    -->
        <el-table :data="showTableData" stripe style="width: 100%; margin-top: 35px; margin-bottom: 25px">
<!--            <el-table-column prop="AreaID" label="分区ID"></el-table-column>-->
            <el-table-column prop="AreaName" label="分区名称"></el-table-column>
            <el-table-column prop="AreaLeader" label="分区管理员"></el-table-column>
<!--            <el-table-column prop="AreaLeadPhone" label="管理员电话"></el-table-column>-->
            <el-table-column prop="AreaCreateDate" label="分区建立时间"></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyArea(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteArea(scope.row)"></el-button>
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

<!--    添加分区对话框    -->
        <el-dialog title="添加分区" :visible.sync="addDialogVisible" width="35%" @close="addCancel('addAreaFormRef')">
            <el-form :model="addAreaForm" :rules="addAreaFormRules" ref="addAreaFormRef" label-width="130px">
                <el-form-item label="分区名称" prop="areaName">
                    <el-input v-model="addAreaForm.areaName" @input="onInput()"></el-input>
                </el-form-item>
                <el-form-item label="分区管理人员">
                    <el-select v-model="addAreaForm.areaLeader" multiple @change="addLeader" >
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
                <el-button @click="addCancel('addAreaFormRef')">取 消</el-button>
                <el-button type="primary" @click="addSubmit('addAreaFormRef')">确 定</el-button>
            </span>
        </el-dialog>

<!--    修改分区对话框    -->
        <el-dialog title="修改分区" :visible.sync="modifyDialogVisible" width="35%" @close="modifyCancel('modifyAreaFormRef')">
            <el-form :model="modifyAreaForm" :rules="modifyAreaFormRules" ref="modifyAreaFormRef" label-width="130px">
                <el-form-item label="分区id" >
                    <el-input v-model="modifyAreaForm.AreaID" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="分区名称" prop="AreaName">
                    <el-input v-model="modifyAreaForm.AreaName" @input="onInput()"></el-input>
                </el-form-item>
                <el-form-item label="分区管理员" >
                    <el-select v-model="modifyAreaForm.AreaLeader" multiple @change="getAreaLeader">
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
                <el-button @click="modifyCancel('modifyAreaFormRef')">取 消</el-button>
                <el-button type="primary" @click="modifySubmit('modifyAreaFormRef')">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>


</div>
</template>

<script>
    import qs from "qs";

export default {
  name: "AreaDevice.vue",

    data() {
        return {
            // 存放分区信息
            areaTableData: [],
            // 经过修改格式后的分区信息
            showTableData: [],

            // 分页功能部分
            currentPage: 1, // 前往第几页 默认为1
            pageSize: 5,    // 当前页有多少条数据 默认5
            total: 10,      //一共有多少条数据 默认20

            // 添加分区
            addDialogVisible: false, //添加对话框的显示与隐藏
            addAreaForm: {
                areaName:[],
                areaLeader:[]
            },
            addAreaFormRules: {
                areaName:[
                    { required: true, message: "请输入分区名称", trigger: "blur"},
                    { min: 2, max:30, message: "长度在 2 到 30 个字符", trigger: "blur"}
                ],
            },

            // 修改分区
            modifyDialogVisible: false, //修改对话框的显示与隐藏
            modifyAreaForm: {
                AreaID:[],
                AreaName:[],
                AreaLeader:[]
            },
            modifyAreaFormRules: {
                AreaName:[
                    { required: true, message: "请输入分区名称", trigger: "blur"},
                    { min: 2, max:30, message: "长度在 2 到 30 个字符", trigger: "blur"}
                ]
            },
            AreaLeaderID:[],

            // 中间变量
            leadMessage:[],

            // 分区管理人员
            leaderlist:[],



        }
    },

    created() {
        this.getAreaList()
    },
    methods: {
    // 获取分区信息(分页)
        getAreaList() {
            this.$axios.get('/getAreaList', { params: {
                    page: this.currentPage,
                    size: this.pageSize
                }})
                .then(res => {
                    console.log(res)
                    this.areaTableData = res.data
                    this.$axios.get('/getAreaSize')
                        .then(res => {
                            console.log(res)
                            this.total = res.data
                            // 解决深拷贝浅拷贝的问题
                            this.showTableData = JSON.parse(JSON.stringify(this.areaTableData));
                            this.showLeader()
                            this.timeShow()
                        })
                })
        },
    // 解决管理人员名称拼接
        showLeader() {
            for (var i = 0; i < this.showTableData.length; i++) {
                var leader = '';
                // debugger
                for(var j =0; j<this.showTableData[i].AreaLeader.length; j++) {
                    // debugger
                    var leaderName = this.showTableData[i].AreaLeader[j].userName
                    var leaderPhone = this.showTableData[i].AreaLeader[j].MoPhone
                    leader = leaderName+'-'+leaderPhone+";"+leader
                }
                this.showTableData[i].AreaLeader = leader;
            }
            console.log(this.areaTableData)
            console.log(this.showTableData)
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
            for(var i = 0; i < this.showTableData.length; i++) {
                this.showTableData[i].AreaCreateDate =this.timeFormat(this.showTableData[i].CreateTime.time)
            }
        },

    //  分页功能
    //  每页显示的条数 （点击后将当前页数重置为1）
        handleSizeChange(size) {
            this.pageSize = size
            this.currentPage = 1
            this.getAreaList()
        },
    //  当前点击的是第几页 （点击后相当于根据页数获取数据）
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
            this.getAreaList()
        },

    //  添加分区
        addArea() {
            this.addDialogVisible = true
            this.getAreaLeader()
        },
    //  获取分区管理员
        getAreaLeader() {
            this.$axios.get('/getAreaLeader')
                .then(res => {
                    console.log(res)
                    this.leaderlist = res.data
                })
        },
    //  选择分区管理员
        addLeader(value) {
            console.log(value)
        },
    //  确定添加
        addSubmit(addAreaFormRef) {
            if (this.addAreaForm.areaName=='') {
                this.$message.error("请输入分区名称")
            } else if (this.addAreaForm.areaName.length<2) {
                this.$message.error("分区名称为2-30个字符")
            } else if (this.addAreaForm.areaName.length>30) {
                this.$message.error("分区名称为2-30个字符")
            } else {
                if (this.addAreaForm.areaLeader.length!=0) {
                    console.log(this.addAreaForm.areaLeader)
                }
                if (this.addAreaForm.areaLeader.length==0){
                    this.addAreaForm.areaLeader=-1
                }
                console.log(this.addAreaForm)
                var params = qs.stringify({
                    areaName:this.addAreaForm.areaName,
                    areaLeader:this.addAreaForm.areaLeader
                },{ arrayFormat: 'repeat' })
                this.$axios.post('/addArea',params)
                    .then(res => {
                        console.log(res)
                        if(res.data === 201) {
                            this.$message.error('改分区名称已存在')
                        } else {
                            this.$message.success('添加成功')
                            this.addDialogVisible = false
                            this.addAreaForm = {}
                            this.$refs[addAreaFormRef].resetFields();
                            this.getAreaList()
                        }
                    })
            }

        },
    //  取消添加或关闭对话框
        addCancel(addAreaFormRef) {
            this.addDialogVisible=false
            this.addAreaForm = {}
            this.$refs[addAreaFormRef].resetFields();
        },

    //  修改分区（只修改分区管理员名称以及分区名称）
    //  可能是数据双向绑定的原因没办法把修改后的格式改回去(深拷贝与浅拷贝的问题)
        //  所以这里需要在发送请求就是根据分区id获取到当前管理员的id与级联选择器绑定然后让他显示出来
        modifyArea(row) {
            this.getAreaLeader()
            this.leadMessage=[]
            this.AreaLeaderID=[]

            this.modifyDialogVisible = true
            console.log(row)
            this.modifyAreaForm.AreaID = row.AreaID
            this.modifyAreaForm.AreaName = row.AreaName

            // 循环找到需要的那一条数据
            for (var i = 0; i < this.areaTableData.length; i++) {
                if(this.areaTableData[i].AreaID === row.AreaID) {
                    this.leadMessage = this.areaTableData[i].AreaLeader
                }
            }
            // 遍历得到想要userid
            for (var j = 0; j < this.leadMessage.length; j++) {
                this.AreaLeaderID[j] = this.leadMessage[j].userID
            }
            if (this.leadMessage.length == 0) {
                this.modifyAreaForm.AreaLeader = []
            } else {
                this.modifyAreaForm.AreaLeader = this.AreaLeaderID
            }
        },
    //  确定进行修改
        modifySubmit(modifyAreaFormRef) {
            if (this.modifyAreaForm.AreaName=='') {
                this.$message.error("请输入分区名称")
            } else if (this.modifyAreaForm.AreaName.length<2) {
                this.$message.error("分区名称为2-30个字符")
            } else if (this.modifyAreaForm.AreaName.length>30) {
                this.$message.error("分区名称为2-30个字符")
            } else {
                console.log(this.modifyAreaForm)
                if (this.modifyAreaForm.AreaLeader.length==0){
                    this.modifyAreaForm.AreaLeader=-1
                }
                var params = qs.stringify({
                    areaID:this.modifyAreaForm.AreaID,
                    areaName:this.modifyAreaForm.AreaName,
                    areaLeader:this.modifyAreaForm.AreaLeader
                },{ arrayFormat: 'repeat' })
                this.$axios.post("/testLeader",params)
                console.log(params)
                this.$axios.post('/modifyArea',params)
                    .then(res => {
                        console.log(res)
                        if(res.data === 200) {
                            this.$message.success('修改成功')
                            this.modifyAreaForm = {}
                            this.modifyDialogVisible = false
                            this.$refs[modifyAreaFormRef].resetFields();
                            this.getAreaList()
                        } else if (res.data === 201){
                            this.$message.error('改分区名称已存在')
                        } else {
                            this.$message.error('修改失败')
                        }
                    })
            }

        },
    //  关闭修改对话框与取消修改
        modifyCancel(modifyAreaFormRef) {
            this.modifyDialogVisible = false
            this.modifyAreaForm = {}
            this.$refs[modifyAreaFormRef].resetFields();
        },

    //  删除分区
        deleteArea(row) {
            console.log("**********",row)
            this.$confirm('此操作将永久删除该管线, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = qs.stringify({
                    areaID:row.AreaID
                })
                this.$axios.post('/deleteArea',params)
                    .then( res=> {
                        console.log(res)
                        if (res.data == 200) {
                            this.$message.success("删除成功")
                            this.getAreaList()
                        } else {
                            this.$message.error("删除失败")
                        }
                    })
            })
        },

        // 解决input框不能输入的问题
        onInput() {this.$forceUpdate();},
    }
}
</script>

<style scoped>

</style>
