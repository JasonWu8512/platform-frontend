<template>
  <div>
    <common-component v-show="showSummary && historyId" title="Allure Report">
      <!--构建整体统计数据  -->
      <div class="allure-title">
        <div class="allure-title-inline">
          <div style="width: 50%">
            <div style="font-size: 1.5em;">ALLURE REPORT {{ allureNowDate }}</div>
            <div style="color: #a09a8e;">{{ allureStart }} - {{ allureStop }} ({{ allureDuration }})</div>
            <div style="padding: 28px 0; margin: auto;">
              <div class="case-total">{{ allureTotalCase }}</div>
              <div style="text-align: center; color: #a09a8e;">test cases</div>
            </div>
          </div>
          <div style="width: 50%; overflow: hidden;">
            <div id="chartPie" :options="orgOptions" style="height: 400px; width: 600px"/>
          </div>
        </div>
      </div>
    </common-component>
    <common-component v-show="showTestSuites && historyId">
      <template slot="header">
        <!--suit总数-->
        <div style="display: flex; justify-content: space-between; background: #fff;">
          <div style="display: flex; align-items: flex-end;">
            <div style="margin-right: 5px;">Test Suites</div>
            <span style="color: #a09a8e;">{{ allureTotalCase }} items total</span>
          </div>
          <div style="display: flex; align-items: center;">
            <el-tag class="case-failed">{{ allureStatistic.failed }}</el-tag>
            <el-tag class="case-broken">{{ allureStatistic.broken }}</el-tag>
            <el-tag class="case-passed">{{ allureStatistic.passed }}</el-tag>
            <el-tag class="case-skipped">{{ allureStatistic.skipped }}</el-tag>
            <el-tag class="case-unknown">{{ allureStatistic.unknown }}</el-tag>
          </div>
        </div>
      </template>
      <div style="margin: -20px">
        <el-row v-for="(item, index) in suitCaseGroups" :key="index">
          <div class="test-suit">
            <el-col :span="12" class="test-suit-name">{{ item.name }}</el-col>
            <el-col :span="12">
              <allure-report-bar :statistic="item.statistic"/>
            </el-col>
          </div>
        </el-row>
        <!-- <el-row class="test-suit-show-all">
          <div @click="getSuitCaseDetail()">Show all</div>
        </el-row> -->
      </div>
    </common-component>
    <common-component>
      <template slot="header">
        <div style="display: flex; justify-content: space-between; background: #fff;">
            <div style="display: flex; align-items: flex-end;">
              <div style="margin-right: 5px;">Report Detail</div>
            </div>
        </div>
      </template>
      <div style="margin: -20px">
        <el-row class="test-suit-show-all">
          <div @click="getSuitCaseDetail()">Show all</div>
        </el-row>
      </div>
    </common-component>

    <allure-report-detail ref="allureReportDetail"/>
  </div>

</template>

<script>
import {autoApi} from "@/api"
import {formatTime, goodDuration} from "@/common/utils"
import AllureReportBar from "@/pages/track/plan/view/comonents/report/components/AllureReportBar"
import AllureReportDetail from "@/pages/track/plan/view/comonents/report/components/AllureReportDetail"
import * as echarts from 'echarts'
import CommonComponent from "./CommonComponent"


