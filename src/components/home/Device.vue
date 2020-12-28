<template>
    <div class="container">
        <div class="toptable">
            <div class="select">
                <el-select id="select1" v-model="condition"  clearable placeholder="--搜索条件--" class="handle-select"
                           style=" margin-right: 10px" @change="selectone" @click="showAll">
                    <el-option key="1" label="按分区查看" value="11"></el-option>
                    <el-option key="2" label="按管线查看" value="21"></el-option>
                    <el-option key="3" label="按控制柜查看" value="22"></el-option>
<!--                    <el-option key="4" label="其他查询" value="23"></el-option>-->

                </el-select>

            </div>
            <div class="input">
                <el-input v-model="input" placeholder="请输入关键字"></el-input>

            </div>

            <div class="rightbutton">
                <button class="addbutton"  >查询</button>
                <button class="addbutton"  >添加</button>
            </div>
        </div>


        <el-table
                :data="tableData"
                stripe
                style="width: 100%"
                :default-sort="{prop: 'date', order: 'descending'}"
        >
            <el-table-column
                    prop="TmnID"
                    label="控制柜id"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="TmnName"
                    label="控制柜名称"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="U1TmnID"
                    label="上一个控制柜ID1"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="D1TmnID"
                    label="下一控制柜ID1"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="PipID"
                    label="所属管线ID"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="AreaID"
                    label="所属分区"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="ConPont1"
                    label="部件1"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="TmnDesc"
                    label="控制柜描述信息"
                    width="150">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            type="primary"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                            type="danger"
                            size="mini"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>


                </template>
            </el-table-column>
        </el-table>

<!--        <el-table-->
<!--                :data="tableData1"-->
<!--                stripe-->
<!--                style="width: 100%"-->
<!--                :default-sort="{prop: 'date', order: 'descending'}"-->
<!--        >-->
<!--            <el-table-column-->
<!--                    prop="TmnID"-->
<!--                    label="控制柜id"-->
<!--                    width="80">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="TmnName"-->
<!--                    label="控制柜名称"-->
<!--                    width="100">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="U1TmnID"-->
<!--                    label="上一个控制柜ID1"-->
<!--                    width="130">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="D1TmnID"-->
<!--                    label="下一控制柜ID1"-->
<!--                    width="130">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="PipID"-->
<!--                    label="所属管线ID"-->
<!--                    width="100">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="AreaID"-->
<!--                    label="所属分区"-->
<!--                    width="80">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="ConPont1"-->
<!--                    label="部件1"-->
<!--                    width="100">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="TmnDesc"-->
<!--                    label="控制柜描述信息"-->
<!--                    width="150">-->
<!--            </el-table-column>-->
<!--            <el-table-column label="操作">-->
<!--                <template slot-scope="scope">-->
<!--                    <el-button-->
<!--                            type="primary"-->
<!--                            size="mini"-->
<!--                            @click="handleEdit(scope.$index, scope.row)">编辑-->
<!--                    </el-button>-->
<!--                    <el-button-->
<!--                            type="danger"-->
<!--                            size="mini"-->
<!--                            @click="handleDelete(scope.$index, scope.row)">删除-->
<!--                    </el-button>-->


<!--                </template>-->
<!--            </el-table-column>-->
<!--        </el-table>-->

    </div>
</template>

<script>
    export default {
        name: "Staff",
        data() {
            return {
                input:['222'],
                condition:'',
                tableData: [{
                    TmnID:1,
                    TmnName:"控制柜1",
                    U1TmnID:0,
                    D1TmnID:"2",
                    PipID:"1",
                    AreaID:"石景山区",
                    ConPont1:"部件1信息",
                    TmnDesc:"这是第一个控制柜"
                },{
                    TmnID:2,
                    TmnName:"控制柜2",
                    U1TmnID:"1",
                    D1TmnID:"3",
                    PipID:"1",
                    AreaID: "门头沟区",
                    ConPont1:"部件2信息",
                    TmnDesc:"这是第二个控制柜"
                },{
                    TmnID:3,
                    TmnName:"控制柜3",
                    U1TmnID:"2",
                    D1TmnID:"5",
                    PipID:"1",
                    AreaID: "门头沟区",
                    ConPont1:"部件3信息",
                    TmnDesc:"这是第三个控制柜"
                }
                ],
                // tableData1:[{
                //     TmnID:'',
                //     TmnName:'',
                //     U1TmnID:'',
                //     D1TmnID:'',
                //     PipID:'',
                //     AreaID:'',
                //     ConPont1:'',
                //     TmnDesc:''
                // }],
                screendata:{
                    condition:'',
                    selectcontent:''
                },
            }
        },
        methods:{
            handleDelete(index,row){
                this.index = index;
                this.row = row;
                this.delVisible = true
            },
            showall(){

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
