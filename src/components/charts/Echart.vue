<template>
  <div class="com-main">
    <div class="com-page">
      <div style="width: 50%;height:400px;">
        <rank></rank>
      </div>
      <div style="width: 50%;height:400px;">
        <gauge></gauge>
      </div>
      <div style="width: 50%;height:400px;">
        <rank></rank>
      </div>

    </div>
    <div>

    </div>
  </div>

</template>

<script>
import Rank from "@/components/charts/Rank";
import Gauge from "@/components/charts/Gauge";


export default {
  name: "Echart",
  components: { Rank,Gauge}
}
</script>

<style scoped>
.com-page {
  width: 100%;
  height: 800px;
  margin: auto;
}
.com-main{
  width: 100%;
}
</style>
