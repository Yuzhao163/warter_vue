<template>
<div class="com-page">
  <div style="width: 600px;height:400px;">
    <rank></rank>
  </div>
  <div style="width: 600px;height:400px;">
    <tree></tree>
  </div>
  <div style="width: 600px;height:400px;">
    <rank></rank>
  </div>
  <div style="width: 600px;height:400px;">
    <rank></rank>
  </div>
  <div style="width: 600px;height:400px;">
    <rank></rank>
  </div>
</div>
</template>

<script>
import Rank from "@/components/charts/Rank";
import Tree from "@/components/charts/Tree";
export default {
  name: "Echart",
  components: {Rank,Tree}
}
</script>

<style lang="less" scoped>

</style>
