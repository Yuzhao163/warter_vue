<template>
    <div class="">
<!--        卡片视图区域-->
        <el-card class="box-card">

<!--        搜索与添加区域-->
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getTmnList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加控制柜</el-button>
                </el-col>
            </el-row>

<!--        控制柜列表区域-->
            <el-table :data="tmnTableData" border stripe style="width: 100%; margin-top: 35px; margin-bottom: 25px">
                <el-table-column label="#" type="index"></el-table-column>
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

<!--&lt;!&ndash;        分页区域&ndash;&gt;-->
<!--            <el-pagination-->
<!--                    @size-change="handleSizeChange"-->
<!--                    @current-change="handleCurrentChange"-->
<!--                    :current-page="currentPage4"-->
<!--                    :page-sizes="[1, 2, 5, 10]"-->
<!--                    :page-size="1"-->
<!--                    layout="total, sizes, prev, pager, next, jumper"-->
<!--                    :total="queryInfo.page"-->
<!--            >-->
<!--            </el-pagination>-->

<!--            添加控制柜对话框-->
            <el-dialog
                    title="提示"
                    :visible.sync="addDialogVisible"
                    width="50%">

                <el-form :model="addTmnForm" :rules="addTmnFormRules" ref="addTmnFormRef" label-width="120px">
                    <el-form-item label="控制柜名称" prop="tmnName">
                        <el-input v-model="addTmnForm.tmnName"></el-input>
                    </el-form-item>
                    <el-form-item label="上一控制柜名称" prop="u1TmnID">
                        <el-input v-model="addTmnForm.u1TmnID"></el-input>
                    </el-form-item>
                    <el-form-item label="下一控制柜名称" prop="d1TmnID">
                        <el-input v-model="addTmnForm.d1TmnID"></el-input>
                    </el-form-item>
                    <el-form-item label="分区id" prop="pipID">
                        <el-input v-model="addTmnForm.pipID"></el-input>
                    </el-form-item>
                    <el-form-item label="部件信息" prop="conPont1">
                        <el-input v-model="addTmnForm.conPont1"></el-input>
                    </el-form-item>
                    <el-form-item label="描述信息" prop="tmnDesc">
                        <el-input v-model="addTmnForm.tmnDesc"></el-input>
                    </el-form-item>
                </el-form>


                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addTmn">确 定</el-button>
                </span>
            </el-dialog>

<!--            编辑控制柜对话框-->
            <el-dialog
                    title="提示"
                    :visible.sync="editTmnDialogVisible"
                    width="50%">

                <el-form :model="editTmnForm" :rules="editTmnFormRules" ref="editTmnFormRef" label-width="120px">
                    <el-form-item label="控制柜名称" prop="tmnName">
                        <el-input v-model="editTmnForm.tmnName"></el-input>
                    </el-form-item>
                    <el-form-item label="上一控制柜名称(1)" prop="u1TmnID">
                        <el-input v-model="editTmnForm.u1TmnID"></el-input>
                    </el-form-item>
                    <el-form-item label="上一控制柜名称(2)" prop="tmnName">
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
                    <el-button type="primary" >确 定</el-button>
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
                // 控制柜表信息
                tmnTableData:[],

                // 添加控制柜对话框的显示与隐藏
                addDialogVisible: false,
                // 添加控制柜表单
                addTmnForm: {
                    tmnName: '',
                    u1TmnID: '',
                    d1TmnID: '',
                    pipID: '',
                    conPont1: '',
                    tmnDesc: '',
                },
                // 添加控制柜表单规则
                addTmnFormRules: {
                    tmnName: [
                        { required: true, message: "请输入用户名", trigger: "blur"},
                        { min: 3, max:10, message: "长度在 3 到 10 个字符", trigger: "blur"}
                    ],
                    u1TmnID: [
                        { required: true, message: "请输入上一控制柜id", trigger: "blur"},
                    ],
                    d1TmnID: [
                        { required: true, message: "请输入下一控制柜id", trigger: "blur"},
                    ],
                    pipID: [
                        { required: true, message: "请输入分区id", trigger: "blur"},
                    ],
                    conPont1: [
                        { required: false, message: "请输入部件信息", trigger: "blur"},
                    ],
                    tmnDesc: [
                        { required: false, message: "请输入控制柜描述信息", trigger: "blur"},
                    ],
                },
                // 编辑控制柜表单
                editTmnForm: {
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

                // 查询结果分页信息
                queryInfo: [{
                    // 查询的内容信息
                    query: '',
                    // 当前的页数
                    pagenum: 1,
                    // 当前每页显示多少条数据
                    pagesize: 2,
                    // 共有多少条数据
                    page: ''
                }],

                querys:[
                    {
                        label:"按分区查看",
                        key:"按分区查看",
                        child:[
                            "分区1","分区2","分区3"
                        ]
                    },
                    {
                        label:"按管线查看",
                        key:"按管线查看",
                        child:[
                            "管线1","管线2","管线3"
                        ]
                    },
                    {
                        label:"按控制柜查看",
                        key:"按控制柜查看",
                        child:[
                            "控制柜1","控制柜2","控制柜3"
                        ]
                    }
                ],

                // 编辑控制柜详细信息对话框的显示
                editTmnDialogVisible: false,

            }
        },
        created() {
          this.getTmnList()
        },
        methods:{
            //获取控制柜列表信息
            async getTmnList() {
                console.log('获取控制柜列表信息')
                const {data: res} = await this.$axios.get('/getTmnList')
                console.log(res)
                this.tmnTableData = res
                this.queryInfo.page = res.length
                console.log(res.length)
            },

            // 添加控制柜
            addTmn() {
                this.$axios.post(`/addTmn`)

            },

            // 编辑控制柜
            editTmnList(row) {
                console.log(row)
                console.log(this.editTmnForm)
                this.editTmnForm = row
                console.log(this.editTmnForm)
                this.editTmnDialogVisible = true

            },

            // 删除控制柜
            async removeById(row) {
                console.log(row)
                const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                console.log(confirmResult)
                if (confirmResult !== 'confirm')
                    return this.$message.info('已经取消删除')
                console.log('确认删除！')
                const {data: res} = await this.$axios.get('/removeTmn')
                console.log(res)
            },


            handleDelete(index,row){
                this.index = index;
                this.row = row;
                this.delVisible = true
            },
            showall(){

            },
            selectNum(){

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
