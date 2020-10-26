<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  name: "Rankt",
  data() {
    return {
      chartInstance: null,
      allData: null,
    };
  },
  mounted() {
    this.initChart();
    this.getData();
  },
  methods: {
    //初始化图表
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, "dark");
      //图表初始配置
      const initOption = {
        title: {
          text: "各省热度排行",
          top: "3%",
          left: "3%",
        },
        grid: {
          top: "20%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
          splitLine: {
            //网格线
            show: false,
          },
        },
        series: [
          {
            type: "bar",
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    getData() {
      this.allData = [
        { name: "山东", value: 84737 },
        { name: "贵州", value: 20808 },
        { name: "江西", value: 31883 },
        { name: "重庆", value: 26070 },
        { name: "内蒙古", value: 16308 },
        { name: "湖北", value: 43956 },
        { name: "辽宁", value: 41150 },
        { name: "湖南", value: 44386 },
        { name: "福建", value: 51290 },
        { name: "上海", value: 58547 },
        { name: "北京", value: 75911 },
        { name: "广西", value: 28682 },
        { name: "广东", value: 204698 },
        { name: "四川", value: 61059 },
        { name: "云南", value: 27707 },
        { name: "江苏", value: 109264 },
        { name: "浙江", value: 115958 },
        { name: "青海", value: 3423 },
        { name: "宁夏", value: 4742 },
        { name: "河北", value: 41415 },
        { name: "黑龙江", value: 26215 },
        { name: "吉林", value: 20592 },
        { name: "天津", value: 19235 },
        { name: "陕西", value: 32019 },
        { name: "甘肃", value: 13294 },
        { name: "新疆", value: 10461 },
        { name: "河南", value: 54371 },
        { name: "安徽", value: 41701 },
        { name: "山西", value: 24752 },
        { name: "海南", value: 9279 },
        { name: "台湾", value: 587 },
        { name: "西藏", value: 1790 },
        { name: "香港", value: 1655 },
        { name: "澳门", value: 1014 },
      ];
      //排序
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      //更新图表
      this.updateChart();
    },
    updateChart() {
      //横坐标数据(省份)
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      //纵坐标数据(数值)
      const valueArr = this.allData.map((item) => {
        return item.value;
      });

      //更新数据
      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        series: [
          {
            data: valueArr,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
  },
};
</script>

<style lang="less" scoped></style>
