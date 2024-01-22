<template>
  <div>
    <el-card class="card-content">
      <template slot="header">
        <table-header
          :condition="condition"
          :create-tip="allCase ? '我的用例' : '全部用例'"
          :icon-create="allCase ? 'el-icon-s-custom' : 'el-icon-files'"
          icon-run="el-icon-connection"
          icon-third="el-icon-document-remove"
          run-tip="关联测试用例"
          show-run
          show-third
          third-tip="取消全部关联"
          @create="handleSwitch"
          @runTest="handleRelateCase"
          @search="handleSearch"
          @thirdClick="handleDelete"
        >
          <template slot="title">
            <node-breadcrumb :nodes="selectParentNodes" @refresh="refreshTable"/>
          </template>
          <template slot="button">
            <el-button
              v-if="planStage === planStageEnum.SMOKE"
              :icon="isQa ? 'el-icon-s-check' : 'el-icon-cpu'"
              @click="isQa = !isQa"
            >
              {{ isQa ? '测试验证' : '开发执行' }}
            </el-button>
          </template>
        </table-header>

      </template>
      <el-table
        ref="table"
        :data="tableData"
        row-key="id"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        @row-click="handleRunTest"
        @filter-change="filter"
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
        <el-table-column label="名称" prop="caseDetail.name" show-overflow-tooltip/>

        <!--  用例等级  -->
        <el-table-column
          :filters="priorityOptions"
          column-key="importance"
          label="用例等级"
          prop="caseDetail.importance"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <priority-table-item :value="scope.row.caseDetail.importance"/>
          </template>
        </el-table-column>

        <!--  类型  -->
        <el-table-column
          column-key="caseDetail.caseType"
          label="类型"
          prop="caseDetail.caseType"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <case-type-table-item :value="scope.row.caseDetail.caseType"/>
          </template>
        </el-table-column>

        <!--  测试方式  -->
        <el-table-column
          column-key="method"
          label="测试方式"
          prop="caseDetail.executionType"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <execution-type-table-item :value="scope.row.caseDetail.executionType"/>
          </template>
        </el-table-column>

        <!--  所属模块  -->
        <el-table-column label="所属模块" prop="treePath" show-overflow-tooltip/>

        <!--  所属项目  -->
        <el-table-column :filters="projects" column-key="projId" label="所属项目" prop="projName"/>

        <!--  缺陷  -->
        <el-table-column label="缺陷" prop="issues" show-overflow-tooltip/>

        <!--  执行人  -->
        <el-table-column
          :filters="users"
          column-key="executor"
          label="执行人"
          prop="executor"
          show-overflow-tooltip
        />

        <!--  执行结果  -->
        <el-table-column :filters="planResultOptions" column-key="status" label="执行结果">
          <template slot-scope="scope">
            <plan-case-status-table-item :value="scope.row.status"/>
          </template>
        </el-table-column>

        <!--  确认结果  -->
        <el-table-column
          v-if="planStage === planStageEnum.SMOKE"
          :filters="planResultOptions"
          column-key="smokeCheck"
          label="确认结果"
        >
          <template slot-scope="scope">
            <plan-case-status-table-item :value="scope.row.smokeCheck"/>
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
        <el-table-column :width="table2BtnWidth" label="操作">
          <template slot-scope="scope">
            <table-operator
              delete-icon="el-icon-link"
              delete-tip="取消关联"
              show-delete
              show-run
              @deleteClick="handleDelete(scope.row)"
              @runClick="handleRunTest(scope.row)"
            />
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

    <test-case-plan-run ref="testPlanTestCaseRun" :plan-id="planId" @refresh="refreshTable"/>
    <test-case-relevance ref="testCaseRelevance" :plan-id="planId" @refreshTable="refreshTable"/>

    <batch-edit
      ref="batchEdit"
      :type-arr="caseBatchEditOptions"
      :value-arr="batchEditValueArr"
      dialog-title="批量编辑用例"
      @batchEdit="batchEdit"
    />

  </div>
</template>

<script lang="ts">

