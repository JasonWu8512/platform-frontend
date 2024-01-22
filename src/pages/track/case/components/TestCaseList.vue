<template>
  <div>
    <el-card class="card-content">
      <template slot="header">
        <table-header
          :condition="condition"
          :show-create="selectNode.id !== undefined"
          :show-run="selectNode.id !== undefined"
          create-tip="新建用例"
          icon-run="el-icon-download"
          run-tip="导入用例"
          @create="testCaseModify"
          @runTest="handleUpload"
          @search="handleSearch"
        >
          <template slot="title">
            <node-breadcrumb :nodes="selectParentNodes" @refresh="refresh"/>
          </template>
        </table-header>

      </template>
      <el-table
        ref="table"
        :data="tableData"
        class="test-content adjust-table"
        row-key="id"
        @select="handleSelectionChange"
        @filter-change="filter"
        @select-all="handleSelectAll"
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
        <el-table-column label="名称" prop="name" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover placement="right-end" title="查看用例" width="60%" @show="handleShow">
              <test-case-detail :condition="condition" :form="scope.row" :read-only="readOnly"/>
              <span slot="reference">{{ scope.row.name }}</span>
            </el-popover>
          </template>
        </el-table-column>

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

        <!--  评审状态  -->
        <el-table-column :filters="statusOptions" column-key="status" label="评审状态">
          <template slot-scope="scope">
            <review-case-status-table-item :value="scope.row.status"/>
          </template>
        </el-table-column>

        <!--  所属模块  -->
        <el-table-column label="所属模块" prop="treePath" show-overflow-tooltip/>

        <!--  更新时间  -->
        <el-table-column
          :width="tableTimeWidth"
          label="更新时间"
          prop="updatedAt"
          show-overflow-tooltip
          sortable
        />

        <!--  操作  -->
        <el-table-column :width="table3BtnWidth" label="操作">
          <template slot-scope="scope">
            <table-operator
              show-copy
              show-delete
              show-edit
              @copyClick="testCaseModify(scope.row, true)"
              @deleteClick="handleDelete(scope.row)"
              @editClick="testCaseModify(scope.row)"
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

    <batch-edit
      ref="batchEdit"
      :type-arr="caseBatchEditOptions"
      :value-arr="batchEditValueArr"
      dialog-title="批量编辑用例"
      @batchEdit="batchEdit"
    />

    <batch-move ref="batchMove" @batchMove="batchMove" @refresh="refresh"/>

  </div>
</template>

<script lang="ts">

import {testCaseApi} from "@/api"
import {RequestGetTestCaseList, RequestUpdateTestCaseBatch, UpdateTestCaseParams} from "@/api/types/testTrack"
import {typeCaseData} from "@/api/types/testTrackType"
import variables from "@/assets/css/utils.scss"
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import TableOperator from "@/common/components/TableOperator.vue"
import {_filter, formatTime} from "@/common/utils"
import {PAGINATION_SIZE} from "@/constant"
import {
  caseBatchEditEnum,
  caseBatchEditType,
  caseTypeType,
  caseUpdateTypeEnum,
  executionType,
  priorityType,
} from "@/constant/TestCase"
import {reviewCaseStatusType} from "@/constant/TestReivew"
import BatchEdit from "@/pages/track/case/components/BatchEdit.vue"
import BatchMove from "@/pages/track/case/components/BatchMove.vue"
import ShowMoreBtn from "@/pages/track/case/components/ShowMoreBtn.vue"
import TestCaseDetail from "@/pages/track/case/components/TestCaseDetail.vue"
import NodeBreadcrumb from "@/pages/track/common/NodeBreadcrumb.vue"
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
const caseBatchEditOptions = Object.entries(caseBatchEditType).map(([value, text]) => {
  return {text: text, value: value}
})

