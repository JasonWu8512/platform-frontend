<template>
  <div>
    <el-card class="card-content">
      <template slot="header">
        <table-header
          :condition="condition"
          create-tip="创建PR合并通知群配置"
          placeholder="根据项目名称搜索"
          @create="handleAddOrEdit"
          @search="handleSearch"
        >
          <template slot="title">
            <div>PR合并通知配置</div>
          </template>
        </table-header>
      </template>
      <el-table ref="table" v-loading="loading" :data="tableData" @filter-change="filter">

        <!--  项目名称  -->
        <el-table-column label="项目名称" prop="project" show-overflow-tooltip/>

        <!--  源分支  -->
        <el-table-column label="源分支" prop="sourceBranch"/>

        <!--  目标分支  -->
        <el-table-column label="目标分支" prop="targetBranch"/>

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
      :title="operation === operationEnum.EDIT? '编辑PR合并群聊配置' : '创建PR合并群聊配置'"
      :visible.sync="dialogFormVisible"
      class="dialog-title"
      width="65%"
    >

      <el-form ref="prMergedNotifyForm" :model="form" :rules="rules">

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
            <el-form-item :label-width="formLabelWidth" label="源分支" prop="sourceBranch">
              <el-input v-model="form.sourceBranch" placeholder="请输入源分支名称"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :offset="1" :span="10">
            <el-form-item :label-width="formLabelWidth" label="目标分支" prop="targetBranch">
              <el-input v-model="form.targetBranch" placeholder="请输入目标分支名称"/>
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
import {prMergedNotifyForm, prMergedNotifyRules} from "@/pages/testTools/form"
import {cloneDeep} from "lodash"

export default {
  name: "prMergedNotify",
  data() {
    return {
      operationEnum: operationEnum,
      planStageEnum: planStageEnum,
      larkChatOptions: [],
      tableData: [],
      currentPage: 1,
      pageSize: PAGINATION_SIZE.LARGE,
      total: 0,
      form: prMergedNotifyForm,
      rules: prMergedNotifyRules,
      dialogFormVisible: false,
      operation: '',
      projectPathOptions: [],
      condition: {},
    }
  },
  components: {
    TableOperator,
    TableHeader,
    TablePagination,
    DialogFooter,
  },
  computed: {
    formLabelWidth() {
      return '80px'
    },
    chatOptions() {
      return this.$store.state.coverage.larkChats
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
    initOptions() {
      this.setProjectPathOptions()
      this.setLarkChatOptions()
    },
    initTableData() {
      this.initOptions()
      this.getData()
    },
    saveConfig() {
      this.$refs.prMergedNotifyForm.validate((valid: boolean) => {
        if (valid) {
          if (this.operation === operationEnum.ADD) {
            const body: RequestCreateGitlabChatConfig = this.buildParams()
            gitlabChatApi.createGitlabChatConfig(body)
              .then(() => {
                this.refresh()
              })
          } else if (this.operation === operationEnum.EDIT) {
            const body: RequestUpdateGitlabChatConfig = this.buildParams()
            gitlabChatApi.updateGitlabChatConfig(this.form.id, body)
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
    buildParams() {
      let body: RequestCreateGitlabChatConfig | RequestUpdateGitlabChatConfig = {
        project: this.form.project,
        sourceBranch: this.form.sourceBranch,
        targetBranch: this.form.targetBranch,
        chatId: this.form.chatId,
      }
      return body
    },
    setProjectPathOptions() {
      gitlabChatApi.getAllGitlabProjects()
        .then(({data}) => {
          this.projectPathOptions = data.data
        })
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

      gitlabChatApi.getGitlabChatConfigList(params)
        .then(({data}) => {
          this.total = data.total
          this.tableData = data.data
          this.tableData.forEach((item: typeGitlabChatData) => {
            let chat = this.chatOptions.find((s: {id: number}) => String(s.id) === item.chatId)
            item.chatName = chat.name
            item.chatLarkId = chat.chatId
          })
        })
    },
    handleAddOrEdit(gitlabChatConfig?: typeGitlabChatData) {
      console.log(gitlabChatConfig)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.prMergedNotifyForm) {
          this.$refs.prMergedNotifyForm.resetFields()
        }
        this.operation = operationEnum.ADD
        //修改
        if (gitlabChatConfig) {
          this.operation = operationEnum.EDIT
          this.form = cloneDeep(gitlabChatConfig)
        } else {
          this.form = prMergedNotifyForm
        }
        this.initOptions()
      })
    },
    handleDelete(gitlabChatConfig: typeGitlabChatData) {
      this.$alert('确认删除该配置?', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            gitlabChatApi.deleteGitlabChatConfig(gitlabChatConfig.id)
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
      console.log(this.larkChatOptions, this.chatOptions)
    }
  }
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