import {testCaseApi, testPlanApi} from "@/api"
import {RequestGetTestCasePlanCaseList, RequestUpdateTestCasePlanCaseList} from "@/api/types/testPlan"
import {typePlanData} from "@/api/types/testPlanType"
import {RequestUpdateTestCaseBatch} from "@/api/types/testTrack"
import {typeCaseStep} from "@/api/types/testTrackType"
import variables from "@/assets/css/utils.scss"
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import TableOperator from "@/common/components/TableOperator.vue"
import {_filter, formatTime} from "@/common/utils"
import {PAGINATION_SIZE} from "@/constant"
import {PathName} from "@/constant/routeData"
import {caseTypeType, caseUpdateTypeEnum, executionType, priorityType, stepStatusEnum} from "@/constant/TestCase"
import {
  caseBatchEditEnum,
  caseBatchEditType,
  planOperationEnum,
  planResultType,
  planStageEnum
} from "@/constant/TestPlan"
import BatchEdit from "@/pages/track/case/components/BatchEdit.vue"
import ShowMoreBtn from "@/pages/track/case/components/ShowMoreBtn.vue"
import NodeBreadcrumb from "@/pages/track/common/NodeBreadcrumb.vue"
import CaseTypeTableItem from "@/pages/track/common/tableItems/CaseTypeTableItem.vue"
import ExecutionTypeTableItem from "@/pages/track/common/tableItems/ExecutionTypeTableItem.vue"
import PlanCaseStatusTableItem from "@/pages/track/common/tableItems/PlanCaseStatusTableItem.vue"
import PriorityTableItem from "@/pages/track/common/tableItems/PriorityTableItem.vue"
import {getModuleByTreeId} from "@/pages/track/common/utils"
import TestCasePlanRun from "@/pages/track/plan/view/comonents/TestCasePlanRun.vue"
import TestCaseRelevance from "@/pages/track/plan/view/comonents/TestCaseRelevance.vue"

// 执行方式
const executionOptions = Object.entries(executionType).map(([value, text]) => {
  return {text: text, value: value}
})
// 用例优先级
const priorityOptions = Object.entries(priorityType).map(([value, text]) => {
  return {text: text, value: value}
})
// 计划用例状态
const planResultOptions = Object.entries(planResultType).map(([value, text]) => {
  return {text: text, value: value}
})
// 用例类型
const caseTypeOptions = Object.entries(caseTypeType).map(([value, text]) => {
  return {text: text, value: value}
})
// 批量编辑类型
const caseBatchEditOptions = Object.entries(caseBatchEditType).map(([value, text]) => {
  return {text: text, value: value}
})

