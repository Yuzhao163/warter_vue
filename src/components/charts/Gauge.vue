<template>
    <div class="com-container">
        <div class="com-chart" ref="rank_ref"></div>
    </div>
</template>

<script>
var a=0;
    export default {
        name: "",
        data(){
            return{
                timer: null, //定时器
            }
        },
        mounted() {
            this.getdata();
            this.timer = setInterval(() => {
                setTimeout(this.getdata, 0);
            }, 1000*60);

        },
        methods:{
            getdata() {
                this.$axios
                    .get('/detail',{
                        params: {'Id':"1"}
                })
                    .then(successResponse => {
                        //获取json中的data部分
                        // var jsonObj = JSON.parse(successResponse.data);
                        console.log(successResponse.data)
                        // console.log(successResponse.data[0].v_per)
                        a=parseInt(successResponse.data[0].v_per)
                        this.initChart();
                    })
            },
            initChart() {
                this.chartInstance = this.$echarts.init(this.$refs.rank_ref);
               var option = {
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c}%'
                    },
                    toolbox: {
                        feature: {
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    series: [
                        {
                            name: '业务指标',
                            type: 'gauge',
                            detail: {formatter: '{value}%'},
                            data: [{value: a, name: '完成率'}]
                        }
                    ]
                };
                this.chartInstance.setOption(option, true);
                // this.chartInstance.setInterval({
                //     option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
                //     this.chartInstanc.setOption(option, true);
                // },2000);
            },
        },
        beforeDestroy() {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
</script>

<style scoped>

</style>
