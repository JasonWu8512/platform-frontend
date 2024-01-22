<template>
  <el-card class="card-content" >
    <template slot="header">
      <table-header :condition="condition"
                    create-tip="创建自动化配置"
                    @create="handleAddOrEdit"
                    @search="handlePollingDataList"
      >
        <template slot="title">
          <div>接口自动化配置</div>
        </template>
      </table-header>

    </template>

    <el-table :data="tableData" size="medium" v-loading="loading && noPolling">
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="环境" prop="execEnv"/>
      <el-table-column label="流水线" prop="pipelineIds"/>
      <el-table-column label="创建者" prop="creator"/>
      <el-table-column label="定时表达式" prop="crontabSchedule"/>
      <el-table-column label="定时执行" prop="enableAutoTrigger">
        <template v-slot:default="scope">
          <span>{{scope.row.enableAutoTrigger? '是': '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <table-operator
            copy-tip="执行记录"
            show-copy
            show-delete
            show-edit
            show-run
            :run-tip="scope.row.status === 'running' ? '正在执行': '执行'"
            @copyClick="handleToBuildRecord(scope.row)"
            @deleteClick="handleDelete(scope.row)"
            @editClick="handleAddOrEdit(scope.row)"
            @runClick="handleRun(scope.row)"
            :runDisable="scope.row.status === 'running'"
          >
          </table-operator>
        </template>
      </el-table-column>

    </el-table>
    <table-pagination
      :change="getAutoConfigList"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="total"
    />
    <auto-config-edit ref="edit" @fatherMethod="getAutoConfigList"></auto-config-edit>

  </el-card>
</template>

<script lang="ts">
import {autoApi} from "@/api"
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import TableOperator from "@/common/components/TableOperator.vue"
import {PAGINATION_SIZE} from "@/constant"
import {PathName} from "@/constant/routeData"
import AutoConfigEdit from "@/pages/auto/components/AutoConfigEdit.vue"
export default {
name: "AutoConfigList",
  components: {TableHeader, TablePagination, TableOperator, AutoConfigEdit},
  data() {
  return {
    noPolling: true,
    createVisible: false,
    condition: {},
    total: 0,
    pageSize: PAGINATION_SIZE.LARGE,
    currentPage: 1,
    tableData: []
  }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
  },
  mounted() {
    this.pollingDataList()
  },
  destroyed() {
    clearInterval(this.myInterval)
  },
  methods: {
    getAutoConfigList(value?: string) {
      const params = {
        limit: this.pageSize,
        offset: this.pageSize * (this.currentPage - 1),
        name: value
      }
      autoApi.getAutoCaseConfigList(params).then(
        res => {
          this.tableData = res.data.data
          this.total = res.data.total
          this.noPolling = true
        }
      )
    },
    pollingDataList(value?: string) {
      this.getAutoConfigList(value)
      clearInterval(this.myInterval)
      this.myInterval = window.setInterval(() => {
        setTimeout(() => {
          this.noPolling = false
          this.getAutoConfigList(value)
        }, 1)
      }, 3000)
    },
    handlePollingDataList(value?: string) {
      this.currentPage = 1
      this.pollingDataList(value)
    },
    handleAddOrEdit(pipeline?: any) {
      this.$nextTick(function () {
        // DOM 现在更新了
        this.$refs.edit.open(pipeline)
      })
    },
    // 删除流水线
    handleDelete(row?: any) {
      this.$alert('确认删除自动化配置?', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            autoApi.deleteAutoConfig(row.id).then(() => {
                this.getAutoConfigList()
              }
            )
          }
          }
        })
    },
    handleToBuildRecord(row?: any) {
      this.$router.push({
        name: PathName.AutoCaseBuildRecordByConfigId,
        params: {
          configId: row.id
        }
      })
    },
    handleRun(row?: any) {
      this.$alert('确定执行该自动化配置?', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            autoApi.runAutoConfig(row.id).then()
          }
      }
    })
    }
  }

}
</script>

<style scoped>

</style>
