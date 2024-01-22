<template>
  <!-- <el-drawer
    ref="drawer"
    :highlight-current="true"
    :modal-append-to-body="false"
    :visible.sync="showDialog"
    :with-header="false"
    close-on-press-escape
    size="100%"
  > -->
    <!-- <el-card class="container">
      <template slot="header" v-if="false">
        <div style="text-align: left">
          <el-button icon="el-icon-back" plain size="mini" @click="cancel">返回</el-button>
        </div>
      </template> -->
  <el-card v-if="tableData.length !== 0">
    <el-row :gutter="100" class="cast-row">
      <el-col :span="12" class="tree-col"
        v-if="tableData && tableData.length"
      >
        <el-tree
          :data="tableData"
          :default-expand-all = "true"
          :highlight-current = "true"
          icon-class="el-icon-arrow-right"
          node-key="uid"
          @node-click="openDetails"
        >
          <template slot-scope="{data}">
            <div class="case-suit-tree">
              <div class="case-suit-tree-node">
                <i :class="caseIcon(data.status)"/>
                <div style="padding-left: 5px;">{{ data.name }}</div>
              </div>
              <div v-if="data.time">{{ goodDuration(data.time.duration) }}</div>
              <div v-else >
                <allure-report-bar :show-bar="false" :show-tag="true" :statistic="getAllLeafStatus([data])"/>
              </div>
            </div>
          </template>
        </el-tree>
      </el-col>
      <el-col v-if="caseDetail" :span="12" class="tree-col">
        <div class="case-suit-full-name">
          <i class="fa fa-files-o" style="margin-right: 5px;"/>{{ caseDetail.fullName }}
        </div>
        <div class="case-suit-detail">
          <span :class="caseStatus(caseDetail.status)">{{ caseDetail.status }}</span>
          <span>{{ caseDetail.name }}</span>
        </div>

        <el-tabs v-model="activeName">
          <el-tab-pane label="Overview" name="overview">
            <div v-if="caseDetail.statusMessage">
              <el-tooltip content="Show trace" placement="left">
                <pre class="status-message" @click="isShowTrace = !isShowTrace">
                <code class="code">{{ caseDetail.fullName }}</code>
              </pre>
              </el-tooltip>
              <pre v-if="isShowTrace" class="status-trace">
                <code class="code">{{ caseDetail.statusTrace }}</code>
              </pre>
            </div>
            <el-row v-if="caseDetail.extra.tags.length !== 0">
              <span>Tags: </span>
              <span v-for="item in caseDetail.extra.tags" :key="item" class="overview-tag">
                {{ item }}
              </span>
            </el-row>
            <el-row v-if="caseDetail.extra.categories.length !== 0">
              <span>Categories: </span>
              <span>{{ caseDetail.extra.categories[0].name }}</span>
            </el-row>
            <el-row v-if="caseDetail.extra.severity">
              <span>Severity: </span>
              <span>{{ caseDetail.extra.severity }}</span>
            </el-row>
            <el-row>
              Duration: <span class="fa fa-clock-o"/> {{ goodDuration(caseDetail.time.duration) }}
            </el-row>
            <el-row v-if="caseDetail.description" class="title">Description</el-row>
            <el-row style="white-space: pre-wrap;">{{ caseDetail.description }}</el-row>
            <el-row v-if="caseDetail.parameters.length !== 0" class="title">Parameters</el-row>
            <el-row>
              <div v-for="item in caseDetail.parameters" :key="item.name">
                <span style="color: #999999">{{ item.name }}: </span>
                <span>{{ item.value }}</span>
              </div>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="History" name="history">
            <el-row v-if="caseDetail.extra.history" style="margin-top: 15px;">
              Success rate {{ historyRate }}%
              ({{ caseDetail.extra.history.statistic.passed }} of
              {{ caseDetail.extra.history.statistic.total }})
            </el-row>
            <el-row>
              <span :class="caseStatus(caseDetail.status)" style="font-size: 12px;">
                {{ caseDetail.status }}
              </span>
              <span>{{ formatTime(caseDetail.time.start, 'MM/dd/yyyy at hh:mm:ss') }}</span>
            </el-row>
            <div v-if="caseDetail.extra.history">
              <el-row v-for="item in caseDetail.extra.history.items" :key="item.uid">
                <span :class="caseStatus(item.status)" style="font-size: 12px;">
                  {{ item.status }}
                </span>
                <span>{{ formatTime(item.time.start, 'MM/dd/yyyy at hh:mm:ss') }}</span>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </el-card>
    <!-- </el-card> -->

  <!-- </el-drawer> -->
</template>

<script lang="ts">
import {autoApi} from "@/api"
import {typeTestDetail, typeTestSuitData} from "@/api/types/allureReportType"
import {formatTime, goodDuration} from "@/common/utils"
import {caseStatusEnum} from "@/constant/AllureReport"
import AllureReportBar from "@/pages/track/plan/view/comonents/report/components/AllureReportBar.vue";

