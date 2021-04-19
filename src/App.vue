<template>
  <div id="app">

    <router-view/>

  </div>
</template>

<script>
//import HelloWorld from "./components/HelloWorld.vue";
// import Login from "@/components/Login";
import qs from "qs";

export default {
  name: "App",
  components: {
    // Login,
  },
  data(){
    return{
      tree:[],//测试用
      treearea:[],
    }
  },
  methods:{
    async getTreeData(){
      await this.$axios.post("/getAreas").then(res => {
        this.treearea = res.data;
      })
          .catch(failResponse => {
            console.log(failResponse)
            alert(failResponse)
          });
      for( var i=0;i<this.treearea.length;i++)
      {
        var a=this.treearea[i].areaName;
        var param = qs.stringify({AreaName: this.treearea[i].areaName})
        await this.$axios.post("/getPipes", param).then(res => {
          var list= {};

          // list.push({value: param,
          //   label: param,
          //   children:res.data[0]},
          // )
          list.value= a,
              list.label= a,
              list.children=res.data

          this.tree.push(list)

        });
        for(var j=0;j<this.tree[i].children.length;j++)
        {
          var b =this.tree[i].children[j].pipID
          var para = qs.stringify({
            PipID: this.tree[i].children[j].pipID
          })
          await this.$axios.post("/getTerminals", para).then(res => {

            var list= {};
            list.value=b;
            list.label=b;
            list.children=res.data;
            this.tree[i].children[j]=list

          })
          for(var k=0;k<this.tree[i].children[j].children.length;k++)
          {
            // console.log(this.tree[i].children[j].children[k])
            var list={};
            list.value=this.tree[i].children[j].children[k];
            list.label=this.tree[i].children[j].children[k];
            this.tree[i].children[j].children[k]=list;
          }
        };

      }
      this.$store.state.tree= this.tree;
    },
  },
  created() {
    this.$store.state.users.username=window.localStorage.getItem('ms_username');
    this.getTreeData();
  }
};
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  height: 100%;

}
</style>
