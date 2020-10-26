<template>
  <div id="app">

    <router-view/>

  </div>
</template>

<script>
//import HelloWorld from "./components/HelloWorld.vue";
// import Login from "@/components/Login";
export default {
  name: "App",
  components: {
    // Login,
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
