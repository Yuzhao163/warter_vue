<template>
  <body id="poster" style="margin: 0px;overflow: auto">
  <img class="logo_css" alt="Vue logo" src="../assets/logo.png" />
  <router-view></router-view>
  </body>

</template>

<script>
export default {
  name: "Main"
}
</script>

<style scoped>
#poster {
  background:url("../assets/login_wallpaper.jpg") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
body{
  margin: 0px;
}
</style>
