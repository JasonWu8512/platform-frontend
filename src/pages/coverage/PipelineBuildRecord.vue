<template>
  <el-card>
    <template slot="header">
      <table-header :condition="condition"
                    create-tip="创建流水线"
                    placeholder="根据流水线名称搜索"
                    :showCreate="false"
                    :showSearch="pipelineId === ''"
                    @search="handleGetBuildRecord"
      >
        <template slot="title">
          <div>覆盖率构建记录</div>
        </template>
      </table-header>

    </template>
<!--    <div slot="header" class="title">-->
<!--      <span>流水线构建记录</span>-->
<!--    </div>-->
    <el-table :data="tableData" size="medium">
      <el-table-column prop="id" label="构建id"/>
      <el-table-column prop="pipelineName" label="流水线名称"/>
      <el-table-column prop="username" label="触发者"/>
      <el-table-column prop="createdAt" label="构建时间">
        <template v-slot:default="scope">
          <span>{{new Date(scope.row.createdAt).format('yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endCommit" label="构建分支"/>
      <el-table-column prop="compareBranch" label="对比分支"/>
      <el-table-column prop="buildStatus" label="构建状态">
        <template v-slot:default="scope">
          <el-tag :type="tagType(scope.row)" effect="dark">{{scope.row.statusChinese}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="增量覆盖率报告">
        <template slot-scope="scope">
          <el-link :href="scope.row['diffCoverageReport']" type="danger" target="_blank">{{scope.row['diffCoverageReport'] ? scope.row['endCommit'] + "增量报告": null}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="全量覆盖率报告">
        <template slot-scope="scope">
          <el-link :href="scope.row['fullCoverageReport']" type="primary" target="_blank">{{scope.row['fullCoverageReport'] ? scope.row['endCommit'] + "全量报告": null}}</el-link>
        </template>
      </el-table-column>
    </el-table>
    <table-pagination
      :change="getBuildRecord"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="total"
    />
  </el-card>

</template>

<script lang="ts">
import {coverageApi} from "@/api"
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import {PAGINATION_SIZE} from "@/constant"

export default {
name: "PipelineBuildRecord",
  data() {
    return {
      condition: {},
      total: 0,
      pageSize: PAGINATION_SIZE.LARGE,
      currentPage: 1,
      tableData: [],
      userPipelineId: true,
    }
  },
  components: {TablePagination, TableHeader},
  computed: {
    pipelineId() {
      return this.$route.params.pipelineId ? this.$route.params.pipelineId : ''
    }
  },
  mounted() {
    this.getBuildRecord()
  },
  methods: {
    tagType(row: any){
      if (row.buildStatus === 'success') {
        return 'success'
      }else if(row.buildStatus === 'running') {
        return 'info'
      }else if(row.buildStatus === 'pending') {
        return ''
      }else if(row.buildStatus === 'fail') {
        return 'danger'
      }
    },
    getBuildRecord(value?: string) {
      const params = {
        offset: this.pageSize * (this.currentPage - 1),
        limit: this.pageSize,
        pipelineName: value,
        pipelineId: this.pipelineId
      }
      coverageApi.getJenkinsTasksHistory(params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    handleGetBuildRecord(value?: string) {
      this.currentPage = 1
      this.getBuildRecord(value)
    }
  }
}
</script>

<style scoped>

</style>
