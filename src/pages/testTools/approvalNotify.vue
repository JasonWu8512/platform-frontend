<template>
  <div>
    <el-card class="card-content">
      <template slot="header">
        <table-header
          :condition="condition"
          create-tip="审批流通知配置"
          placeholder="根据项目名称搜索"
          @create="handleAddOrEdit"
          @search="handleSearch"
        >
          <template slot="title">
            <div>审批流通知配置</div>
          </template>
        </table-header>
      </template>
      <el-table ref="table" v-loading="loading" :data="tableData" @filter-change="filter">

        <!--  项目名称  -->
        <el-table-column label="项目名称" prop="project" show-overflow-tooltip/>

        <!--  群聊  -->
        <el-table-column :filters="larkChatOptions" column-key="chatId" label="群聊" prop="chatName"/>

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
      :title="operation === operationEnum.EDIT? '编辑审批流通知配置' : '创建审批流通知配置'"
      :visible.sync="dialogFormVisible"
      class="dialog-title"
      width="65%"
    >

      <el-form ref="approvalNotifyForm" :model="form" :rules="rules">
        <el-row>
          <el-col :offset="1" :span="10">
            <el-form-item :label-width="formLabelWidth" label="项目" prop="project">
              <el-select v-model="form.project" filterable placeholder="请选择项目">
                <el-option
                  v-for="item in jiraProjectOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item :label-width="formLabelWidth" label="推送群聊" prop="chatId">
              <el-select
                v-model="form.chatId"
                filterable
                placeholder="请选择需要通知的群"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in larkChatOptions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
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
import {approvalApi} from "@/api"
import {
  RequestCreateApprovalChatConfig,
  RequestGetApprovalChatConfigList,
  RequestUpdateApprovalChatConfig,
  typeApprovalChatData
} from "@/api/types/approval"
import variables from "@/assets/css/utils.scss"
import DialogFooter from '@/common/components/DialogFooter.vue'
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import TableOperator from "@/common/components/TableOperator.vue"
import {_filter} from "@/common/utils"
import {PAGINATION_SIZE} from "@/constant"
import {operationEnum} from "@/constant/Gitlab"
import {planStageEnum} from "@/constant/TestPlan"
import {approvalNotifyForm, approvalNotifyRules} from "@/pages/testTools/form"
import {cloneDeep} from "lodash"

export default {
  name: "approvalNotify",
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
      form: approvalNotifyForm,
      rules: approvalNotifyRules,
      dialogFormVisible: false,
      larkChatOptions: [],
      operation: '',
    }
  },
  computed: {
    formLabelWidth() {
      return variables['formLabelWidth']
    },
    loading() {
      return this.$store.state.loading
    },
    jiraProjectOptions() {
      return this.$store.state.jira.projects
    },
    chatOptions() {
      return this.$store.state.coverage.larkChats
    },
    table2BtnWidth() {
      return variables['table2BtnWidth']
    }
  },
  mounted() {
    this.initTableData()
  },
  methods: {
    initOptions() {
      this.setLarkChatOptions()
    },
    initTableData() {
      this.initOptions()
      this.getData()
    },
    buildParams() {
      let body: RequestCreateApprovalChatConfig | RequestUpdateApprovalChatConfig = {
        project: this.form.project,
        chatId: this.form.chatId,
      }
      return body
    },
    getData(value?: string) {
      const params: RequestGetApprovalChatConfigList = {
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

      approvalApi.getApprovalChatConfig(params)
        .then(({data}) => {
          this.total = data.total
          this.tableData = data.data
          this.tableData.forEach((item: typeApprovalChatData) => {
            item.chatName = this.chatOptions.find((s: { id: number }) => String(s.id) === item.chatId).name
            item.project = this.jiraProjectOptions.find((s: { id: string }) => s.id === item.project).name
          })
        })
    },
    saveConfig() {
      this.$refs.approvalNotifyForm.validate((valid: boolean) => {
        if (valid) {
          if (this.operation === operationEnum.ADD) {
            const body: RequestCreateApprovalChatConfig = this.buildParams()
            approvalApi.createApprovalChatConfig(body)
              .then(() => {
                this.refresh()
              })
          } else if (this.operation === operationEnum.EDIT) {
            const body: RequestUpdateApprovalChatConfig = this.buildParams()
            approvalApi.updateApprovalChatConfig(this.form.id, body)
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
    handleAddOrEdit(approvalChatConfig?: typeApprovalChatData) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.approvalNotifyForm) {
          this.$refs.approvalNotifyForm.resetFields()
        }
        this.operation = operationEnum.ADD
        //修改
        if (approvalChatConfig) {
          this.operation = operationEnum.EDIT
          this.form = cloneDeep(approvalChatConfig)
          this.form.isActive = String(this.form.isJiraActive)
        } else {
          this.form = approvalNotifyForm
        }
      })
    },
    handleDelete(approvalChatConfig: typeApprovalChatData) {
      this.$alert('确认删除该配置?', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            approvalApi.deleteApprovalChatConfig(approvalChatConfig.id)
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
    setLarkChatOptions() {
      // 群聊筛选
      this.larkChatOptions = Object.entries(this.chatOptions).map(([key, value]) => {
        // @ts-ignore
        return {text: value.name, value: String(value.id), key: key}
      })
    }
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
