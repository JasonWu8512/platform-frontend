<template>
  <el-card>
    <template slot="header">
      <table-header :condition="condition"
                    placeholder="根据配置名称搜索"
                    :showCreate="false"
                    :showSearch="configId === ''"
                    @search="handleGetBuildRecord"
      >
        <template slot="title">
          <div>执行记录</div>
        </template>
      </table-header>
    </template>
    <el-table :data="tableData" size="medium">
      <el-table-column prop="id" label="构建id"/>
      <el-table-column prop="autoConfigName" label="配置名称"/>
      <el-table-column prop="username" label="触发者"/>
      <el-table-column prop="createdAt" label="构建时间">
        <template v-slot:default="scope">
          <span>{{new Date(scope.row.createdAt).format('yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="构建状态">
        <template v-slot:default="scope">
          <el-tag :type="tagType(scope.row)" effect="dark">{{scope.row.statusChinese}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="mark" label="备注"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <table-operator
            report-tip="allure报告"
            show-report
            @reportClick="handleToAllureReport(scope.row)"
          >
          </table-operator>
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
import {autoApi} from "@/api"
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import  TableOperator from "@/common/components/TableOperator.vue"
import {PAGINATION_SIZE} from "@/constant"
import {PathName} from "@/constant/routeData"

export default {
name: "AutoConfigBuildRecord",
  components: {TablePagination, TableHeader, TableOperator},
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
  computed: {
    configId() {
      return this.$route.params.configId ? this.$route.params.configId : ''
    }
  },
  mounted() {
    this.getBuildRecord()
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
    getBuildRecord(value?: string) {
      const params = {
        offset: this.pageSize * (this.currentPage - 1),
        limit: this.pageSize,
        configName: value,
        configId: this.configId
      }
      autoApi.getAutoRunHistory(params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    handleGetBuildRecord(value?: string) {
      this.currentPage = 1
      this.getBuildRecord(value)
    },
    handleToAllureReport(row?: any) {
      this.$router.push({
        name: PathName.AutoCaseReport,
        params: {
          historyId: row.id
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
