<template>
  <div>
    <el-card v-loading="loading_cycle">
      <div slot="header" class="card-title">
        <span>各产线需求响应周期</span>
        <el-date-picker
          v-model="dt"
          :clearable="false"
          placeholder="选择日期"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 200px;float: right; padding: 3px 0; border: 0"
        />
      </div>
      <ve-histogram :data="projectResponseCycleData" :extend="extend"></ve-histogram>
    </el-card>
    <el-card class="card-margin-top" :v-show="proj_id_cycle !== ''" v-loading="loading_sprint">
      <div slot="header" class="card-title">
        <span>需求响应周期趋势</span>
        <el-select v-model="proj_id_cycle" style="width: 200px;float: right; padding: 3px 0; border: 0">
          <el-option v-for="item in projects"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </div>
      <ve-line :data="businessSprintCycleData" :extend="extend"></ve-line>
    </el-card>
    <el-card class="card-margin-top" :v-show="proj_id_bugTime !== ''" v-loading="loading_bug">
      <div slot="header" class="card-title">
        <span>线下bug平均解决/关闭时长(小时)</span>
        <el-select v-model="proj_id_bugTime" style="width: 200px;float: right; padding: 3px 0; border: 0">
          <el-option v-for="item in projects"
          :key="item.id"
          :label="item.name"
          :value="item.id"></el-option>
        </el-select>
      </div>
      <ve-line :data="bugTimeChartData" :extend="extend"></ve-line>
    </el-card>
    <el-card class="card-margin-top" :v-show="proj_id_throughput !== ''" v-loading="loading_throughput">
      <div slot="header" class="card-title">
        <span>迭代需求吞吐率</span>
        <el-select v-model="proj_id_throughput" style="width: 200px;float: right; padding: 3px 0; border: 0">
          <el-option v-for="item in projects"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </div>
      <ve-line :data="storyThroughputChartData" :extend="extend"></ve-line>
    </el-card>
  </div>

</template>

<script>
import jiraApi from "@/api/jira"

export default {
  name: "projectTolerance",
  data() {
    this.extend = {
      'xAxis.0.axisLabel.rotate': 20
    }
    this.storyThroughputChartSettings = {
      axisSite: { right: ['吞吐率'] },
      yAxisType: ['KMB', 'percent'],
      yAxisName: ['数值', '比率']
    }
    return {
      loading_cycle: false,
      loading_sprint: false,
      loading_bug: false,
      loading_throughput: false,
      proj_id_cycle: '',
      proj_id_bugTime: '',
      proj_id_throughput: '',
      dt: '',
      bugTimeChartData: {
        columns: [],
        rows: []
      },
      storyThroughputChartData: {
        columns: [],
        rows: []
      },
      businessSprintCycleData:{
        columns: [],
        rows: []
      },
      projectResponseCycleData:{
        columns: [],
        rows: []
      },
    }
  },
  watch: {
    proj_id_bugTime() {
      this.getProjSprintBugTime(this.proj_id_bugTime)
    },
    proj_id_throughput() {
      this.getProjSprintThroughput(this.proj_id_throughput)
    },
    proj_id_cycle() {
      this.getBusinessSprintCycle(this.proj_id_cycle)
    },
    dt() {
      this.getProjectCycle()
    }
  },
  computed: {
    projects() {
      return this.$store.state.jira.projects;
    },
    loading() {
      return this.$store.state.loading
    }
  },
  mounted() {
    this.proj_id_bugTime = this.$store.state.jira.projects[0].id
    this.proj_id_throughput = this.proj_id_bugTime
    this.proj_id_cycle = this.proj_id_bugTime
    this.getdatatime()
  },
  methods: {
    // getChildValue(val) {
    //   console.log('vvv', val)
    //   this.proj_id=val.projId
    //   if (val.projId) {
    //     this.getProjSprintBugTime(val.projId)
    //     this.getProjSprintThroughput(val.projId)
    //   }
    //
    // },
    getdatatime(){
      this.dt = new Date().format("yyyy-MM-dd");
    },
    getProjectCycle() {
      this.loading_cycle=true
      this.projectResponseCycleData.columns = []
      this.projectResponseCycleData.rows = []
      jiraApi.getBusinessCycleTrend({query_date: this.dt}).then(res => {
        res.data.forEach(item => {
          this.projectResponseCycleData.rows.push({
            'project': item.projectName,
            '交付周期': item.deliveryCycle,
            '开发交付周期': item.developCycle,
          })
          this.projectResponseCycleData.columns = Object.keys(this.projectResponseCycleData.rows[0])
        })
        this.loading_cycle=false
      })
    },
    getBusinessSprintCycle(val) {
      this.loading_sprint=true
      this.businessSprintCycleData.columns = []
      this.businessSprintCycleData.rows = []
      jiraApi.getBusinessSprintCycle({proj_id: val}).then(res => {
        res.data.forEach(item => {
          this.businessSprintCycleData.rows.push({
            'sprint': item.sprintName,
            '开发交付周期': item.developCycle,
            '交付周期': item.deliveryCycle,
          })
          this.businessSprintCycleData.columns = Object.keys(this.businessSprintCycleData.rows[0])
        })
        this.loading_sprint=false
      })
    },
    getProjSprintBugTime(val) {
      this.loading_bug=true
      this.bugTimeChartData.columns = []
      this.bugTimeChartData.rows = []
      jiraApi.getSprintBugFixTimeTrend({proj_id: val}).then(res => {
        res.data.forEach(item => {
          this.bugTimeChartData.rows.push({
            'sprint': item.sprintName,
            '线下bug平均解决时长': item.offlineAvgFixTime,
            '线下bug平均关闭时长': item.offlineAvgCloseTime,
          })
          this.bugTimeChartData.columns = Object.keys(this.bugTimeChartData.rows[0])
        })
        this.loading_bug=false
      })
    },
    getProjSprintThroughput(val){
      this.loading_throughput=true
      this.storyThroughputChartData.columns = []
      this.storyThroughputChartData.rows = []
      jiraApi.getStoryThroughput({proj_id: val}).then(res => {
        res.data.forEach(item => {
          this.storyThroughputChartData.rows.push({
            'sprint': item.sprintName,
            // '交付需求数': item.doneStoryCount,
            '需求数': item.totalStoryCount,
            // '吞吐率': item.throughput
          })
          this.storyThroughputChartData.columns = Object.keys(this.storyThroughputChartData.rows[0])
        })
        this.loading_throughput=false
      })
    }
  }
}
</script>

<style lang="scss">
.el-select-dropdown__item {
  font-size: 12px !important;
}
.el-scrollbar__wrap {
  overflow: auto !important;
}
</style>

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
