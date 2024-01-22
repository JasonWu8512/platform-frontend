<template>
  <div>
    <el-card class="card-content">
      <template slot="header">
        <table-header
          :condition="condition"
          :show-create="false"
          :show-run="true"
          run-tip="开始评审"
          @runTest="handleReviewRun"
          @search="handleSearch"
        >
          <template slot="title">
            <div>全部用例</div>
          </template>
        </table-header>

      </template>
      <el-table
        ref="table"
        v-loading="loading"
        :data="tableData"
        class="test-content adjust-table"
        row-key="id"
        @select="handleSelectionChange"
        @filter-change="filter"
        @select-all="handleSelectAll"
        @row-click="handleReviewRun"
      >

        <!--  复选框  -->
        <el-table-column type="selection"/>

        <!--  复选按钮 -->
        <el-table-column :resizable="false" align="center" width="40">
          <template slot-scope="scope">
            <show-more-btn
              :buttons="buttons"
              :is-disabled="scope.row.isDisabled"
              :size="selectRows.size"
            />
          </template>
        </el-table-column>

        <!--  名称  -->
        <el-table-column label="名称" prop="name" show-overflow-tooltip/>

        <!--  用例等级  -->
        <el-table-column
          :filters="priorityOptions"
          column-key="importance"
          label="用例等级"
          prop="importance"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <priority-table-item :value="scope.row.importance"/>
          </template>
        </el-table-column>

        <!--  类型  -->
        <el-table-column
          column-key="caseType"
          label="类型"
          prop="caseType"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <case-type-table-item :value="scope.row.caseType"/>
          </template>
        </el-table-column>

        <!--  测试方式  -->
        <el-table-column
          column-key="executionType"
          label="测试方式"
          prop="executionType"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <execution-type-table-item :value="scope.row.executionType"/>
          </template>
        </el-table-column>

        <!--  所属模块  -->
        <el-table-column label="所属模块" prop="treePath" show-overflow-tooltip/>

        <!--  所属项目  -->
        <el-table-column label="所属项目" prop="projName" show-overflow-tooltip/>

        <!--  评审结果  -->
        <el-table-column :filters="statusOptions" column-key="status" label="评审结果">
          <template slot-scope="scope">
            <review-case-status-table-item :value="scope.row.status"/>
          </template>
        </el-table-column>

        <!--  更新时间  -->
        <el-table-column
          :width="tableTimeWidth"
          label="更新时间"
          prop="updatedAt"
          show-overflow-tooltip
          sortable
        />

        <!--  操作  -->
        <el-table-column :width="table1BtnWidth" label="操作">
          <template slot-scope="scope">
            <table-operator run-tip="开始评审" show-run @runClick="handleReviewRun(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>

      <table-pagination
        :change="initTableData"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :total="total"
      />

    </el-card>

    <batch-edit
      ref="batchEdit"
      :type-arr="caseBatchReviewOptions"
      :value-arr="batchReviewValueArr"
      dialog-title="批量评审用例"
      @batchEdit="batchReview"
    />

  </div>
</template>

<script lang="ts">

import {testCaseApi} from "@/api"
import {RequestGetTestCaseList, RequestUpdateTestCaseBatch} from "@/api/types/testTrack"
import {typeCaseData} from "@/api/types/testTrackType"
import variables from "@/assets/css/utils.scss"
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import TableOperator from "@/common/components/TableOperator.vue"
import {_filter, formatTime} from "@/common/utils"
import {PAGINATION_SIZE} from "@/constant"
import {caseTypeType, caseUpdateTypeEnum, executionType, priorityType} from "@/constant/TestCase"
import {caseBatchReviewType, reviewCaseStatusType} from "@/constant/TestReivew"
import BatchEdit from "@/pages/track/case/components/BatchEdit.vue"
import ShowMoreBtn from "@/pages/track/case/components/ShowMoreBtn.vue"
import CaseTypeTableItem from "@/pages/track/common/tableItems/CaseTypeTableItem.vue"
import ExecutionTypeTableItem from "@/pages/track/common/tableItems/ExecutionTypeTableItem.vue"
import PriorityTableItem from "@/pages/track/common/tableItems/PriorityTableItem.vue"
import ReviewCaseStatusTableItem from "@/pages/track/common/tableItems/ReviewCaseStatusTableItem.vue"
import {getModuleByTreeId, getModuleOptions} from "@/pages/track/common/utils"

// 执行方式
const executionOptions = Object.entries(executionType).map(([value, text]) => {
  return {text: text, value: value}
})
// 用例优先级
const priorityOptions = Object.entries(priorityType).map(([value, text]) => {
  return {text: text, value: value}
})
// 评审状态
const statusOptions = Object.entries(reviewCaseStatusType).map(([value, text]) => {
  return {text: text, value: value}
})
// 用例类型
const caseTypeOptions = Object.entries(caseTypeType).map(([value, text]) => {
  return {text: text, value: value}
})
// 批量编辑类型
const caseBatchReviewOptions = Object.entries(caseBatchReviewType).map(([value, text]) => {
  return {text: text, value: value}
})

