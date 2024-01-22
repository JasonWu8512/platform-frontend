<template>
  <el-card>
    <template slot="header">
      <table-header :condition="condition"
                    create-tip="创建流水线"
                    placeholder="根据job名称搜索"
                    :showCreate="false"
                    :showSearch="pipelineId === ''"
                    @search="handleGetDeployRecord"
      >
        <template slot="title">
          <div>服务端发版记录</div>
        </template>
      </table-header>

    </template>
    <el-table :data="tableData" size="medium">
      <el-table-column prop="jobName" label="job名称" width="300"/>
      <el-table-column prop="username" label="触发者"/>
      <el-table-column prop="buildId" label="构建号"/>
      <el-table-column prop="createdAt" label="构建时间">
        <template v-slot:default="scope">
          <span>{{new Date(scope.row.createdAt).format('yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="commitId" label="构建分支/commitId"/>
      <el-table-column prop="status" label="构建状态">
        <template v-slot:default="scope">
          <el-tag :type="tagType(scope.row)" effect="dark">{{scope.row.statusChinese}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <table-pagination
      :change="getDeployRecord"
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
  name: "DeployServerRecord",
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
    this.getDeployRecord()
  },
  methods: {
    tagType(row: any){
      if (row.status === 'success') {
        return 'success'
      }else if(row.status === 'running') {
        return 'info'
      }else if(row.status === 'pending') {
        return ''
      }else if(row.status === 'fail') {
        return 'danger'
      }
    },
    getDeployRecord(value?: string) {
      const params = {
        offset: this.pageSize * (this.currentPage - 1),
        limit: this.pageSize,
        jobName: value,
        pipelineId: this.pipelineId
      }
      coverageApi.getServerJenkinsDeployHistory(params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    handleGetDeployRecord(value? :string) {
      this.currentPage = 1
      this.getDeployRecord(value)
    }
  }
}
</script>

<style scoped>

</style>