export default {
  name: "TestCaseList",
  components: {
    ReviewCaseStatusTableItem,
    ExecutionTypeTableItem,
    CaseTypeTableItem,
    TestCaseDetail,
    TableOperator,
    PriorityTableItem,
    TablePagination,
    NodeBreadcrumb,
    TableHeader,
    ShowMoreBtn,
    BatchEdit,
    BatchMove,
  },
  data() {
    return {
      executionOptions: executionOptions,
      priorityOptions: priorityOptions,
      statusOptions: statusOptions,
      caseTypeOptions: caseTypeOptions,
      tableData: [],
      currentPage: 1,
      pageSize: PAGINATION_SIZE.LARGE,
      total: 0,
      selectRows: new Set(),
      isDisabled: true,
      caseFilter: {},
      buttons: [
        {name: '批量编辑用例', handleClick: this.handleBatchEdit},
        {name: '批量移动用例', handleClick: this.handleBatchMove},
        {name: '批量删除用例', handleClick: this.handleDeleteBatch}
      ],
      caseBatchEditOptions: caseBatchEditOptions,
      batchEditValueArr: {
        // 优先级
        priority: priorityOptions,
        // 用例类型
        caseType: caseTypeOptions,
        // 执行方式
        method: executionOptions,
        // 维护人
        maintainer: [],
      },
    }
  },
  props: {
    currentProject: Object,
    treeNodes: Array,
    selectNode: Object,
    selectParentNodes: Array,
    condition: Object,
    readOnly: Boolean,
  },
  computed: {
    caseIds() {
      return Array.from(this.selectRows).map((row: { id: string }) => row.id)
    },
    table3BtnWidth() {
      return variables['table3BtnWidth']
    },
    tableTimeWidth() {
      return variables['tableTimeWidth']
    },
    loading() {
      return this.$store.state.loading
    },
  },
  inject: ['users'],
  methods: {
    setSelectOptions() {
      this.setModuleOptions()
      this.setMaintainerOptions()
      this.condition.executionOptions = this.executionOptions
      this.condition.priorityOptions = this.priorityOptions
      this.condition.caseTypeOptions = this.caseTypeOptions
      this.$emit("update:condition", this.condition)
    },
    initTableData() {
      this.setSelectOptions()
      this.getData()
    },
    getData(value?: string) {
      let params: RequestGetTestCaseList = {
        offset: this.pageSize * (this.currentPage - 1),
        limit: this.pageSize,
        name: value,
        treeId: this.selectNode.id,
        projId: this.selectNode.id ? undefined : this.currentProject.id,
      }

      this.caseFilter = sessionStorage.getItem(this.$route.path)
      this.caseFilter = this.caseFilter ? JSON.parse(this.caseFilter) : {}
      if (JSON.stringify(this.caseFilter) !== "{}") {
        Object.assign(params, this.caseFilter)
        this.$refs.table.columns.forEach((item: any) => {
          item.filteredValue = this.caseFilter[item.columnKey]
        })
      }

      testCaseApi.getTestCaseList(params)
        .then(({data}) => {
          this.total = data.total
          this.tableData = data.data
          this.tableData.forEach((item: any) => {
            item.updatedAt = formatTime(item.updatedAt)
            item.treePath = getModuleByTreeId(this.treeNodes, item.treeId).path
          })
        })
    },
    handleSearch(value?: string) {
      // console.log('handleSearch', value)
      this.currentPage = 1
      this.getData(value)
    },
    testCaseModify(testCase?: typeCaseData, isCopy?: boolean) {
      if (this.treeNodes.length < 1) {
        this.$message.warning('请先新建模块')
        return
      }
      this.$eventBus.$emit("testCaseAddOrEditOrCopy", testCase, isCopy)
      this.$emit("update:readOnly", false)
    },
    handleShow() {
      this.$emit("update:readOnly", true)
    },
    handleDelete(testCase: any) {
      this.$alert(`确认删除测试用例'${testCase.name}'？删除后评审及测试计划关联的用例均会被删除。`, '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            testCaseApi.updateTestCase(testCase.id, {type: caseUpdateTypeEnum.DELETE})
              .then(() => {
                this.refresh()
              })
          }
        }
      })
    },
    handleDeleteBatch() {
      this.$alert('确认删除测试用例？删除后评审及测试计划关联的用例均会被删除。', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            const body: RequestUpdateTestCaseBatch = {
              caseIds: this.caseIds,
              type: caseUpdateTypeEnum.DELETE,
            }
            testCaseApi.updateTestCaseBatch(body)
              .then(() => {
                this.refresh()
              })
          }
        }
      })
    },
    refresh() {
      this.$emit("refresh")
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
    handleUpload() {
      this.$eventBus.$emit('TestCaseImport')
    },
    batchEdit(editForm: any) {
      let _case: UpdateTestCaseParams = {}
      if (editForm.type === caseBatchEditEnum.PRIORITY) {
        _case = Object.assign({importance: parseInt(editForm.value)}, _case)
      } else if (editForm.type === caseBatchEditEnum.CASE_TYPE) {
        _case = Object.assign({caseType: editForm.value}, _case)
      } else if (editForm.type === caseBatchEditEnum.MAINTAINER) {
        _case = Object.assign({qa: editForm.value}, _case)
      } else if (editForm.type === caseBatchEditEnum.METHOD) {
        _case = Object.assign({executionType: parseInt(editForm.value)}, _case)
      }
      const body: RequestUpdateTestCaseBatch = {
        caseIds: this.caseIds,
        type: caseUpdateTypeEnum.UPDATE_CASE,
        case: _case
      }
      testCaseApi.updateTestCaseBatch(body)
        .then(() => {
          this.refresh()
        })
    },
    batchMove(nodeId: string) {
      const _case: UpdateTestCaseParams = {treeId: nodeId}
      const body = {
        caseIds: this.caseIds,
        type: caseUpdateTypeEnum.UPDATE_CASE,
        case: _case
      }
      testCaseApi.updateTestCaseBatch(body)
        .then(() => {
          this.refresh()
        })
    },
    filter(filters: any) {
      this.currentPage = 1
      _filter(filters, this.caseFilter, this.$route.path)
      this.initTableData()
    },
    handleBatchEdit() {
      this.$refs.batchEdit.open()
    },
    handleBatchMove() {
      this.$refs.batchMove.open(this.treeNodes)

      // this.$emit("batchMove", this.caseIds)
    },
    setModuleOptions() {
      this.condition.moduleOptions = getModuleOptions(this.treeNodes)
    },
    setMaintainerOptions() {
      this.batchEditValueArr.maintainer = this.users
      this.condition.maintainerOptions = this.users
    },
  }
}
</script>

<style lang="scss" scoped>

.table-page {
  padding-top: 20px;
  margin-right: -9px;
  float: right;
}

.operate-button {
  float: right;
}

.operate-button > div {
  display: inline-block;
  margin-left: 10px;
}

.search {
  margin-left: 10px;
  width: 240px;
}

.el-table {
  cursor: pointer;
}

</style>