export default {
  name: "TestCasePlanList",
  components: {
    BatchEdit,
    TestCasePlanRun,
    ExecutionTypeTableItem,
    CaseTypeTableItem,
    PlanCaseStatusTableItem,
    PriorityTableItem,
    ShowMoreBtn,
    NodeBreadcrumb,
    TableOperator,
    TablePagination,
    TableHeader,
    TestCaseRelevance,
  },
  data() {
    return {
      executionOptions: executionOptions,
      priorityOptions: priorityOptions,
      planResultOptions: planResultOptions,
      caseTypeOptions: caseTypeOptions,
      caseBatchEditOptions: caseBatchEditOptions,
      planStageEnum: planStageEnum,
      users: this.users,
      projects: this.projects,
      condition: {},
      buttons: [
        {name: '批量编辑用例', handleClick: this.handleBatchEdit},
        {name: '批量取消关联', handleClick: this.handleBatchUnRelate},
      ],
      allCase: false,
      tableData: [],
      selectRows: new Set(),
      currentPage: 1,
      pageSize: PAGINATION_SIZE.LARGE,
      total: 0,
      caseFilter: {},
      batchEditValueArr: {
        // 执行方式
        result: planResultOptions,
        // 维护人
        executor: [],
      },
      planStage: '',
      isQa: false,
    }
  },
  props: {
    treeNodes: Array,
    selectNode: Object,
    selectParentNodes: Array,
  },
  inject: ['projects', 'users'],
  computed: {
    planId() {
      return this.$route.params.planId
    },
    projId() {
      return this.$route.query.projId
    },
    treeId() {
      return this.$route.query.treeId
    },
    caseIds() {
      return Array.from(this.selectRows).map((row: { caseId: string }) => row.caseId)
    },
    table2BtnWidth() {
      return variables['table2BtnWidth']
    },
    tableTimeWidth() {
      return variables['tableTimeWidth']
    }
  },
  watch: {
    '$route'() {
      this.initTableData()
    },
    treeNodes() {
      this.initTableData()
    },
  },
  mounted() {
    this.getPlanDetail()
  },
  methods: {
    setSelectOptions() {
      this.setPriorityOptions()
      this.setProjectOptions()
      this.setCaseTypeOptions()
      this.setExecutorOptions()
    },
    initTableData() {
      this.setSelectOptions()
      this.getData()
    },
    async getData(value?: string) {
      let params: RequestGetTestCasePlanCaseList = {
        offset: this.pageSize * (this.currentPage - 1),
        limit: this.pageSize,
        name: value,
        treeId: this.treeId,
        projId: this.treeId ? undefined : this.projId
      }

      this.caseFilter = sessionStorage.getItem(this.$route.path)
      this.caseFilter = this.caseFilter ? JSON.parse(this.caseFilter) : {}
      if (JSON.stringify(this.caseFilter) !== "{}") {
        Object.assign(params, this.caseFilter)
        this.$refs.table.columns.forEach((item: any) => {
          item.filteredValue = this.caseFilter[item.columnKey]
        })
      }

      await testPlanApi.getTestCasePlanCaseList(this.planId, params)
        .then(({data}) => {
          this.total = data.total
          this.tableData = data.data
          this.tableData.forEach((item: any) => {
            item.treePath = getModuleByTreeId(this.treeNodes, item.treeId).path
            item.updatedAt = formatTime(item.updatedAt)
            item.projName = this.projects.find((obj: any) => obj.id === item.projId).name
            item.caseDetail.steps.forEach((obj: typeCaseStep) => {
              obj.actualStatus = stepStatusEnum.PASS
            })
            item.stepActualStatus.forEach((obj: stepStatusEnum, index: number) => {
              item.caseDetail.steps[index].actualStatus = obj || stepStatusEnum.PASS
            })
            item.stepActualResults.forEach((obj: string, index: number) => {
              item.caseDetail.steps[index].actualResult = obj
            })
          })
        })
    },
    getPlanDetail() {
      testPlanApi.getTestCasePlanDetail(this.planId)
        .then((data: any) => {
          this.planStage = data.stage
        })
    },
    handleSwitch() {
      Object.assign(
        this.caseFilter,
        {executor: this.allCase ? undefined : this.$store.state.login.username}
      )
      this.getData()
      this.allCase = !this.allCase
    },
    handleSearch(value?: string) {
      this.currentPage = 1
      this.getData(value)
    },
    handleRunTest(testCase?: typePlanData) {
      if (!testCase) testCase = this.tableData[0]
      this.$eventBus.$emit("testPlanCaseRun", testCase, this.tableData, this)
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
    handleRelateCase() {
      this.$refs.testCaseRelevance.open(this.condition, this.projId)
    },
    handleBatchEdit() {
      this.$refs.batchEdit.open()
    },
    handleBatchUnRelate() {
      this.handleDelete('', true)
    },
    batchEdit(editForm: any) {
      let body: RequestUpdateTestCaseBatch = {
        caseIds: this.caseIds,
        planId: this.planId,
        type: caseUpdateTypeEnum.UPDATE_PLAN_STATUS,
      }
      if (editForm.type === caseBatchEditEnum.EXECUTOR) {
        body = Object.assign(body, {
          type: caseUpdateTypeEnum.UPDATE_PLAN_EXECUTOR,
          executor: editForm.value,
        })
      } else if (editForm.type === caseBatchEditEnum.RESULT) {
        if (this.isQa) {
          body = Object.assign(body, {
            type: caseUpdateTypeEnum.UPDATE_PLAN_SMOKE_CHECK,
            smokeCheck: editForm.value,
          })
        } else {
          body = Object.assign(body, {
            status: editForm.value,
          })
        }
      }
      testCaseApi.updateTestCaseBatch(body)
        .then(() => {
          this.refreshTable()
        })
    },
    refreshTable() {
      this.$emit('refresh')
    },
    handleDelete(row?: any, isBatch?: boolean) {
      const msg = row || isBatch ? '确认取消关联测试用例?' : '确认取消全部关联测试用例?'
      this.$alert(msg, '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            let body: RequestUpdateTestCasePlanCaseList = {
              operation: planOperationEnum.REMOVE,
              caseIds: isBatch ? this.caseIds : (row ? [row.caseId] : []),
              projId: this.projId,
              treeId: this.treeId,
            }
            testPlanApi.updateTestCasePlanCaseList(this.planId, body)
              .then(() => {
                this.refreshTable()
              })
          }
        }
      })
    },
    filter(filters: any) {
      this.currentPage = 1
      _filter(filters, this.caseFilter, this.$route.path)
      this.initTableData()
    },
    setReviewerOptions() {
      this.condition.reviewerOptions = this.users
    },
    setProjectOptions() {
      this.condition.projectOptions = this.treeNodes
    },
    setPriorityOptions() {
      this.condition.priorityOptions = this.priorityOptions
    },
    setCaseTypeOptions() {
      this.condition.caseTypeOptions = this.caseTypeOptions
    },
    setExecutorOptions() {
      this.batchEditValueArr.executor = this.users
    },
    handleRowClick(row: any) {
      this.$router.push({
        name: PathName.TestTrackCaseReviewView,
        params: {reviewId: row.id},
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  cursor: pointer;
}

</style>
