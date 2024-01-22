<template>
  <div>
    <el-card class="card-content">
      <template slot="header">
        <table-header
          :condition="condition"
          create-tip="创建测试计划"
          :show-third="stage === planStageEnum.SMOKE"
          :third-tip="isReject ? '返回全部计划': '筛选驳回计划'"
          icon-third="el-icon-sugar"
          @create="handleAddOrEdit"
          @search="handleSearch"
          @thirdClick="handleSearch('', true)"
        >
          <template slot="title">
            <div>{{ stage === planStageEnum.SMOKE ? '冒烟测试计划' : '功能测试计划' }}</div>
          </template>
        </table-header>
      </template>
      <el-table
        ref="table"
        v-loading="loading"
        :data="tableData"
        @row-click="handleRowClick"
        @filter-change="filter"
      >

        <!--  名称  -->
        <el-table-column label="计划名称" min-width="130" prop="name" show-overflow-tooltip/>

        <!--  负责人  -->
        <el-table-column
          :filters="users"
          column-key="owner"
          label="负责人"
          prop="owner"
          show-overflow-tooltip
        />

        <!--  当前状态  -->
        <el-table-column
          :filters="planStatusOptions"
          column-key="status"
          label="计划状态"
          prop="status"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <plan-status :value="scope.row.status"/>
          </template>
        </el-table-column>

        <!--  测试阶段  -->
        <el-table-column
          :filters="planStageOptions"
          column-key="stage"
          label="测试阶段"
          prop="stage"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <plan-stage-table-item :value="scope.row.stage"/>
          </template>
        </el-table-column>

        <!--  测试进度  -->
        <el-table-column label="执行成功率" prop="percentage" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.percentage"/>
          </template>
        </el-table-column>
        <!--  确认成功率      -->
        <el-table-column v-if="stage === planStageEnum.SMOKE" label="确认成功率" prop="percentage" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.checkPercentage"/>
          </template>
        </el-table-column>

        <!--  所属项目  -->
        <el-table-column
          :filters="projects"
          column-key="projId"
          label="所属项目"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>{{ scope.row.projNames.join() }}</div>
          </template>
        </el-table-column>

        <!--        &lt;!&ndash;  计划开始时间  &ndash;&gt;-->
        <!--        <el-table-column label="计划开始" prop="targetStart" show-overflow-tooltip sortable/>-->

        <!--        &lt;!&ndash;  计划结束时间  &ndash;&gt;-->
        <!--        <el-table-column label="计划结束" prop="targetEnd" show-overflow-tooltip sortable/>-->

        <!--        &lt;!&ndash;  实际开始时间  &ndash;&gt;-->
        <!--        <el-table-column label="实际开始" prop="actualStart" show-overflow-tooltip sortable/>-->

        <!--        &lt;!&ndash;  实际结束时间  &ndash;&gt;-->
        <!--        <el-table-column label="实际结束" prop="actualEnd" show-overflow-tooltip sortable/>-->

        <!--  开发提测  -->
        <el-table-column
          v-if="stage === planStageEnum.SMOKE"
          label="提测审批状态"
          prop="packagingTest"
          show-overflow-tooltip
          sortable
        >
          <template slot-scope="scope">
            <plan-test-table-item
              :value="scope.row.instanceStatus"
              @approvalStatus="approvalStatus"
              @handleChange="handleChange(scope.row)"
              :is-dot-hidden="scope.row.rejectCount > 0"
            />
          </template>
        </el-table-column>

        <!--  操作  -->
        <el-table-column :width="table4BtnWidth" label="操作">
          <template slot-scope="scope">
            <table-operator
              copy-tip="查看测试报告"
              show-copy
              show-delete
              show-edit
              @copyClick="handleToReport(scope.row)"
              @deleteClick="handleDelete(scope.row)"
              @editClick="handleAddOrEdit(scope.row)"
            >
              <template v-if="stage === planStageEnum.SMOKE" slot="latest">
                <el-tooltip
                  v-if="scope.row.stage === planStageEnum.SMOKE"
                  content="提测"
                  placement="top"
                >
                  <el-button
                    :disabled="scope.row.percentage <= 90"
                    circle
                    icon="el-icon-s-promotion"
                    size="mini"
                    type="warning"
                    @click.native.stop="handleSubmit(scope.row)"
                  />
                </el-tooltip>
              </template>
            </table-operator>
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
  </div>
</template>

<script lang="ts">

import {testPlanApi} from "@/api"
import {RequestGetTestCasePlanList, RequestUpdateApprovalStatus} from "@/api/types/testPlan"
import {typePlanData} from "@/api/types/testPlanType"
import variables from "@/assets/css/utils.scss"
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import TableOperator from "@/common/components/TableOperator.vue"
import {_filter, formatTime} from "@/common/utils"
import {PAGINATION_SIZE} from "@/constant"
import {PathName} from "@/constant/routeData"
import {planInstanceStatusEnum, planStageEnum, planStageType, planStatusEnum, planStatusType} from "@/constant/TestPlan"
import PlanStageTableItem from "@/pages/track/common/tableItems/PlanStageTableItem.vue"
import PlanStatus from "@/pages/track/common/tableItems/PlanStatusTableItem.vue"
import PlanTestTableItem from "@/pages/track/common/tableItems/PlanTestTableItem.vue"
import {Message} from "element-ui"


