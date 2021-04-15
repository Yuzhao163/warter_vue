<template>
  <div class="tmnview">
    <ul style="list-style: none">
      <li v-for="item in this.tmndata" :key="item"><img src="../../assets/logo.png"/>
        <div class="tmnname">{{item.tmnName}}</div></li>
    </ul>

  </div>
</template>

<script>
 import qs from "qs";
// import tmn from '../../assets/img/logo.png'
export default {
  mounted() {
  },
  name: "Fault_diagnosis",
  data() {
    return {
      tmndata:[{tmnName:'一号柜'},{tmnName:'二号柜'},{tmnName:'三号柜'},{tmnName:'三号柜'},
        {tmnName:'三号柜'},{tmnName:'三号柜'},{tmnName:'三号柜'},{tmnName:'三号柜'},{tmnName:'三号柜'},{tmnName:'三号柜'}],
    }
  },
  methods: {
    getdata(){
      var param=qs.stringify(this.$store.state.users.username)
  this.$axios.post('/请求tmn数据',param).then(res=>{
  this.tmndata=res;
}) .catch(failResponse => {
  alert(failResponse)
})

    },
  }
}
</script>

<style scoped>
.tmnview{

}
.tmnview ul{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
