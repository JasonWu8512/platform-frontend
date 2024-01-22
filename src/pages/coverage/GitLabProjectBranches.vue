<template>
  <el-card>
    <template slot="header">
      <table-header :condition="condition"
                    create-tip="创建分支"
                    placeholder="(每次搜索只返回20条数据，请输入更精准的分支名称搜索)"
                    :showCreate="true"
                    :showSearch="true"
                    @create="dialogFormVisible = true"
                    @search="handleGetProjectBranches"
      >
        <template slot="title">
          <div>{{projectName}}的分支</div>
        </template>
      </table-header>

    </template>
    <el-table :data="tableData" size="medium" v-loading="tableLoading">
      <el-table-column prop="name" label="分支名"/>
      <el-table-column prop="commit.id" label="最新commit id"/>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <table-operator
            :show-delete="!scope.row.protected"
            @deleteClick="handleDeleteBranch(scope.row)"
          >
          </table-operator>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible"
               title="创建分支"
               width="50%"
               :close-on-click-modal="false">
      <el-form ref="branchForm" :model="branchForm" :rules="branchRules">
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="formLabelWidth" label="分支名" prop="branch">
              <el-input v-model="branchForm.branch" placeholder="请输入要创建的的分支名"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="ref分支" :label-width="formLabelWidth" prop="ref">
              <el-select
                v-model="branchForm.ref"
                filterable
                remote
                placeholder="请选择基于哪只分支创建新分支"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in options"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template slot="footer">
        <dialog-footer @cancel="dialogFormVisible = false" @confirm="handleCreateGitBranch"/>
      </template>
    </el-dialog>
  </el-card>

</template>

<script lang="ts">
import {coverageApi} from "@/api"
import variables from "@/assets/css/utils.scss"
import DialogFooter from "@/common/components/DialogFooter.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import TableOperator from "@/common/components/TableOperator.vue"

export default {
name: "GitLabProjectBranches",
  components: {TableHeader, TableOperator, DialogFooter},
  computed: {
    projectId() {
      return this.$route.query.projectId
    },
    projectName() {
      return this.$route.query.projectName
    },
    formLabelWidth() {
      return variables['formLabelWidth']
    },
    tableLoading() {
      return this.$store.state.loading
    },
  },
  data() {
  return {
    dialogFormVisible: false,
    condition: {},
    tableData: [],
    options: [],
    loading: false,
    branchForm: {
      ref: '',
      branch: ''
    },
    branchRules: {
      ref: [{required: true, message: '请选择基础分支', trigger: 'blur'}],
      branch: [{required: true, message: '请输入新分支名', trigger: 'blur'}]
    }
  }
  },
  mounted() {
  this.handleGetProjectBranches('')
  },
  methods: {
    remoteMethod(query?: string) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        coverageApi.getGitlabProjectBranches(this.projectId, {search: query}).then(res => {
          this.options = res.data
        })
      }, 300);

    },
    handleGetProjectBranches(value?: string) {
      coverageApi.getGitlabProjectBranches(this.projectId, {search: value}).then(res => {
        this.tableData = res.data
      })
    },
    handleCreateGitBranch(){
      coverageApi.createGitlabProjectBranch(this.projectId, this.branchForm).then(() => {
        this.dialogFormVisible = false
        this.handleGetProjectBranches()
      })
    },
    handleDeleteBranch(row?: any) {
      this.$alert('确认删除该分支?', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            coverageApi.deleteGitlabProjectBranch(this.projectId, {branch: row.name}).then(() => {
                this.handleGetProjectBranches()
              }
            )
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
