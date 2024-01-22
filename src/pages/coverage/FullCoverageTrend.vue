<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-select v-model="projId" filterable style="width: 100%;padding-right: 5px" @change="getFullCoverageTrend">
            <el-option v-for="item in pipelineOptions"
                       :key="item.projectId"
                       :value="item.projectId"
                       :label="item.name"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input v-model="commitId" placeholder="选填commitId" style="width: 100%;padding-right: 5px"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" round icon="el-icon-search" @click="getFullCoverageTrend"  style="float: left">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-loading="loading" style="margin-top: 15px">
      <chart  :autoresize="true" :options="option" class="e-chart" v-if="inRefresh"></chart>
    </el-card>
  </div>

</template>

<script>
import {coverageApi} from "@/api";
export default {
  name: "FullCoverageTrend",
  data() {
    return {
      inRefresh: false,
      projId: '',
      commitId: '',
      pipelineOptions: [],
      option: {
        xAxis: {
          type: 'category',
          data:[],
          axisLabel:{
            interval: 0,
            rotate: 25,
          }},
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return params.name;
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: []
      }
      }
    },
  computed: {
    loading() {
      return this.$store.state.loading
    },
  },
  created() {
    this.getAllPipelines()
  },
  methods: {
    getFullCoverageTrend() {
      this.option.series = []
      const params = {
        projId: this.projId,
        commitId: this.commitId
      }
      coverageApi.getFullCoverageReportTrend(params).then(res => {
        this.option.xAxis.data = res.data.xAxis
        this.option.series.push({type: 'line', data: res.data.series, label: {
            show: true,
            position: 'top',
            formatter: '{c}%'
          },})
      }).finally(() => {
        // 强制刷新图表，清除图表显示缓存
        this.inRefresh = false;
        this.$nextTick(() => {
          this.inRefresh = true;
        });
      });
    },
    getAllPipelines() {
      coverageApi.getPipelineList({offset: 0, limit: 1000}).then(res => {
        this.projId = res.data.data[0]['projectId']
        this.getFullCoverageTrend()
        this.pipelineOptions = res.data.data.map(item => {
          return {
            projectId: item.projectId,
            name: item.name,
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.e-chart {
  width: 100%;
  height: 500px;
  margin: 0 auto
}

</style>
