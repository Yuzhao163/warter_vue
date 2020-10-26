<template>
  <div class="com-container">
    <div style="width: 600px;height:600px;" class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
var TP_name = "温度";
var TP_value = 0; //值

export default {

  name: "Temperature",
  data(){
    return{
      timer:null
    }
  },
  mounted() {
    this.gettemp();
    this.timer = setInterval(() => {
      setTimeout(this.gettemp, 0);
    }, 1000);
  },
  methods: {
    gettemp() {
      this.$axios
          .get('/temp')
          .then(successResponse => {
            //获取json中的data部分
            // var jsonObj = JSON.parse(successResponse.data);
            console.log(successResponse.data)

            console.log(successResponse.data.Rec_Detail[1])
            console.log(successResponse.data.Rec_Detail[1].e_temp)
            TP_value = parseInt(successResponse.data.Rec_Detail[1].e_temp);
            console.log(TP_value)
            this.initChart();
          })
    },
    initChart() {


      // =========================================================

      this.chartInstance = this.$echarts.init(this.$refs.rank_ref);
      /*****设置*****/

      var min = 0; //最小刻度
      var max = 150; //最大刻度
      var offset = 50; //负数设置
      var step = max / 5; //步长
      var range = [0, 200, 500] //范围[高,中,低]
      var unit = '°C'; //单位

      /**************/
      var scale = step / 20; //比例
      var kd = [];
      var Gradient = [];
// var leftColor = '';
      var showValue = '';
      var len = max + (scale * 15); //刻度+15
// var TP_txt = '';
// 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
      for (var i = 0; i <= len; i++) {
        if (i < (min + (scale * 10)) || i > (max + (scale * 10))) {
          kd.push('')
        } else {
          if ((i - (scale * 10)) % step === 0) {
            kd.push('-3');
          } else if ((i - (scale * 10)) % (step / 5) === 0) {
            kd.push('-1');
          } else {
            kd.push('');
          }
        }

      }
      //中间线的渐变色和文本内容
      if (TP_value > range[2]) {
        Gradient.push({
          offset: 0,
          color: '#93FE94'
        }, {
          offset: 0.5,
          color: '#E4D225'
        }, {
          offset: 1,
          color: '#E01F28'
        })
      } else if (TP_value > range[1]) {
        Gradient.push({
          offset: 0,
          color: '#93FE94'
        }, {
          offset: 1,
          color: '#E4D225'
        })
      } else {
        Gradient.push({
          offset: 1,
          color: '#93FE94'
        })
      }
      if (TP_value > (max - offset + (scale * 2))) {
        showValue = max - offset + (scale * 2);
      } else if (TP_value < min - offset) {
        showValue = min - offset;
      } else {
        showValue = TP_value
      }

      offset = offset + (scale * 10); //负数设置+10
      // leftColor = Gradient[Gradient.length - 1].color;
      // 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
      var option = {
        backgroundColor: '#ffffff',
        grid: {
          top: '10%',
          bottom: '15%',
        },
        yAxis: [{
          show: false,
          data: [],
          min: 0,
          max: len,
          axisLine: {
            show: false
          }
        }, {
          show: false,
          min: 0,
          max: 50,
        }],
        xAxis: [{
          show: true,
          min: -10,
          max: 80,
          axisTick: 'none',
          axisLine: 'none',
          offset: 40,
          axisLabel: {
            textStyle: {
              color: '#0C2E6D',
              fontSize: '24',
            },
          },
          data: [TP_name],
        }, {
          show: true,
          min: -10,
          max: 80,
          axisTick: 'none',
          axisLine: 'none',
          offset: 0,
          axisLabel: {
            textStyle: {
              color: '#66b1fd',
              fontSize: '24',
            },
          },
          data: [TP_value + unit],
          z: 9,
        }, {
          show: false,
          min: -10,
          max: 80,
          data: []
        }, {
          show: false,
          min: -5,
          max: 80,

        }],
        series: [{
          name: '条',
          type: 'bar',
          // 对应上面XAxis的第一个对)象配置
          xAxisIndex: 0,
          data: [{
            value: (showValue + offset),
          }],
          barWidth: 18,
          itemStyle: {
            normal: {
              // color: '#93FE94',
              color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient),
            }
          },
          z: 2
        }, {
          name: '白框',
          type: 'bar',
          xAxisIndex: 1,
          barGap: '-100%',
          data: [len - scale],
          barWidth: 28,
          itemStyle: {
            normal: {
              color: '#0C2E6D',
              barBorderRadius: 50,
            }
          },
          z: 1
        }, {
          name: '外框',
          type: 'bar',
          xAxisIndex: 2,
          barGap: '-100%',
          data: [len],
          barWidth: 38,
          itemStyle: {
            normal: {
              color: '#4577BA',
              barBorderRadius: 50,
            }
          },
          z: 0
        }, {
          name: '圆',
          type: 'scatter',
          hoverAnimation: false,
          data: [0],
          xAxisIndex: 0,
          symbolSize: 48,
          itemStyle: {
            normal: {
              color: '#93FE94',
              opacity: 1,
            }
          },
          z: 2
        }, {
          name: '白圆',
          type: 'scatter',
          hoverAnimation: false,
          data: [0],
          xAxisIndex: 1,
          symbolSize: 60,
          itemStyle: {
            normal: {
              color: '#0C2E6D',
              opacity: 1,
            }
          },
          z: 1
        }, {
          name: '外圆',
          type: 'scatter',
          hoverAnimation: false,
          data: [0],
          xAxisIndex: 2,
          symbolSize: 70,
          itemStyle: {
            normal: {
              color: '#4577BA',
              opacity: 1,
            }
          },
          z: 0
        }, {
          name: '刻度',
          type: 'bar',
          yAxisIndex: 0,
          xAxisIndex: 3,
          label: {
            normal: {
              show: true,
              position: 'left',
              distance: 10,
              color: '#000000',
              fontSize: 14,
              formatter: function (params) {
                if (params.dataIndex > (max + (scale * 10)) || params.dataIndex < (min + (scale * 10))) {
                  return '';
                } else {
                  if ((params.dataIndex - (scale * 10)) % step === 0) {
                    return params.dataIndex - offset;
                  } else {
                    return '';
                  }
                }
              }
            }
          },
          barGap: '-100%',
          data: kd,
          barWidth: 1,
          itemStyle: {
            normal: {
              color: 'white',
              barBorderRadius: 120,
            }
          },
          z: 0
        }]
      }

      this.chartInstance.setOption(option)
    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    },
  }
}
</script>

<style scoped>

</style>
