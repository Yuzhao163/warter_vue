<template>
    <div class="container">
        <div class="title">
            <div></div>
        </div>
        <!--    异常处理表格-->
        <div class="table">
            <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%"
                    :default-sort="{prop: 'date', order: 'descending'}"
            >
                <el-table-column
                        prop="tmnName"
                        label="控制柜名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="time"
                        label="故障时间"
                        width="160"
                        :formatter="dateFormat">
                </el-table-column>
                <el-table-column
                        prop="error_Position"
                        label="异常部位"
                        width="80">
                </el-table-column>
<!--                <el-table-column-->
<!--                        prop="error_level"-->
<!--                        label="异常等级"-->
<!--                        width="80">-->
<!--                </el-table-column>-->
                <el-table-column
                        prop="if_deal"
                        label="处理状态"
                        width="80"
                        :formatter="if_deal">
                </el-table-column>
                <el-table-column
                        prop="c_t"
                        label="处理时间"
                        width="160"
                        :formatter="dateFormat">
                </el-table-column>
                <el-table-column
                        label="查看详情"
                        width="80">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="primary"
                                @click="details=true,f_details(scope.$index,scope.row),getdatas()">详情
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
                    :total=total>
                >
            </el-pagination>

        </div>
        <!--    弹框内容-->

        <el-dialog style="text-align: left" title="详情信息" :visible.sync="details">
            <div>控制柜名称：{{ this.row_msg.tmnName }}</div>
            <div>控制柜编号：{{ this.row_msg.tmnId }}</div>
            <div>故障部位：{{ this.row_msg.error_Position }}</div>
            <!--      <div class="pipearea">-->
            <!--        <span>所属管线：</span>-->
            <!--        <el-select id="select1" v-model="PipName" ref="select1" clearable placeholder="&#45;&#45;所属管线&#45;&#45;" class="handle-select"-->
            <!--                   style=" margin-right: 10px">-->
            <!--          <el-option v-for="item in Tmn"-->
            <!--                     :key="item.PipName"-->
            <!--                     :label="item.PipName"-->
            <!--                     :value="item.PipName"></el-option>-->
            <!--        </el-select>-->
            <!--        <div class="PA">-->
            <!--          <div>线内编号：{{ this.AreaName }}</div>-->
            <!--          <div>所属分区：{{ this.AreaName }}</div>-->
            <!--        </div>-->
            <!--      </div>-->
          <div class="text_form">
            <el-table
                    :data="tableDatas"
                    style="width: 100%"
                    :default-sort="{prop: 'date', order: 'descending'}"
            >
              <el-table-column
                      prop="c_t"
                      label="日期 "
                      sortable
                      width="210"
                      :formatter="dateFormat">
              </el-table-column>
              <el-table-column
                      prop="user"
                      label="操作人员"
                      sortable
                      width="210">
              </el-table-column>
              <el-table-column
                      prop="result"
                      label="解决方案"
                      width="210">
              </el-table-column>
            </el-table>
          </div>
            <div class="faultdetail" style="margin-top: 20px">
                <div>故障详情：</div>
                <textarea class="resolvent" v-model="fault_detil"></textarea>
            </div>

            <div class="faultdetail" style="margin-top: 20px">
                <div>解决方案：</div>
                <!--5.8/15.58修改故障处理中的图像样式-->
                <textarea class="resolvent" v-model="res_olvent"></textarea>
            </div>

            <div slot="footer" class="dialog-footer">

                <el-button @click="details = false">取 消</el-button>
                <el-button type="primary" @click="details = false,check_fault()">确 定</el-button>

            </div>
        </el-dialog>
    </div>
</template>

