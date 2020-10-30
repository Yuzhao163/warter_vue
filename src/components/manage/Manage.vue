<template>
    <div>
        <el-form style="width: 600px" ref="form" :model="form" label-width="200px">
            <el-form-item label="分区选择">
                <el-select v-model="areaselected" placeholder='请选择分区'>
                    <!--        <option disabled value="">请选择</option>-->
                    <el-option v-for="(area,i) in form.areas" :area="area" :key="i" :label="area.message"
                               :value="area.message"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="管线选择">
                <el-select v-model="pipeselected" placeholder='请选择管线'>
                    <!--        <option disabled value="">请选择</option>-->
                    <el-option v-for="(pipe,i) in form.pipe" :pipe="pipe" :key="i" :label="pipe.message"
                               :value="pipe.message"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="控制柜选择">
                <el-select v-model="terminalselected" placeholder='请选择控制柜'>
                    <!--        <option disabled value="">请选择</option>-->
                    <el-option v-for="(terminal,i) in form.terminal" :terminal="terminal" :key="i" :label="terminal.message"
                               :value="terminal.message"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="工作方式选择">
                <el-select v-model="modeselected" placeholder='请选择工作方式'>
                    <!--        <option disabled value="">请选择</option>-->
                    <el-option v-for="(mode,i) in form.mode" :mode="mode" :key="i" :label="mode.message"
                               :value="mode.index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传周期设置">
                <el-input v-model="form.uploadcycle"></el-input>
            </el-form-item>
            <el-form-item label="阀位设置">
                <el-input v-model="form.vpre"></el-input>
            </el-form-item>
            <el-form-item label="开阀周期">
                <el-input v-model="form.ovperiod"></el-input>
            </el-form-item>
            <el-form-item label="开阀水位">
                <el-input v-model="form.ovwaterline"></el-input>
            </el-form-item>
            <el-form-item label="开阀保持时间">
                <el-input v-model="form.ovkeeptime"></el-input>
            </el-form-item>
            <el-form-item label="关阀水位">
                <el-input v-model="form.cvwaterline"></el-input>
            </el-form-item>
            <el-form-item label="最长阀动作时间">
                <el-input v-model="form.vactiontime"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-on:click="submit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    ///import qs from 'qs'
    //var terminalselect = [{message:"选择此项进行刷新"}];
    var terminalselect = [{}];
    console.log("1",terminalselect)
    var terminal = [];
    export default {
        name: "Manage",
        data() {
            return {
                areaselected: '',
                pipeselected: '',
                terminalselected: '',
                modeselected: '',
                form: {

                    areas: [
                        {message: '1'}, {message: '2'}, {message: '3'}
                    ],//分区
                    pipe: '',//管线
                    terminal:terminalselect,//控制柜
                    mode: [{message: '手动', index: '11'}, {message: '自动方式1', index: '21'}, {
                        message: '自动方式2',
                        index: '22'
                    }, {message: '自动方式3', index: '23'}, {message: '指定上传周期', index: '51'}],//工作方式
                    uploadcycle: '',
                    vpre: '',//阀位
                    ovperiod: '',//开阀周期
                    ovwaterline: '',//开阀水位
                    ovkeeptime: "",//开阀保持时间
                    cvwaterline: "",//关阀水位
                    vactiontime: "",//最长阀动作时间
                }
            }
        },
        mounted() {
            this.getarea()
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            getarea() {
                console.log('!')
                this.$axios.
                    get('/getarea')
                    .then(function (res) {
                        console.log(res)
                        terminal= res['data'];
                        // terminalselect = res;
                        console.log(terminal)
                        for(var i =0;i<terminal.length;i++){
                            var terdata = terminal[i]['tmnId'];
                            terminalselect[i] = {"message": terdata}
                            console.log("terminalselect",terminalselect)
                            console.log("terdata",terdata)
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })

            },
            submit() {
                ///var postData = new URLSearchParams();
                var PackgaeID = "1";
                var PeerAddress = "1";
                var D_ID = "1";
                var W_work = "1";
                var CmdStatus = "1";
                var TmnID = this.terminalselected;
                var V_pre =  this.form.vpre;//阀位
                var OV_period =  this.form.ovperiod;//开阀周期
                var OV_waterline =  this.form.ovwaterline;//开阀水位
                var OV_keeptime = this.form.ovkeeptime;//开阀保持时间
                var CV_waterline = this.form.cvwaterline;//关阀水位
                var V_actiontime =  this.form.vactiontime;//最长阀动作时间;

                this.$axios
                    // .post('/ma', qs.stringify({
                    .post('/ma', {
                            TmnID: TmnID,
                            V_pre: V_pre,
                            OV_period: OV_period,
                            OV_waterline: OV_waterline,
                            OV_keeptime: OV_keeptime,
                            CV_waterline: CV_waterline,
                            V_actiontime: V_actiontime,
                            PackgaeID:PackgaeID,
                            PeerAddress:PeerAddress,
                            D_ID:D_ID,
                            W_work:W_work,
                            CmdStatus:CmdStatus,
                    },
                        ///{headers:{'Content-Type': 'application/x-www-form-urlencoded'}}
                    )
                    .then(successResponse => {
                        if (successResponse.data.code === 200) {
                            alert("插入成功成功!");
                            this.$router.replace("/manage");
                    }
                })
                    .catch(failResponse => {
                        alert(failResponse)
                    })
            }
    },}
</script>

<style>
    .el-main {
        display: block;
        flex: 1;
        flex-basis: auto;
        overflow: auto;
        box-sizing: border-box;
        padding: 0px;
        background: white
    }
</style>
