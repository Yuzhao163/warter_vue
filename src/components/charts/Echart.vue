<template>
  <div>
    <div class="com-page">
      <div style="width: 600px;height:400px;">
        <rank></rank>
      </div>
      <div style="width: 600px;height:400px;">
        <gauge></gauge>
      </div>
      <div style="width: 600px;height:600px;">
        <temperature></temperature>
      </div>
      <div style="width: 600px;height:400px;">
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

import Temperature from "@/components/charts/Temperature";
export default {
  name: "Echart",
  components: {Temperature, Rank,Gauge}
}
</script>

<style scoped>
.com-page {
  width: 100%;
  height: 800px;
  margin: auto;

  display: flex;
}
</style>
