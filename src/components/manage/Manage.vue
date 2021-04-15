<template>

  <div class="main">
    <div class="tips">请选择要下发命令的控制柜：</div>
    <div class="tmnview">
      <ul style="list-style: none">
        <li v-for="item in this.tmndata" :key="item">
          <div class="imgbox" v-on:click="openform(item)">
            <img  src="../../assets/img/控制柜.png"/>
          </div>
          <div class="tmnname">{{item.tmnName}}</div></li>
      </ul>
    </div>


    <div class="form" v-show="details">
      <span style="font:24px arial,sans-serif;color: #134d6e;font-weight: bolder" >设置控制指令</span>
    <el-form style="width:600px;" ref="form" :model="form" label-width="200px">
      <el-form-item label="控制柜名称">
      <span>{{this.tabletmnname}}</span>
      </el-form-item>
      <el-form-item label="分区选择">
        <el-select v-model="areaselected" placeholder='请选择分区' @change="this.getpipe">
          <!--        <option disabled value="">请选择</option>-->
          <el-option v-for="(area,i) in areas" :area="area" :key="i" :label="area.message"
                     :value="area.message"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="管线选择">
        <el-select v-model="pipeselected" placeholder='请选择管线' @change="this.gettmn">
          <!--        <option disabled value="">请选择</option>-->
          <el-option v-for="(pipe,i) in pipes" :pipe="pipe" :key="i" :label="pipe.message"
                     :value="pipe.message"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="控制柜选择">
        <el-select v-model="terminalselected" placeholder='请选择控制柜'>
          <!--        <option disabled value="">请选择</option>-->
          <el-option v-for="(terminal,i) in tmns" :terminal="terminal" :key="i" :label="terminal.message"
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
        <el-button type="primary" v-on:click="submit">下发命令</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import qs from 'qs';

var terminalselect = [{}];
console.log("1", terminalselect)
export default {
  name: "Manage",
  data() {
    return {
      tmndata:[{tmnName:'一号柜'},{tmnName:'二号柜'},{tmnName:'三号柜'},{tmnName:'三号柜'},
        {tmnName:'三号柜'},{tmnName:'三号柜'},{tmnName:'三号柜'},{tmnName:'三号柜'},{tmnName:'三号柜'},{tmnName:'三号柜'}],
      tabletmnname:'',
      details:false,
      areas: [],//存储使用者管辖的分区
      pipes: [],//存储使用者管辖的管线
      tmns: [],//存储使用者管辖的控制柜

      areaselected: '',
      pipeselected: '',
      terminalselected: '',
      modeselected: '',
      form: {

        areas: [
          {message: '1'}, {message: '2'}, {message: '3'}
        ],//分区
        pipe: '',//管线
        terminal: terminalselect,//控制柜
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
    //获取控制柜数据
    getdata(){
      var param=qs.stringify(this.$store.state.users.username)
      this.$axios.post('/请求tmn数据',param).then(res=>{
        this.tmndata=res;
      }) .catch(failResponse => {
        alert(failResponse)
      })

    },
    //点击后打开表单
    openform(item){
      this.tabletmnname=item.tmnName
      if (this.details==false)
      {
        this.details=true
      }else if(this.details==true){
        this.details=false
      }
    },
    onSubmit() {
      console.log('submit!');
    },
    //进入页面时请求操作者管辖的分区
    getarea() {
      var param = qs.stringify({UserName: this.$store.state.users.username})//将维护人员信息传给后端得到他所控制的区域
      this.$axios.post('/getarea', param)
          .then(res => {
            this.areas = res;
          })
          .catch(function (err) {
            console.log(err)
          })
      this.getpipe();
    },
    //根据分区请求管线
    getpipe() {
      var param = qs.stringify({
        UserName: this.$store.state.users.username,
        areaId:this.areaselected,
      });
      this.$axios.post('/getpipe', param)
          .then(res => {
            this.pipes = res;
          })
          .catch(function (err) {
            console.log(err)
          })
      this.gettmn();
    },
    //根据管线请求控制柜
    gettmn() {
      var param = qs.stringify({
        UserName: this.$store.state.users.username,
        pipeId:this.pipeselected,
      });
      this.$axios.post('/gettmn', param)
          .then(res => {
            this.tmns = res;
          })
          .catch(function (err) {
            console.log(err)
          })
    },
    submit() {
      ///var postData = new URLSearchParams();
      var params = qs.stringify({

        TmnID: this.terminalselected,
        V_pre: this.form.vpre,//阀位
        OV_period: this.form.ovperiod,//开阀周期
        OV_waterline: this.form.ovwaterline,//开阀水位
        OV_keeptime: this.form.ovkeeptime,//开阀保持时间
        CV_waterline: this.form.cvwaterline,//关阀水位
        V_actiontime: this.form.vactiontime,//最长阀动作时间;
      });

      this.$confirm('将下发命令至终端, 确定下发？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
            .post('/ma', params)
            .then(successResponse => {
              if (successResponse.data.code === 200) {
                alert("插入成功成功!");
                this.$router.replace("/manage");
              }
            })
            .catch(failResponse => {
              alert(failResponse)
            })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消命令下发'
        });
      });

    }
  },
}
</script>

<style>
.tips{
  display: flex;
  font-size: 28px
}
.tmnview{

}
.tmnview ul{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.imgbox{
  display: flex;
  width: 120px;
  height: 120px;
  padding: 10px;
  margin: 50px 50px 20px 50px;
}
:hover.imgbox{
 background-color: #d8dadb;
  cursor: pointer;
}
.tmnname{

}
.main {
  position: relative;
  width: 100%;
  height: 100%;
}
.form{
  background-color: #ffffff;
  padding: 32px;
  margin-bottom: 32px;
}

</style>
