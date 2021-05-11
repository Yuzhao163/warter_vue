<template>

  <div class="main">

    <div class="tips">请选择要下发命令的控制柜：</div>
    <div class="tmnview">
      <ul style="list-style: none">
        <li v-for="(item,index) in this.tmndata" :key="index">
          <div class="tmnimgbox" v-on:click="openform(item,index)">
            <!--            <div>{{item.index}}</div>-->
            <img :id="forId(index)" src="../../assets/img/控制柜.png"/>
          </div>
          <div class="tmnname">{{ item.tmnName }}</div>
        </li>
      </ul>
    </div>


    <div class="form" v-show="details">
      <a name="formmao"></a>
      <button @click="test"></button>
      <span style="font:24px arial,sans-serif;color: #134d6e;font-weight: bolder">设置控制指令</span>
      <el-form style="width:600px;" ref="form" :model="form" label-width="200px">
        <el-form-item label="控制柜名称">
          <span style="font-size: 22px;color: #134d6e;">{{ this.tabletmnname }}</span>
        </el-form-item>
        <el-form-item label="工作方式选择">
          <el-select v-model="modeselected" placeholder='请选择工作方式' @change="ifinput()">
            <!--        <option disabled value="">请选择</option>-->
            <el-option v-for="(mode,i) in form.mode" :mode="mode" :key="i" :label="mode.message"
                       :value="mode.index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="modeselected==51" label="上传周期设置">
          <el-input :disabled="updatetime" v-model="form.uploadcycle"></el-input>
        </el-form-item>
        <el-form-item v-if="modeselected==11" label="阀位设置">
          <el-input :disabled="manual" v-model="form.vpre"></el-input>
        </el-form-item>

        <el-form-item v-if="ifauto()" label="开阀周期">
          <el-input :disabled="auto" v-model="form.ovperiod"></el-input>
        </el-form-item>
        <el-form-item v-if="ifauto()" label="开阀水位">
          <el-input :disabled="auto" v-model="form.ovwaterline"></el-input>
        </el-form-item>
        <el-form-item v-if="ifauto()" label="开阀保持时间">
          <el-input :disabled="auto" v-model="form.ovkeeptime"></el-input>
        </el-form-item>
        <el-form-item v-if="ifauto()" label="关阀水位">
          <el-input :disabled="auto" v-model="form.cvwaterline"></el-input>
        </el-form-item>
        <el-form-item v-if="ifauto()" label="最长阀动作时间">
          <el-input :disabled="auto" v-model="form.vactiontime"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button>取消</el-button>
          <el-button type="primary" v-on:click="submit">下发命令</el-button>
        </el-form-item>
      </el-form>
      <a name="formbotton"></a>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import tmngif from '../../assets/img/tmn_gif.gif'
import tmnimg from '../../assets/img/控制柜.png'

var terminalselect = [{}];
console.log("1", terminalselect)
export default {
  name: "Manage",
  data() {
    return {
      tmndata: [],
      tabletmnname: '',
      tabletmnid: '',
      auto:true,//工作模式开关
      manual:true,//手动模式开关
      updatetime:true,//指定上传周期开关
      tmnindexon: '',//进入时开启动画
      tmnindexoff: '',//关闭时终止动画，也就是之前开启过的tmn的index
      mao:0,//watch数据变化来在渲染后跳转锚点

      details: false,
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
        mode: [
            {message: '手动', index: '11'},
          {message: '自动方式1', index: '21'},
          {message: '自动方式2', index: '22'},
          {message: '自动方式3', index: '23'},
          {message: '指定上传周期', index: '51'}],//工作方式
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
    this.getdata()
  },
  methods: {
    //获取控制柜数据
    getdata() {
      var param = qs.stringify({UserName: this.$store.state.users.username})
      this.$axios.post('/getTerminalsByUserName', param).then(res => {
        console.log(res)
        this.tmndata = res.data;
      }).catch(failResponse => {
        alert(failResponse)
      })

    },
    //点击后打开表单
    openform(item, index) {
      location.href = "#formmao";
      this.tabletmnname = item.tmnName;
      this.tabletmnid = item.tmnId;

      this.tmnindexon = 'tmn_' + index
      if (this.tmnindexoff != this.tmnindexon) {
        if (this.tmnindexoff == '') {
          this.tmnindexoff = this.tmnindexon;
          this.details = true;
          document.getElementById(this.tmnindexon).src = tmngif;
        } else {
          if (this.details == false) {
            this.details = true;
            document.getElementById(this.tmnindexon).src = tmngif;
            this.tmnindexoff = this.tmnindexon;
          } else if (this.details == true) {

            document.getElementById(this.tmnindexon).src = tmngif;
            document.getElementById(this.tmnindexoff).src = tmnimg;
            this.tmnindexoff = this.tmnindexon;
          }
        }
      } else {
        if (this.details == false) {
          this.details = true;
          document.getElementById(this.tmnindexon).src = tmngif;
        } else if (this.details == true) {
          this.details = false;
          document.getElementById(this.tmnindexoff).src = tmnimg;
        }
      }

    },
    forId(index) {
      return "tmn_" + index
    },
    onSubmit() {
      console.log('submit!');
    },

    submit() {
      var params = qs.stringify({

        TmnID: this.tabletmnid,//控制柜名称
        W_work: this.modeselected,//工作方式选择

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
            .post('http://localhost:8443/api/order', params)
            .then(successResponse => {

              if (successResponse.data.code === 200) {
                alert("插入成功成功!");
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
    },
    ifinput(){
      if(this.modeselected==21||this.modeselected==22||this.modeselected==23){
        console.log('')
        this.auto=false;
        this.updatetime=true;
        this.manual=true;

        location.href = "#formbotton";

      }if(this.modeselected==11){
        console.log('')
        this.auto=true;
        this.updatetime=true;
        this.manual=false;
        this.mao=0
      }
      if(this.modeselected==51){
        console.log('')
        this.auto=true;
        this.updatetime=false;
        this.manual=true;
        this.mao=0
      }
    },
    ifauto(){
      if(this.modeselected==21||this.modeselected==22||this.modeselected==23)
      {this.mao=1;
      return true
      }

    },
    test(){
      console.log(this.mao)

    },
  },
  watch:{mao(){
    this.$nextTick(function (){
      location.href = "#formmao"
    })
    }

  },
}
</script>

<style>
.tips {
  display: flex;
  font-size: 28px
}

.tmnview {

}

.tmnview ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.tmnimgbox {
  display: flex;
  width: 120px;
  height: 120px;
  padding: 10px;
  margin: 50px 50px 20px 50px;
}

:hover.tmnimgbox {
  background-color: #d8dadb;
  cursor: pointer;
}

.tmnname {

}

.main {
  position: relative;
  width: 100%;
  height: 100%;
}

.form {
  background-color: #ffffff;
  padding: 32px;
  margin-bottom: 32px;
}

</style>
