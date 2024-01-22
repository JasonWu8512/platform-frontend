<template>
  <div>
    <el-card class="card-margin-top">
      <div slot="header" class="card-title">
        <span>线下bug平均解决时长(小时)</span>
      </div>
      <ve-line :data="offlineBugFixData" :settings="chartSettings" v-loading="loading"></ve-line>
    </el-card>
    <el-card class="card-margin-top">
      <div slot="header" class="card-title">
        <span>线下bug平均关闭时长(小时)</span>
      </div>
      <ve-histogram :data="offlineBugCloseData" v-loading="loading"></ve-histogram>
<!--      <ve-line :data="offlineBugCloseData" :settings="chartSettings" v-loading="loading"></ve-line>-->
    </el-card>
<!--    <el-card class="card-margin-top">-->
<!--      <div slot="header" class="card-title">-->
<!--        <span>线上bug平均解决时长(小时)</span>-->
<!--      </div>-->
<!--      <ve-histogram :data="onlineBugFixData" :settings="chartSettings" v-loading="loading"></ve-histogram>-->
<!--    </el-card>-->
<!--    <el-card class="card-margin-top">-->
<!--      <div slot="header" class="card-title">-->
<!--        <span>线上bug平均关闭时长(小时)</span>-->
<!--      </div>-->
<!--      <ve-line :data="onlineBugCloseData" :settings="chartSettings" v-loading="loading"></ve-line>-->
<!--    </el-card>-->
  </div>

</template>

<script>
import jiraApi from '@/api/jira'
export default {
  name: "bugFixTime",
  props: {
    month: {type: String},
  },
  data() {
    this.chartSettings = {
      // stack: { '用户': ['访问用户', '下单用户'] },
      area: true
    }
    return {
      loading: false,
      options: {
        title: {
          text: 'bug率月度趋势'
        }
      },
      chartColumns: [],
      offlineBugFixData: {rows: []},
      offlineBugCloseData: {rows: []},
      onlineBugFixData: {rows: []},
      onlineBugCloseData: {rows: []},
      // chartSettings: {
      //   // stack: { '用户': ['访问用户', '下单用户'] },
      //   area: true
      // }
    }
  },
  watch: {
    month() {
      this.getBugTime()
    }
  },
  mounted() {
    // this.getBugTime()
  },
  methods: {
    getBugTime() {
      this.chartColumns = []
      this.offlineBugFixData = {rows: []}
      this.offlineBugCloseData = {rows: []}
      this.onlineBugFixData = {rows: []}
      this.onlineBugCloseData = {rows: []}
      this.loading = true
      jiraApi.getMonthBugFixTimeTrend({month: this.month}).then(res => {
        this.chartColumns.push('month')
        res.data.forEach(item => {
          let offlineFix = {}
          let offlineClose = {}
          let onlineFix = {}
          let onlineClose = {}
          offlineFix.month = Object.keys(item)[0];
          offlineClose.month = offlineFix.month
          onlineFix.month = offlineFix.month
          onlineClose.month = offlineFix.month
          item[offlineFix.month].forEach(item2 => {
            if (this.chartColumns.indexOf(item2['projName']) < 0){
              // console.log('boole', item2['projName'].indexOf(this.chartData.columns))
              this.chartColumns.push(item2['projName'])
            }
            offlineFix[item2['projName']] = item2['offlineAvgFixTime']
            offlineClose[item2['projName']] = item2['offlineAvgCloseTime']
            onlineFix[item2['projName']] = item2['onlineAvgFixTime']
            onlineClose[item2['projName']] = item2['onlineAvgCloseTime']
          });
          this.offlineBugFixData.rows.push(offlineFix)
          this.offlineBugCloseData.rows.push(offlineClose)
          this.onlineBugFixData.rows.push(onlineFix)
          this.onlineBugCloseData.rows.push(onlineClose)
        })
        this.offlineBugFixData.columns = this.chartColumns
        this.offlineBugCloseData.columns = this.chartColumns
        this.onlineBugFixData.columns = this.chartColumns
        this.onlineBugCloseData.columns = this.chartColumns
        this.chartSettings.stack = { '业务线': this.chartColumns };
        this.loading = false
      })
    }
  },
}
</script>

<style scoped lang="scss">
.card-title {
  font-size: 16px;
  font-weight: 700;
  text-align: left;
}
.card-margin-top {
  margin-top: 20px;
}

</style>