<script>

    import qs from 'qs'
    import moment from "moment";


    export default {
        name: "PrivateFault",
        // components: {Temperature},
        mounted() {

            this.getdata()
        },
        data() {
            return {
                tableData: [],
                tableDatas: [],//存储接收到的处理时间，处理人员，操作记录
                details: false,
                tableindex: 0,//每页的第几个数据
                form: {
                    name: '',
                    region: '',
                },
                PipName: '',
                AreaName: '',
                Tmn: [
                    {
                        PipName: 'A',
                        AreaName: '1',
                    }, {
                        PipName: 'B',
                        AreaName: '2',
                    }, {
                        PipName: 'C',
                        AreaName: '3',
                    }
                ],
                row_msg: {
                    tmnName: '',
                    tmnId: '',
                    erid: '',
                    error_Position: '',
                },
                aa: '',
                res_olvent: '',//解决方案
                fault_detil: '',//故障描述
                Tmnname: "北方工业大学",
                TmnID: '10009',
                ERId: '',//故障编码

                currentPage: 1, // 当前页码
                total: 20, // 总条数
                pageSize: 5 // 每页的数据条数

            }
        },
        created() {
            this.getdata()
        },
        methods: {

            getdata() {
                var params = qs.stringify({
                    TmnLeader: this.$store.state.users.username
                })
                this.$axios.post('/getCountNum',params).then(res =>{
                    console.log("我收到的记录总条数是",res.data)
                    this.total = res.data

                    var param = qs.stringify({
                        TmnLeader: this.$store.state.users.username,
                        page: this.currentPage,
                        size: this.pageSize,
                    })
                    this.$axios.post('/geterrorbyusername', param).then(res => {
                        console.log(res)
                        this.tableData = res.data;
                    })
                }).catch(failResponse => {

                        console.log(failResponse)
                        alert(failResponse)
                    })
            },

          getdatas(){
            var param = qs.stringify({
              // TmnLeader: this.$store.state.users.username
              Erid:this.row_msg.erid
            })
              //5.19将该接口从geterrorbytmnleader修改为geterrorbyerid
            this.$axios.post('/geterrorbyerid', param).then(res => {
              console.log(res)
              this.tableDatas = res.data;
            })
                    .catch(failResponse => {

                      console.log(failResponse)
                      alert(failResponse)
                    })
          },

            f_details(index, row) {
                this.row_msg.erid = row.erid;
                this.row_msg.tmnName = row.tmnName;
                this.row_msg.tmnId = row.tmnId;
                this.row_msg.error_Position = row.error_Position;
                // this.fault_detil = row.exception;
                // this.res_olvent = row.result;
                this.fault_detil = "";
                this.res_olvent = "";
            },
            if_deal(row) {
                switch (row.if_deal) {
                    case '1':
                        return '未处理';
                    case '2':
                        return '已处理';
                }

            },
            dateFormat:function(row,column){
                var date = row[column.property];
                if(date === undefined){
                    return ''
                } ;
                return moment(date).format("YYYY-MM-DD HH:mm:ss")
            },
            check_fault() {

                this.$confirm('是否提交异常处理记录', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '我再想想',
                    type: 'warning'
                }).then(() => {
                    if(this.fault_detil.length == 0 || this.res_olvent.length == 0){
                        this.$message({
                            type: 'info',
                            message: '请填写具体的故障及解决方案'
                        });
                    } else if(this.fault_detil.length > 255){
                        this.$message({
                            type: 'info',
                            message: '故障详情太复杂啦'
                        });
                    } else if(this.res_olvent.length > 255){
                        this.$message({
                            type: 'info',
                            message: '异常处理方案太复杂啦'
                        });
                    } else{
                        var parames = qs.stringify({
                            ERId: this.row_msg.erid,
                            TmnId: this.row_msg.tmnId,
                            User: this.$store.state.users.username,
                            Exception: this.fault_detil,
                            Result: this.res_olvent,
                        });
                        console.log(parames)
                        this.$axios.post('/dealerror', parames).then(() => {

                        })
                        this.$message({
                            type: 'success',
                            message: '提交成功!'
                        });
                        this.getdata();
                    }

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消提交！'
                    });
                });

            },

            //每页条数改变时触发 选择一页显示多少行
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.currentPage = 1;
                this.pageSize = val;
                this.getdata();
            },
            //当前页改变时触发 跳转其他页
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                this.getdata()
            },

            //清空
            clearbox(){
                this.res_olvent = ""
            },

        },

    }
</script>

<style scoped>
    .title {
        display: flex;
    }

    .container {
        display: inline-block;
        padding: 30px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .table {
        display: inline-block;
    }

    .dialog-footer {
        text-align: center;
    }

    .pipearea {
        margin: 10px 0;
    }

    .pipearea .PA {
        display: inline-block;
    }

    .PA div {
        display: inline-block;
        margin: 0px 20px;
    }

    .faultdetail {
        display: flex;
    }

    .fault-text {

        width: 480px;
        height: 230px;
        padding: 20px;
        background-color: #e5f1f6;
        border-radius: 20px;
        text-align: left;
        font-size: 16px;
    }

    .resolvent {
        width: 480px;
        height: 160px;
        padding: 20px;
        border: 2px solid #e8e8e8;
        color: #595c5f;
        border-radius: 20px;
        text-align: left;
        font-size: 16px;
        resize: none; /*禁止文本框拉伸*/
    }

    :hover.resolvent {
        width: 480px;
        height: 160px;
        padding: 20px;
        border: 2px solid #d0d0d0;
        border-radius: 20px;
        text-align: left;
        font-size: 16px;
        resize: none; /*禁止文本框拉伸*/
    }

    :focus.resolvent {
        width: 480px;
        height: 160px;
        padding: 20px;
        border: 2px solid #e8e8e8;
        border-radius: 20px;
        box-shadow: 0 0 15px #d0d0d0;
        text-align: left;
        font-size: 16px;
        resize: none; /*禁止文本框拉伸*/
    }
.text_form{

}




    /deep/ .el-dialog__body {
        padding: 10px 20px;
    }


    /*获取焦点元素后的设置*/
    textarea:focus {

        outline: none;

    }
</style>