// 当前状态
const planStatusOptions = Object.entries(planStatusType).map(([value, text]) => {
  return {text: text, value: value}
})


export default {
  name: "TestPlanList",
  components: {
    PlanTestTableItem,
    PlanStageTableItem,
    PlanStatus,
    TableOperator,
    TablePagination,
    TableHeader,
  },
  data() {
    return {
      planStatusOptions: planStatusOptions,
      planStageEnum: planStageEnum,
      planInstanceStatusEnum: planInstanceStatusEnum,
      projects: this.projects,
      users: this.users,
      isReject: false,
      tableData: [],
      currentPage: 1,
      pageSize: PAGINATION_SIZE.LARGE,
      total: 0,
      caseFilter: {},
    }
  },
  props: {
    condition: Object,
    stage: String,
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    table4BtnWidth() {
      return variables['table4BtnWidth']
    },
    planStageOptions() {
      if (this.stage === planStageEnum.SMOKE) {
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars
        return Object.entries(planStageType).filter(([value, text]) => value === planStageEnum.SMOKE).map(([value, text]) => {
          return {text: text, value: value}
        })
      } else {
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars
        return Object.entries(planStageType).filter(([value, text]) => value !== planStageEnum.SMOKE).map(([value, text]) => {
          return {text: text, value: value}
        })
      }
    }
  },
  inject: ['projects', 'users'],
  mounted() {
    this.initTableData()
  },
  methods: {
    initTableData() {
      this.setSelectOptions()
      this.getData()
      this.$emit('update:condition', this.condition)
    },
    setSelectOptions() {
      this.setOwnerOptions()
      this.setProjectOptions()
    },
    getData(value?: string) {
      let defaultStage = this.planStageOptions.map((item: any) => {
        return item.value
      })
      const params: RequestGetTestCasePlanList = {
        offset: this.pageSize * (this.currentPage - 1),
        limit: this.pageSize,
        stage: defaultStage,
        name: value,
        isReject: this.isReject,
      }
      this.caseFilter = sessionStorage.getItem(this.$route.path)
      this.caseFilter = this.caseFilter ? JSON.parse(this.caseFilter) : {}
      if (JSON.stringify(this.caseFilter) !== "{}") {
        Object.assign(params, this.caseFilter)
        if (!this.caseFilter.stage || this.caseFilter.stage.length === 0) {
          Object.assign(params, {stage: defaultStage})
        }
        this.$refs.table.columns.forEach((item: any) => {
          item.filteredValue = this.caseFilter[item.columnKey]
        })
      }

      testPlanApi.getTestCasePlanList(params)
        .then(({data}) => {
          this.total = data.total
          this.tableData = data.data
          this.tableData.forEach((item: typePlanData) => {
            item.targetStart = formatTime(item.targetStart)
            item.targetEnd = formatTime(item.targetEnd)
            item.actualStart = formatTime(item.actualStart)
            item.actualEnd = formatTime(item.actualEnd)
          })
        })
    },
    handleAddOrEdit(testPlan?: typePlanData) {
      this.$eventBus.$emit('testPlanCreateOrUpdate', testPlan, this.planStageOptions)
    },
    handleSearch(value?: string, fetchReject?: boolean) {
      if (fetchReject) {
        this.isReject = !this.isReject
      }
      this.currentPage = 1
      this.getData(value)
    },
    handleDelete(testPlan: typePlanData) {
      this.$alert('确认删除测试计划?', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            testPlanApi.deleteTestCasePlan(testPlan.id)
              .then(() => {
                this.refresh()
              })
          }
        }
      })
    },
    handleSubmit(testPlan: typePlanData) {
      this.$eventBus.$emit("packagingTestSubmit", testPlan)
    },
    handleToReport(testPlan: typePlanData) {
      this.$router.push({
        name: PathName.TestTrackCasePlanReport,
        params: {planId: testPlan.id},
      })
    },
    refresh() {
      this.initTableData()
    },
    handleRowClick(row: any) {
      this.$router.push({
        name: PathName.TestTrackCasePlanView,
        params: {planId: row.id},
      })
    },
    handleChange(testPlan: typePlanData) {
      // 冒烟用例审批通过需要测试检查通过率达100%
      if (this.command === planInstanceStatusEnum.APPROVED && testPlan.checkPercentage !== 100) {
        Message({
          message: "审批通过需要确认成功率达100%",
          type: "warning",
          duration: 3000,
          showClose: true
        })
        return
      }
      let body: RequestUpdateApprovalStatus = {
        status: this.command,
        userEmail: this.$store.state.login.email,
      }
      testPlanApi.updateApprovalStatus(testPlan.id, body)
        .then(() => {
          if (this.command === planInstanceStatusEnum.APPROVED) {
            testPlanApi.updateTestCasePlan(testPlan.id, {status: planStatusEnum.DONE})
              .then(() => {
                this.refresh()
              })
          } else {
            this.refresh()
          }
        })
    },
    approvalStatus(command: planInstanceStatusEnum) {
      this.command = command
    },
    filter(filters: any) {
      this.currentPage = 1
      _filter(filters, this.caseFilter, this.$route.path)
      this.initTableData()
    },
    setOwnerOptions() {
      this.condition.ownerOptions = this.users
    },
    setProjectOptions() {
      this.condition.projectOptions = this.projects
    },
  },
}
</script>

<style lang="scss" scoped>
.el-table {
  cursor: pointer;
}

</style>
