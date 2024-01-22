<template>
  <div>
    <el-card class="card-content">
      <template slot="header">
        <table-header
          :condition="condition"
          create-tip="创建jira联动PR配置"
          placeholder="根据项目名称搜索"
          @create="handleAddOrEdit"
          @search="handleSearch"
        >
          <template slot="title">
            <div>jira联动PR配置</div>
          </template>
        </table-header>
      </template>
      <el-table ref="table" v-loading="loading" :data="tableData" @filter-change="filter">

        <!--  项目名称  -->
        <el-table-column label="项目名称" prop="project" show-overflow-tooltip/>

        <!--  激活状态  -->
        <el-table-column label="激活状态" prop="status"/>

        <!--  操作  -->
        <el-table-column :width="table2BtnWidth" label="操作">
          <template slot-scope="scope">
            <table-operator
              show-delete
              show-edit
              @deleteClick="handleDelete(scope.row)"
              @editClick="handleAddOrEdit(scope.row)"
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

    <el-dialog
      :close-on-click-modal="false"
      :title="operation === operationEnum.EDIT? '编辑jira联动PR配置' : '创建jira联动PR配置'"
      :visible.sync="dialogFormVisible"
      class="dialog-title"
      width="65%"
    >

      <el-form ref="prMergedPRForm" :model="form" :rules="rules">

        <el-row>
          <el-col :offset="1" :span="10">
            <el-form-item :label-width="formLabelWidth" label="项目" prop="project">
              <el-select v-model="form.project" filterable placeholder="请选择项目">
                <el-option
                  v-for="item in projectPathOptions"
                  :key="item.path"
                  :label="item.project"
                  :value="item.path"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item :label-width="formLabelWidth" label="开通" prop="isJiraActive">
              <el-switch
                v-model="form.isJiraActive"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <template slot="footer">
        <dialog-footer @cancel="dialogFormVisible = false" @confirm="saveConfig"/>
      </template>
    </el-dialog>
  </div>

</template>

<script lang="ts">
import {gitlabChatApi} from "@/api"
import {
  RequestCreateGitlabChatConfig,
  RequestGetGitlabChatConfigList,
  RequestUpdateGitlabChatConfig
} from "@/api/types/gitlab"
import {typeGitlabChatData} from "@/api/types/gitlabType"
import variables from "@/assets/css/utils.scss"
import DialogFooter from '@/common/components/DialogFooter.vue'
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import TableOperator from "@/common/components/TableOperator.vue"
import {_filter} from "@/common/utils"
import {PAGINATION_SIZE} from "@/constant"
import {operationEnum} from "@/constant/Gitlab"
import {planStageEnum} from "@/constant/TestPlan"
import {prMergedNotifyRules, prMergedPRForm} from "@/pages/testTools/form"
import {cloneDeep} from "lodash"

export default {
  name: "prMergeConfig",
  components: {
    TableOperator,
    TableHeader,
    TablePagination,
    DialogFooter,
  },
  data() {
    return {
      condition: {},
      operationEnum: operationEnum,
      planStageEnum: planStageEnum,
      tableData: [],
      currentPage: 1,
      pageSize: PAGINATION_SIZE.LARGE,
      total: 0,
      form: prMergedPRForm,
      rules: prMergedNotifyRules,
      dialogFormVisible: false,
      operation: '',
      projectPathOptions: [],
      isJiraActive: 1,
      status: ''
    }
  },
  computed: {
    formLabelWidth() {
      return '80px'
    },
    loading() {
      return this.$store.state.loading
    },
    table2BtnWidth() {
      return variables['table2BtnWidth']
    }
  },
  mounted() {
    this.initTableData()
  },
  methods: {
    initTableData() {
      this.setProjectPathOptions()
      this.getData()
    },
    setProjectPathOptions() {
      gitlabChatApi.getAllGitlabProjects()
        .then(({data}) => {
          this.projectPathOptions = data.data
        })
    },
    buildParams() {
      let body: RequestCreateGitlabChatConfig | RequestUpdateGitlabChatConfig = {
        project: this.form.project,
        isJiraActive: this.form.isJiraActive,
      }
      return body
    },
    getData(value?: string) {
      const params: RequestGetGitlabChatConfigList = {
        offset: this.pageSize * (this.currentPage - 1),
        limit: this.pageSize,
        project: value
      }

      this.configFilter = sessionStorage.getItem(this.$route.path)
      this.configFilter = this.configFilter ? JSON.parse(this.configFilter) : {}
      if (JSON.stringify(this.configFilter) !== "{}") {
        Object.assign(params, this.configFilter)
        this.$refs.table.columns.forEach((item: any) => {
          item.filteredValue = this.configFilter[item.columnKey]
        })
      }

      gitlabChatApi.getGitlabPRConfigList(params)
        .then(({data}) => {
          this.total = data.total
          this.tableData = data.data
          this.tableData.forEach((item: typeGitlabChatData) => {
            if(item.isJiraActive === 1) {
              item.status = "已激活"
            }else {
              item.status = "未激活"
            }
          })
        })
    },
    saveConfig() {
      this.$refs.prMergedPRForm.validate((valid: boolean) => {
        if (valid) {
          if (this.operation === operationEnum.ADD) {
            const body: RequestCreateGitlabChatConfig = this.buildParams()
            gitlabChatApi.createGitlabPRConfig(body)
              .then(() => {
                this.refresh()
              })
          } else if (this.operation === operationEnum.EDIT) {
            const body: RequestUpdateGitlabChatConfig = this.buildParams()
            gitlabChatApi.updateGitlabPRConfig(this.form.id, body)
              .then(() => {
                this.refresh()
              })
          }
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    handleAddOrEdit(gitlabChatConfig?: typeGitlabChatData) {
      console.log(gitlabChatConfig)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.prMergedPRForm) {
          this.$refs.prMergedPRForm.resetFields()
        }
        this.operation = operationEnum.ADD
        //修改
        if (gitlabChatConfig) {
          this.operation = operationEnum.EDIT
          this.form = cloneDeep(gitlabChatConfig)
          this.form.isJiraActive = String(this.form.isJiraActive)
        } else {
          this.form = prMergedPRForm
        }
        this.setProjectPathOptions()
      })
    },
    handleDelete(gitlabChatConfig: typeGitlabChatData) {
      this.$alert('确认删除该配置?', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            gitlabChatApi.deleteGitlabPRConfig(gitlabChatConfig.id)
              .then(() => {
                this.refresh()
              })
          }
        }
      })
    },
    handleSearch(value?: string) {
      this.currentPage = 1
      this.getData(value)
    },
    refresh() {
      this.initTableData()
    },
    filter(filters: any) {
      this.currentPage = 1
      _filter(filters, this.configFilter, this.$route.path)
      this.initTableData()
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/utils";

.card-content {
  overflow-y: auto;
}

.dialog-title {
  @extend %dialog-title;
}
</style>
