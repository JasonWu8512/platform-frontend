<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      class="dialog-title"
      title="关联测试用例"
      width="60%"
      @close="close"
    >

      <el-container v-loading="loading" class="main-content">
        <el-aside class="tree-aside" width="250px">
          <select-menu
            :current-data="currentProject"
            :data="projects"
            title="切换项目"
            @dataChange="changeProject"
          />
          <node-tree
            ref="nodeTree"
            :current-node="selectNode"
            :tree-nodes="treeNodes"
            class="node-tree"
            @nodeSelectEvent="nodeChange"
          />
        </el-aside>

        <el-container>
          <el-main class="case-content">
            <table-header :condition="condition" :show-create="false" @search="handleSearch"/>
            <el-table
              ref="table"
              :data="tableData"
              class="test-content adjust-table"
              row-key="id"
              @selection-change="handleSelectionChange"
              @filter-change="filter"
              @select-all="handleSelectAll"
            >

              <!--  复选框  -->
              <el-table-column type="selection"/>

              <!--  用例名称  -->
              <el-table-column label="用例名称" prop="name" show-overflow-tooltip/>

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
            </el-table>

            <table-pagination
              :change="initTableData"
              :current-page.sync="currentPage"
              :page-size.sync="pageSize"
              :total="total"
            />
          </el-main>
        </el-container>
      </el-container>

      <template slot="footer">
        <dialog-footer @cancel="dialogVisible = false" @confirm="save"/>
      </template>

    </el-dialog>

  </div>

</template>

<script lang="ts">

import {testCaseApi, testPlanApi} from "@/api"
import {RequestGetTestCasePlanUnRelateCaseList, RequestUpdateTestCasePlanCaseList} from "@/api/types/testPlan"
import {typeNode} from "@/api/types/testTrackType"
import DialogFooter from "@/common/components/DialogFooter.vue"
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import {_filter} from "@/common/utils";
import {PAGINATION_SIZE} from "@/constant"
import {planOperationEnum} from "@/constant/TestPlan"
import NodeTree from "@/pages/track/common/NodeTree.vue"
import SelectMenu from "@/pages/track/common/SelectMenu.vue"
import CaseTypeTableItem from "@/pages/track/common/tableItems/CaseTypeTableItem.vue"
import PriorityTableItem from "@/pages/track/common/tableItems/PriorityTableItem.vue"

export default {
  name: "TestCaseRelevance",
  components: {
    CaseTypeTableItem,
    PriorityTableItem,
    TablePagination,
    NodeTree,
    SelectMenu,
    DialogFooter,
    TableHeader
  },
  data() {
    return {
      priorityOptions: [],
      caseTypeOptions: [],
      dialogVisible: false,
      currentProject: {},
      treeNodes: [],
      selectNode: {},
      projects: [],
      tableData: [],
      selectRows: [],
      currentPage: 1,
      pageSize: PAGINATION_SIZE.LARGE,
      total: 0,
      caseFilter: {},
      condition: {},
    }
  },
  props: {
    planId: [String, Number],
  },
  computed: {
    loading() {
      return this.$store.state.loading
    }
  },
  methods: {
    initOptions() {
      this.projects = this.condition.projectOptions
      this.priorityOptions = this.condition.priorityOptions
      this.caseTypeOptions = this.condition.caseTypeOptions
    },
    initTableData() {
      this.initOptions()
      this.getData()
    },
    getData(value?: string) {
      let params: RequestGetTestCasePlanUnRelateCaseList = {
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

      testPlanApi.getTestCasePlanUnRelateCaseList(this.planId, params)
        .then(({data}) => {
          this.total = data.total
          this.tableData = data.data
        })
    },
    open(condition: any, projId: string) {
      this.condition = condition
      this.initTableData()
      this.currentProject.id = projId
      this.dialogVisible = true
    },
    handleSearch(value?: string) {
      this.currentPage = 1
      this.getData(value)
    },
    handleSelectAll(selection: Object[]) {
      if (selection.length > 0) {
        this.selectRows = selection
      } else {
        this.selectRows = []
      }
    },
    handleSelectionChange(selection: Object[]) {
      this.selectRows = selection
    },
    filter(filters: any) {
      this.currentPage = 1
      _filter(filters, this.caseFilter, this.$route.path)
      this.initTableData()
    },
    refreshNode() {
      this.$emit('refresh')
    },
    save() {
      let body: RequestUpdateTestCasePlanCaseList = {
        operation: planOperationEnum.ADD,
        caseIds: this.selectRows.map((obj: { id: string }) => {
          return obj.id
        }),
        treeId: this.selectNode.id,
        projId: this.selectNode.id ? undefined : this.currentProject.id
      }
      testPlanApi.updateTestCasePlanCaseList(this.planId, body)
        .then(() => {
          this.close()
          this.$emit('refreshTable')
        })
    },
    close() {
      this.dialogVisible = false
    },
    changeProject(project: any) {
      this.currentProject = project
      testCaseApi.getTestCaseModules({projId: project.id})
        .then((data) => {
          this.treeNodes = data.data
        })
      this.selectNode = {}
      this.initTableData()
      // this.$emit('setProject', project.id)
      // 获取项目时刷新该项目模块
      // this.$emit('refreshNode')
    },
    nodeChange(node: typeNode) {
      // 重置分页
      this.currentPage = 1
      this.selectNode = node
      this.initTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";
@import "src/assets/css/utils";

.dialog-title {
  @extend %dialog-title
}

.tb-edit .el-input {
  display: none;
  color: black;
}

.tb-edit .current-row .el-input {
  display: block;

}

.tb-edit .current-row .el-input + span {
  display: none;

}

.node-tree {
  margin-right: 10px;
}

.el-header {
  background-color: darkgrey;
  color: #333;
  line-height: 60px;
}

.case-content {
  padding: 0 20px;
  height: 100%;
  /*border: 1px solid #EBEEF5;*/
}

.tree-aside {
  min-height: 300px;
  max-height: 100%;
}

.main-content {
  min-height: 300px;
  height: 100%;
  /*border: 1px solid #EBEEF5;*/
}

.project-link {
  float: right;
  margin-right: 12px;
  margin-bottom: 10px;
}

</style>
