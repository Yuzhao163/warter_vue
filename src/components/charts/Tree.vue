<template>
  <div  class="com-container" style="height: 100%" >
    <div class="com-chart" ref="tree_ref" ></div>
  </div>
</template>

<script>
export default {
  name: "Tree",
  data() {
    return {

    };
  },
  mounted() {
    this.initChart();

  },
  methods:{
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.tree_ref);
      let data={
        "name": "石景山区",
        "children": [
          {"name": "A管线",
            "children": [
              {"name": "1号控制柜",
                "children": [
                  {
                    "name": "x设备"
                  }
                ],

              },{
                "name": "2号控制柜",
              }
            ]

          },
          { "name": "B管线",
            "children": [
              {"name": "3号控制柜",
                "children": [],

              },
              {"name": "4号控制柜",
                "children": [
                  {
                    "name":"y设备"
                  },
                  {
                    "name":"z设备"
                  }
                ],
              }
            ],

          }
        ]

      }
      const initOption={
        tooltip: {    //提示框组件
          trigger: 'item',    //触发类型，默认：item（数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用）。可选：'axis'：坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。'none':什么都不触发。
          triggerOn: 'mousemove'    //提示框触发的条件，默认mousemove|click（鼠标点击和移动时触发）。可选mousemove：鼠标移动时，click：鼠标点击时，none：
        },
        series: [    //系列列表
          {
            type: 'tree',    //树形结构

            data: [data],    //上面从flare.json中得到的数据

            top: '1%',       //距离上
            left: '7%',      //左
            bottom: '1%',    //下
            right: '20%',    //右的距离

            symbolSize: 15,   //标记的大小，就是那个小圆圈，默认7

            label: {         //每个节点所对应的标签的样式
              normal: {
                position: 'left',       //标签的位置
                verticalAlign: 'middle',//文字垂直对齐方式，默认自动。可选：top，middle，bottom
                align: 'right',         //文字水平对齐方式，默认自动。可选：top，center，bottom
                fontSize: 15             //标签文字大小
              }
            },

            leaves: {    //叶子节点的特殊配置，如上面的树图示例中，叶子节点和非叶子节点的标签位置不同
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              }
            },

            expandAndCollapse: true,    //子树折叠和展开的交互，默认打开
            animationDuration: 550,     //初始动画的时长，支持回调函数,默认1000
            animationDurationUpdate: 750//数据更新动画的时长，默认300
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      window.addEventListener('resize', () => {
        // 自动渲染echarts
        this.chartInstance.resize();
      })
      },

    },
  }
</script>

<style scoped>
.com-chart {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  overflow: hidden;
  border-radius: 20px;
}
</style>