export default {
  name: "AllureReport",
  components: {AllureReportDetail, AllureReportBar, CommonComponent},
  props: {
    historyId: {
      type: String,
      default: '',
    },
    showSummary: {
      type: Boolean,
      default: true
    },
    showTestSuites: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      // Allure title
      allureNowDate: '',
      allureStart: '',
      allureStop: '',
      allureDuration: '',
      allureStatistic: {},
      allureTotalCase: '',
      allureSuccessRate: 0,

      // suites
      suitCaseGroups: [],
      suitCaseDetails: [],
      orgOptions: {},
    }
  },
  created() {
    this.getSummary()
  },
  watch: {
    historyId() {
      this.getSummary()
    }
  },
  methods: {
    initCharPie() {
      let chartDom = document.getElementById('chartPie') 
      let myChart = echarts.init(chartDom)

      this.orgOptions = {
        tooltip: {
          trigger: 'item',
          formatter: "{c} tests ({d}%)<br/>{b}"
        },
        graphic: {
          type: 'text',
          left: '25%',
          top: '27%',
          // z: 2,
          // zlevel: 100,
          style: {
            text: this.allureSuccessRate + '%',
            fontSize: 25
          }
        },
        series: [
          {
            type: 'pie',
            center: ['30%', '30%'],
            radius: ['35%', '45%'],
            avoidLabelOverlap: false, 
            hoverAnimation: true, 
            startAngle: 90,
            label: {
              normal: {
                show: true,
              },
            },
            data: [
              {value: this.allureStatistic.failed, name: 'Failed', itemStyle: {color: '#fd5a3e'}},
              {value: this.allureStatistic.broken, name: 'Broken', itemStyle: {color: '#ffd050'}},
              {value: this.allureStatistic.passed, name: 'Passed', itemStyle: {color: '#97cc64'}},
              {value: this.allureStatistic.skipped, name: 'Skipped', itemStyle: {color: '#aaa'}},
              {value: this.allureStatistic.unknown, name: 'Unknown', itemStyle: {color: '#d35ebe'}}
            ]
          }
        ]
      };
      myChart.setOption(this.orgOptions);
    },
    getSummary() {
      // 获取用例执行一些信息
      if (this.historyId) {
        autoApi.getAllureReport(this.historyId)
          .then((data) => {
            // eslint-disable-next-line
            this.allureDuration = goodDuration(data.summary.time.duration)
            this.allureStart = formatTime(data.summary.time.start, 'hh:mm:ss')
            this.allureStop = formatTime(data.summary.time.stop, 'hh:mm:ss')
            this.allureNowDate = formatTime(data.summary.time.start, 'MM/dd/yyyy')
            this.allureStatistic = data.summary.statistic
            this.allureTotalCase = this.allureStatistic.total
            this.suitCaseGroups = data.summary.suites.items
            this.suitCaseDetails = data.suites.children
            this.allureSuccessRate = Math.floor(this.allureStatistic.passed / this.allureStatistic.total * 10000) / 100
            this.initCharPie()
          })
      }
    },
    getSuitCaseDetail(testSuit) {
      this.$eventBus.$emit("allureReportDetail", testSuit, this.suitCaseDetails, this)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/color";
@import "src/assets/css/display";

.allure-title {
  padding: 15px 15px 0;
  margin-bottom: 15px;
  background: #fff;
  max-height: 250px
}

.allure-title-inline {
  outline: 2px;
  display: flex;
  justify-content: space-between;
}

.case-total {
  font-size: 49px;
  text-align: center;
  color: #0097a7
}

.case-status {
  color: white;
  border: none;
  border-radius: 3px;
  margin: 0 3px;
}

.case-failed {
  @extend .case-status;
  background-color: $color-status-failed;
}

.case-broken {
  @extend .case-status;
  background-color: $color-status-broken;
}

.case-passed {
  @extend .case-status;
  background-color: $color-status-passed;
}

.case-skipped {
  @extend .case-status;
  background-color: $color-status-skipped;
}

.case-unknown {
  @extend .case-status;
  background-color: $color-status-unknown;
}

.test-suit {
  height: 40px;
  font-size: 14px;
  padding: 0 20px;
  border-bottom: 1px solid #eceff1;
  // cursor: pointer;
  @extend %flex-left-center-row;
}

.test-suit-name {
  @extend %flex-left-center-row;
}

.test-suit-show-all {
  height: 40px;
  font-size: 16px;
  cursor: pointer;
  @extend %flex-center-row;
}
</style>