export default {
  name: "AllureReportDetail",
  components: {
    AllureReportBar,
  },
  data() {
    return {
      goodDuration: goodDuration,
      formatTime: formatTime,
      showDialog: false,
      testSuit: {},
      caseDetail: undefined,
      index: 0,
      total: 0,
      parent: '',
      tableData: [],
      activeName: 'overview',
      isShowTrace: false,
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    offset() {
      return this.parent.pageSize * (this.parent.currentPage - 1)
    },
    caseIcon() {
      return function (status: caseStatusEnum) {
        if (status === caseStatusEnum.PASSED) {
          return 'fa fa-check-circle fa-fw text-status-passed fa-lg'
        } else if (status === caseStatusEnum.FAILED) {
          return 'fa fa-times-circle fa-fw text-status-failed fa-lg'
        } else if (status === caseStatusEnum.SKIPPED) {
          return 'fa fa-minus-circle fa-fw text-status-skipped fa-lg'
        } else if (status === caseStatusEnum.BROKEN) {
          return 'fa fa-exclamation-circle fa-fw text-status-broken fa-lg'
        } else if (status === caseStatusEnum.UNKNOWN) {
          return 'fa fa-question-circle fa-fw text-status-unknown fa-lg'
        } else {
          return ''
        }
      }
    },
    caseStatus() {
      return function (status: caseStatusEnum) {
        if (status === caseStatusEnum.PASSED) {
          return 'case-passed'
        } else if (status === caseStatusEnum.FAILED) {
          return 'case-failed'
        } else if (status === caseStatusEnum.SKIPPED) {
          return 'case-skipped'
        } else if (status === caseStatusEnum.BROKEN) {
          return 'case-broken'
        } else if (status === caseStatusEnum.UNKNOWN) {
          return 'case-unknown'
        } else {
          return ''
        }
      }
    },
    historyRate() {
      return (this.caseDetail.extra.history.statistic.passed / this.caseDetail.extra.history.statistic.total * 100).toFixed(2)
    },
  },
  mounted() {
    this.$eventBus.$on('allureReportDetail', (testSuit: typeTestSuitData, tableData: typeTestSuitData[], parent: any) => {
      this.parent = parent
      this.open(testSuit, tableData)
    })
  },
  methods: {
    cancel() {
      this.showDialog = false
      this.$emit('refresh')
    },
    open(testSuit: typeTestSuitData, tableData: typeTestSuitData[]) {
      this.showDialog = true
      this.testSuit = testSuit
      this.tableData = tableData
    },
    openDetails(row: typeTestSuitData) {
      if (!row.children) {
        autoApi.getAllureDetail(row.uid)
          .then((data: typeTestDetail)  => {
            this.caseDetail = data.data.detail
          })
      }
    },
    getAllLeafStatus (data:any) {
      let result = new Array()
      function getLeaf (data: any) {
        data.forEach((item: any) => {
          if (!item.children) {
            result.push(item.status)
          } else {
            getLeaf(item.children)
          }
        })
      }
      getLeaf(data)
      // @ts-ignore
      let statics = {}
      result.forEach(item => {
        if (Object.keys(statics).indexOf(item) > -1) {
          // @ts-ignore
          statics[item] += 1
        } else {
          // @ts-ignore
          statics[item] = 1
        }
      })
      return statics
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/color";
@import "src/assets/css/display";

.cast-row {
  text-align: left;
  font-size: 14px;
}

.tree-col {
  overflow-y: auto;
  overscroll-behavior: none;
  height: calc(84vh);
}

.overview-tag {
  background: #3c58e4;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 2px 4px 2px 5px;
  font-size: 12px;
  margin-right: 5px;
}

::v-deep .rtl {
  overflow: hidden;
}

.status-trace {
  background-color: #ffe7e6;
  color: #000000;
  padding: 10px 20px;
  white-space: pre-wrap;
  border-top: 1px solid #FFFFFF;

}

.status-message {
  @extend %flex-left-center-row;
  @extend .status-trace;
  height: 66px;
  cursor: pointer;
}

.code {
  font-family: monospace, serif;
  font-size: 1em;
}

.status-button {
  padding-left: 4%;
}

.head-right {
  text-align: right;
}

::v-deep .el-tree-node__content {
  height: 32px;
  margin: 3px 0;
}

::v-deep .el-tabs__content {
  margin-top: -15px;
}

.el-tab-pane {
  .el-row {
    margin: 15px 0;
    padding: 0 15px;
  }

  .title {
    font-size: 1.17em;
    font-weight: bold;
  }
}

.status-button {
  float: right;
}

.container {
  height: calc(97vh);
  margin: 15px;
}

.case-suit-tree {
  @extend %flex-between-center-row;
  width: 100%;
  padding-right: 10px;
}

.case-suit-tree-node {
  @extend %flex-between-center-row;
  white-space: pre-wrap;
}

.case-suit-full-name {
  @extend %flex-left-center-row;
  color: #999999;
  font-size: 18px;
  font-weight: 500;
  text-overflow: ellipsis;
  overflow: hidden;
}

.case-suit-detail {
  @extend %flex-left-center-row;
  font-size: 24px;
  font-weight: 700;
}

.case-status {
  color: white;
  border: none;
  border-radius: 3px;
  padding: 2px 4px 2px 5px;
  height: 28px;
  font-size: 19px;
  margin-right: 10px;
}

.text-status-failed {
  color: $color-status-failed;
}

.text-status-broken {
  color: $color-status-broken;
}

.text-status-passed {
  color: $color-status-passed;
}

.text-status-skipped {
  color: $color-status-skipped;
}

.text-status-unknown {
  color: $color-status-unknown;
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
</style>
