<template>
  <div>
    <el-card class="card-content">
      <template slot="header">
        <table-header :condition="condition" :show-create="false" @search="handleSearch">
          <template slot="title">
            <div>用例评审</div>
          </template>
        </table-header>

      </template>
      <el-table
        ref="table"
        v-loading="loading"
        :data="tableData"
        @row-click="handleRun"
        @filter-change="filter"
      >

        <!--  评审名称  -->
        <el-table-column label="评审名称" prop="name" show-overflow-tooltip/>

        <!--  评审人  -->
        <el-table-column :filters="users" column-key="reviewer" label="评审人" prop="reviewerList">
          <template slot-scope="scope">
            <div>{{ scope.row.reviewerList.join() }}</div>
          </template>
        </el-table-column>

        <!--  所属项目  -->
        <el-table-column :filters="projects" column-key="projId" label="所属项目" prop="projName"/>

        <!--  发起人  -->
        <el-table-column :filters="users" column-key="creator" label="发起人" prop="creator"/>

        <!--  当前状态  -->
        <el-table-column :filters="reviewStatusOptions" column-key="status" label="当前状态">
          <template slot-scope="scope">
            <review-status-table-item :value="scope.row.status"/>
          </template>
        </el-table-column>

        <!--  创建时间  -->
        <el-table-column
          :width="tableTimeWidth"
          label="创建时间"
          prop="createdAt"
          show-overflow-tooltip
          sortable
        />

        <!--  截止时间  -->
        <el-table-column
          :width="tableTimeWidth"
          label="截止时间"
          prop="targetEnd"
          show-overflow-tooltip
          sortable
        >
          <template slot-scope="scope">
            <div>{{ scope.row.targetEnd || '-' }}</div>
          </template>
        </el-table-column>

        <!--  操作  -->
        <el-table-column :width="table2BtnWidth" label="操作">
          <template slot-scope="scope">
            <table-operator
              show-edit
              show-run
              @editClick="handleEdit(scope.row)"
              @runClick="handleRun(scope.row)"
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
  </div>
</template>

<script lang="ts">

import {testReviewApi} from "@/api"
import {RequestGetTestCaseReviewList} from "@/api/types/testReview"
import {typeReviewData} from "@/api/types/testReviewType"
import variables from "@/assets/css/utils.scss"
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import TableOperator from "@/common/components/TableOperator.vue"
import {_filter, formatTime} from "@/common/utils"
import {PAGINATION_SIZE} from "@/constant"
import {PathName} from "@/constant/routeData"
import {reviewStatusType} from "@/constant/TestReivew"
import ReviewStatusTableItem from "@/pages/track/common/tableItems/ReviewStatusTableItem.vue"

// 评审状态
const reviewStatusOptions = Object.entries(reviewStatusType).map(([value, text]) => {
  return {text: text, value: value}
})

export default {
  name: "TestCaseReviewList",
  components: {
    ReviewStatusTableItem,
    TableOperator,
    TablePagination,
    TableHeader,
  },
  data() {
    return {
      reviewStatusOptions: reviewStatusOptions,
      tableData: [],
      projects: this.projects,
      users: this.users,
      currentPage: 1,
      pageSize: PAGINATION_SIZE.LARGE,
      total: 0,
      caseFilter: {},
    }
  },
  props: {
    currentProject: Object,
    treeNodes: Array,
    selectNode: Object,
    selectParentNodes: Array,
    condition: Object,
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    table2BtnWidth() {
      return variables['table2BtnWidth']
    },
    tableTimeWidth() {
      return variables['tableTimeWidth']
    }
  },
  inject: ['projects', 'users'],
  mounted() {
    this.initTableData()
  },
  methods: {
    setSelectOptions() {
      this.setReviewerOptions()
      this.$emit("update:condition", this.condition)
    },
    initTableData() {
      this.setSelectOptions()
      this.getData()
    },
    getData(value?: string) {
      const params: RequestGetTestCaseReviewList = {
        name: value,
        offset: this.pageSize * (this.currentPage - 1),
        limit: this.pageSize,
      }

      this.caseFilter = sessionStorage.getItem(this.$route.path)
      this.caseFilter = this.caseFilter ? JSON.parse(this.caseFilter) : {}
      if (JSON.stringify(this.caseFilter) !== "{}") {
        Object.assign(params, this.caseFilter)
        this.$refs.table.columns.forEach((item: any) => {
          item.filteredValue = this.caseFilter[item.columnKey]
        })
      }

      testReviewApi.getTestCaseReviewList(params)
        .then(({data}) => {
          this.total = data.total
          this.tableData = data.data
          this.tableData.forEach((item: typeReviewData) => {
            item.projName = this.projects.find((project: any) => project.key === item.projKey).name
            item.reviewerList = item.reviewerList || []
            item.createdAt = formatTime(item.createdAt)
            item.targetEnd = formatTime(item.targetEnd)
          })
        })
    },
    filter(filters: any) {
      this.currentPage = 1
      _filter(filters, this.caseFilter, this.$route.path)
      this.initTableData()
    },
    handleSearch(value?: string) {
      this.getData(value)
    },
    handleEdit(caseReview: typeReviewData) {
      this.$eventBus.$emit('caseReviewEdit', caseReview)
    },
    setReviewerOptions() {
      this.condition.reviewerOptions = this.users
    },
    handleRun(caseReview: typeReviewData) {
      this.$router.push({
        name: PathName.TestTrackCaseReviewView,
        params: {reviewId: caseReview.id},
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
