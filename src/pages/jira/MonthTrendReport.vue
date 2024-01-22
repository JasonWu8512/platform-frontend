<template>
<!--  <el-card>-->
    <ve-line :data="chartData" :settings="chartSettings" :extend="extend" v-loading="loading"></ve-line>
<!--  </el-card>-->
</template>

<script>
import jiraApi from '@/api/jira'
export default {
name: "MonthTrendReport",
  data() {
    this.chartSettings = {
      // stack: { '用户': ['访问用户', '下单用户'] },
      area: true
    }
  return {
      loading: false,
      extend: {
        tooltip: {
          formatter: function (params) { // 提示内容太多隔行显示内容
            let astr = ''
            params.forEach((ele, index) => {
              astr += `
                  <div style="display: block;height:20px;${index % 2 === 0 ? 'width: 50%;' : 'width: 38%;'}float:left;">
                      <i style="width: 10px;height: 10px;display: inline-block;background: ${ele.color};border-radius: 10px;"></i>
                      <span>${ele.seriesName}: ${ele.data}</span>
                  </div>
              `
            })
            const b = '<div style="width: 500px;">' + astr + '<div>'
            return b
          },
          position: function (point) {
            return [point[1], 0]
          },
        }
      },
      options: {
        title: {
          text: 'bug率月度趋势'
        }
      },
    chartData: {
      columns:[],
      rows: []
    },
    // chartSettings: {
    //   // stack: { '用户': ['访问用户', '下单用户'] },
    //   area: true
    // }
  }
  },
  props: {
    month: {type: String}
  },
  watch: {
    month() {
      this.getMonthTrend();

    }
  },
  methods: {
    getMonthTrend(){
      this.chartData.columns = []
      this.chartData.rows = []
      this.loading = true
      jiraApi.getMonthTrendReport({month: this.month}).then(res => {
        this.chartData.columns.push('month')
        res.data.forEach(item => {
          let row = {}
          row.month = Object.keys(item)[0];

          item[row.month].forEach(item2 => {
            if (this.chartData.columns.indexOf(item2['projName']) < 0){
              // console.log('boole', item2['projName'].indexOf(this.chartData.columns))
              this.chartData.columns.push(item2['projName'])
            }
            row[item2['projName']] = item2['offlineBugRate'] ? item2['offlineBugRate'] : 0
          });
          this.chartData.rows.push(row)
        })
        this.chartSettings.stack = { '业务线': this.chartData.columns };
        this.loading = false

      })
    }
  }
}
</script>

<style scoped>

</style>