export default {
  name: "TestReviewTestCaseList",
  components: {
    ExecutionTypeTableItem,
    CaseTypeTableItem,
    ReviewCaseStatusTableItem,
    TableOperator,
    PriorityTableItem,
    TablePagination,
    TableHeader,
    BatchEdit,
    ShowMoreBtn,
  },
  data() {
    return {
      executionOptions: executionOptions,
      priorityOptions: priorityOptions,
      statusOptions: statusOptions,
      caseTypeOptions: caseTypeOptions,
      caseBatchReviewOptions: caseBatchReviewOptions,
      tableData: [],
      treeNodes: [],
      currentPage: 1,
      pageSize: PAGINATION_SIZE.LARGE,
      total: 0,
      selectRows: new Set(),
      isDisabled: true,
      caseFilter: {},
      buttons: [{name: '批量评审用例', handleClick: this.handleBatchReview}],
      condition: {
        // 所属模块
        moduleOptions: [],
        // 维护人
        maintainerOptions: [],
        // 执行方式
        executionOptions: executionOptions,
        // 优先级
        priorityOptions: priorityOptions,
        // 用例类型
        caseTypeOptions: caseTypeOptions,
      },
      batchReviewValueArr: {
        // 评审状态
        status: statusOptions,
      },
    }
  },
  props: {
    currentReview: Object,
    projects: Array,
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    users() {
      return this.$store.state.users.users
    },
    table1BtnWidth() {
      return variables['table1BtnWidth']
    },
    tableTimeWidth() {
      return variables['tableTimeWidth']
    },
    caseIds() {
      return Array.from(this.selectRows).map((row: { id: string }) => row.id)
    },
  },
  watch: {
    currentReview() {
      this.initTableData()
    }
  },
  methods: {
    async setSelectOptions() {
      await this.setModuleOptions()
      // this.setMaintainerOptions()
    },
    async initTableData() {
      await this.setSelectOptions()
      await this.getData()
    },
    async getData(value?: string) {
      const params: RequestGetTestCaseList = {
        treeId: this.currentReview.treeId,
        offset: this.pageSize * (this.currentPage - 1),
        limit: this.pageSize,
        name: value,
      }

      this.caseFilter = sessionStorage.getItem(this.$route.path)
      this.caseFilter = this.caseFilter ? JSON.parse(this.caseFilter) : {}
      if (JSON.stringify(this.caseFilter) !== "{}") {
        Object.assign(params, this.caseFilter)
        this.$refs.table.columns.forEach((item: any) => {
          item.filteredValue = this.caseFilter[item.columnKey]
        })
      }

      await testCaseApi.getTestCaseList(params)
        .then(({data}) => {
          this.total = data.total
          this.tableData = data.data
          this.tableData.forEach((item: any) => {
            item.updatedAt = formatTime(item.updatedAt)
            item.treePath = getModuleByTreeId(this.treeNodes, item.treeId).path
            item.projName = this.projects.find((obj: any) => obj.id === item.projId).name
          })
        })
    },
    handleSearch(value?: string) {
      this.getData(value)
    },
    handleReviewRun(testCase?: typeCaseData) {
      // 开始评审按钮，默认选择第一个
      if (!testCase) testCase = this.tableData[0]
      this.$eventBus.$emit("testReviewCaseRun", testCase, this.tableData, this)
    },
    handleSelectAll(selection: Object[]) {
      if (selection.length > 0) {
        this.tableData.forEach((item: any) => {
          this.$set(item, "isDisabled", false)
        })
        this.selectRows = new Set(selection)
      } else {
        this.selectRows.clear()
        this.tableData.forEach((row: any) => {
          this.$set(row, "isDisabled", true)
        })
      }
    },
    handleSelectionChange(selection: Object[], row: any) {
      if (selection.indexOf(row) === -1) {
        this.$set(row, "isDisabled", true)
      } else {
        this.$set(row, "isDisabled", false)
      }
      this.selectRows = new Set(selection)
    },
    batchReview(reviewForm: any) {
      const body: RequestUpdateTestCaseBatch = {
        caseIds: this.caseIds,
        type: caseUpdateTypeEnum.UPDATE_REVIEW_STATUS,
        status: reviewForm.value,
        reviewId: this.currentReview.id,
      }
      testCaseApi.updateTestCaseBatch(body)
        .then(() => {
          this.refresh()
        })
    },
    handleBatchReview() {
      this.$refs.batchEdit.open()
    },
    refresh() {
      this.$emit('refresh')
    },
    filter(filters: any) {
      this.currentPage = 1
      _filter(filters, this.caseFilter, this.$route.path)
      this.initTableData()
    },
    setMaintainerOptions() {
      this.condition.maintainerOptions = this.users
    },
    async setModuleOptions() {
      await testCaseApi.getTestCaseModules({projId: this.currentReview.projId})
        .then(({data}) => {
          this.treeNodes = data
          this.condition.moduleOptions = getModuleOptions(this.treeNodes)
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  cursor: pointer;
}
</style>
