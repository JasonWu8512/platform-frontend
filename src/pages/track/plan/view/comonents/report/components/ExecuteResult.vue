<template>

  <common-component title="测试结果统计">

    <template>

      <my-pie-chart
        v-if="isShow"
        text=" "
        name="测试结果"
        :data="chartData"
        :radius="radius"
        height="400px"
        width="500px"/>

    </template>

  </common-component>

</template>

<script>
import myPieChart from "@/common/components/myPieChart";
import CommonComponent from "./CommonComponent";

export default {
  name: "TestResultChartComponent",
  components: {myPieChart, CommonComponent},
  data() {
    return {
      dataMap: new Map([
        ["pass", {name: '通过', itemStyle: {color: '#67C23A'}}],
        ["fail", {name: '失败', itemStyle: {color: '#F56C6C'}}],
        ["block", {name: '阻塞', itemStyle: {color: '#E6A23C'}}],
        ["skip", {name: '跳过', itemStyle: {color: '#909399'}}],
        ["init", {name: '未执行', itemStyle: {color: '#DEDE10'}}]
      ]),
      isShow: true,
      radius: ['40%', '70%']
    }
  },
  props: {
    data: {
      type: Object,
    }
  },
  computed: {
    chartData() {
      return this.getChartData()
    }
  },
  // created() {
  //   this.getChartData();
  // },
  methods: {
    getChartData() {
      var chartData = []
      Object.keys(this.data).forEach(item => {
        let data = this.dataMap.get(item);
        data.value = this.data[item]
        chartData.push(data)
      });
      this.reload();
      return chartData


    },
    reload() {
      this.isShow = false;
      this.$nextTick(function () {
        this.isShow = true;
      })
    }
  }
}
</script>

<style scoped>

</style>
