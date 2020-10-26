<template>
  <div  class="com-container" >
    <div style="width: 600px;height:400px;" class="com-chart" ref="rank_ref" ></div>
  </div>
</template>

<script>
export default {
  name: "Rank",
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      let myChart = this.$echarts.init(this.$refs.rank_ref);

      var option = {
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      };
      myChart.setOption(option);
    }
  }
}

</script>

<style lang="less" scoped>

</style>
