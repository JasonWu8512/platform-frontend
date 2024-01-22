<template>
  <div>
    <el-card class="card-content">
      <template slot="header">
        <table-header
          :condition="condition"
          create-tip="apollo通知配置-出海"
          placeholder="根据项目名称搜索"
          @create="openEditIntl"
          @search="handleSearchIntl"
        >
          <template slot="title">
            <div>apolloIntl通知配置-出海</div>
          </template>
        </table-header>
      </template>
      <el-table ref="table" v-loading="loading" :data="tableData">

        <!--  项目名称  -->
        <el-table-column label="应用" prop="appId"/>

        <!--  群聊  -->
        <el-table-column label="群聊" prop="chatName"/>

        <!--  操作  -->
        <el-table-column :width="table2BtnWidth" label="操作">
          <template slot-scope="scope">
            <table-operator
              show-delete
              show-edit
              @deleteClick="handledeleteIntl(scope.row)"
              @editClick="openEditIntl(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <table-pagination
        :change="getTableDataIntl"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :total="total"
      />
    </el-card>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      class="dialog-title"
      width="65%"
    >
      <template slot="title">
        <div style="text-align: left;">
          <span>{{ operation === operationEnum.EDIT? '编辑apollo通知配置' : '创建apollo通知配置' }}</span>
        </div>
        <el-divider style="width: 100%;"></el-divider>
      </template>

      <el-form ref="apolloIntlNotifyForm" :model="appChatForm" :rules="appChatRules" :label-width="formLabelWidth">
        <el-row>
          <el-col :offset="1" :span="10">
            <el-form-item label="应用" prop="appId">
              <el-select v-model="appChatForm.appId" filterable placeholder="请选择应用" style="width: 100%">
                <el-option
                  v-for="item in appOptions"
                  :key="item.id"
                  :label="item.appId"
                  :value="item.appId"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="推送群聊" prop="chatId">
              <el-select
                v-model="appChatForm.chatId"
                filterable
                placeholder="请选择需要通知的群"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in chatOptions"
                  :key="item.chatId"
                  :label="item.name"
                  :value="item.chatId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template slot="footer">
        <dialog-footer @cancel="dialogFormVisible = false" @confirm="saveConfigIntl"/>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import variables from "@/assets/css/utils.scss"
import {dataToolApi} from "@/api";
import {cloneDeep} from "lodash"
import TableOperator from "@/common/components/TableOperator";
import TableHeader from "@/common/components/TableHeader";
import TablePagination from "@/common/components/pagination/TablePagination";
import DialogFooter from "@/common/components/DialogFooter";
import {operationEnum} from "@/constant/Gitlab";
import {PAGINATION_SIZE} from "@/constant";
export default {
  name: "apolloIntlNotify",
  components: {
    TableOperator,
    TableHeader,
    TablePagination,
    DialogFooter,
  },
  data() {
    return {
      operationEnum: operationEnum,
      dialogFormVisible: false,
      condition: {},
      operation: '',
      tableData: [],
      currentPage: 1,
      pageSize: PAGINATION_SIZE.LARGE,
      total: 0,
      appOptions: [],
      appChatForm:{
        appId: '',
        chatId: ''
      },
      appChatRules: {
        appId: [{required: true, message: '请选择应用', trigger: 'blur'}],
        chatId: [{required: true, message: '请选择通知群聊', trigger: 'blur'}],
      }
    }
  },
  computed: {
    formLabelWidth() {
      return variables['formLabelWidth']
    },
    loading() {
      return this.$store.state.loading
    },
    chatOptions() {
      return this.$store.state.coverage.larkChats
    },
    table2BtnWidth() {
      return variables['table2BtnWidth']
    },

  },
  mounted() {
    this.getAllIntlApps()
    this.getTableDataIntl()
  },
  methods: {
    getAllIntlApps() {
      dataToolApi.getApolloIntlApps().then(res => {
        this.appOptions = res.data
      })
    },
    openEditIntl(row) {
      this.dialogFormVisible = true
      this.operation = operationEnum.ADD
      this.appChatForm = {
        appId: '',
        chatId: ''
      }
      if (row) {
        this.operation = operationEnum.EDIT
        this.appChatForm = cloneDeep(row)
      }
    },
    getTableDataIntl(value) {
      const params = {
        offset: this.pageSize * (this.currentPage - 1),
        limit: this.pageSize,
        search: value ? value : ''
      }
      dataToolApi.getApolloIntlAppChat(params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    saveConfigIntl() {
      if (this.operation === operationEnum.ADD){
        dataToolApi.createApolloIntlAppChat(this.appChatForm).finally(() => {
          this.dialogFormVisible = false
          this.getTableDataIntl()
        })
      } else {
        dataToolApi.updateApolloIntlAppChat(this.appChatForm, this.appChatForm['id']).finally(() => {
          this.dialogFormVisible = false
          this.getTableDataIntl()
        })
      }
    },
    handledeleteIntl(row) {
      this.$alert('确认删除该配置?', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action) => {
          if (action === 'confirm') {
            dataToolApi.deleteApolloIntlAppChat(row.id)
              .then(() => {
                this.getTableDataIntl()
              })
          }
        }
      })
    },
    handleSearchIntl(value) {
      this.currentPage = 1
      this.getTableDataIntl(value)
    }

  }
}
</script>

<style scoped>

</style>
