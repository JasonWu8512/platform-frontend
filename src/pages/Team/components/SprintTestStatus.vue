<template>
  <div>
    <common-component title="测试规划图" v-loading="loading">
      <div v-if="option.series.length === 0" style="font-size: 14px; color: #909399; text-align: center;">-->
        <span>暂无数据</span>
      </div>
      <div v-else>
        <chart :autoresize="true" :options="option" class="e-chart" v-if="inRefresh" @click="openJira"></chart>
      </div>

    </common-component>
  </div>
</template>

<script>
import {jiraApi} from "@/api";
import CommonComponent from "@/pages/track/plan/view/comonents/report/components/CommonComponent.vue"
export default {
  name: "SprintTestPlan",
  components: {CommonComponent},
  props: {
    sprintId: String,
  },
  watch: {
    sprintId() {
      this.getSprintStoryTestStatus()
    },
  },
  data() {
    return {
      loading: false,
      inRefresh: false,
      spValues: [],
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'sprints'
      },
      option:{
        legend: {
          data: [{name: '测试完成', textStyle: {color: '#72a92f', fontWeight: 'bold'}},
            {name: '测试未完成', textStyle: {color: '#E6A23C', fontWeight: 'bold'}},
            {name: '测试未开始', textStyle: {color: '#81cbf3', fontWeight: 'bold'}}]
        },
        color: ['transparent'],
        tooltip: {
          trigger: 'item',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            return params.name;
          }
        },
        xAxis: {
          type: 'category',
          data:[],
          axisLabel:{
            interval: 0,
            rotate: 30,
          }},
        yAxis: {
          type: 'value',
        },

        series: []
      }
    }
  },
  methods: {
    openJira(params) {
      window.open(params.data.key)
    },
    getSprintStoryTestStatus() {
      this.option.series = []
      this.option.xAxis.data = []
      jiraApi.getSprintStoryTestStatus({sprintId: this.sprintId}).then(res => {
        this.option.xAxis.data = res.data.dates
        this.option.series = res.data.stories.map(item => {
          return Object.assign({}, item, {"label": {
              "normal":{
                "show": true,
                "position": 'inside',
                "formatter": function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return ' ';
                  }
                }            }},
            "itemStyle":{
              "color": function () {
                if(item.name === '测试完成') {
                  return "#72a92f"
                } else if(item.name === '测试未完成') {
                  return "#E6A23C"
                } else {
                  return "#81cbf3"
                }
              },
              "barBorderColor": '#fff',
              "barBorderRadius": 2},})
        })
      }).finally(() => {
        // 强制刷新图表，清除图表显示缓存
        this.inRefresh = false;
        this.$nextTick(() => {
          this.inRefresh = true;
        });
        this.loading = false;
      });
    },
  },
}
</script>

<style scoped lang="scss">

.e-chart {
  width: 100%;
  height: 300px;
  margin: 0 auto
}
</style>
