<template>
  <el-card class="card-content">
    <template slot="header">
      <table-header :condition="condition"
                    create-tip="创建流水线"
                    @create="handleAddOrEdit"
                    @search="handlePollingDataList"
      >
        <template slot="title">
          <div>覆盖率流水线</div>
        </template>
      </table-header>

    </template>

    <el-table :data="tableDatas" size="medium" v-loading="loading && noPolling" @filter-change="filter" ref="pipelineTable">
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="服务名" prop="projectName"/>
      <el-table-column label="业务线" prop="business" :filters="businessOptions" column-key="business">
        <template slot-scope="scope"><span>{{ businessType[scope.row.business] }}</span></template>
      </el-table-column>
      <el-table-column label="技术端" prop="terminal" :filters="terminalOptions" column-key="terminal">
        <template slot-scope="scope"><span>{{ terminalType[scope.row.terminal] }}</span></template>
      </el-table-column>
      <el-table-column label="最近构建commitId" prop="endCommit"/>
      <el-table-column label="流水线">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center">
          <el-tooltip effect="dark" placement="bottom" class="tooltipSize">
            <div v-if="scope.row['deployStatus'] === 'fail'" slot="content" style="line-height: 20px">
              {{ scope.row['step1'] }} : {{ scope.row['deployStatus'] }} <br/>
              失败原因: {{ scope.row['reason']['deploy'] }} <br/>
            </div>
            <div v-else slot="content" style="line-height: 20px">
              {{ scope.row['step1'] }} : {{ scope.row['deployStatus'] }} <br/>
            </div>
            <el-popover v-model="scope.row.visible"
                        placement="bottom"
                        trigger="click"
                        width="160"
                        >

                <a @click="handleToBuildConsole(scope.row, 'deploy')">
                  <i :class="pipelineIcon(scope.row['deployStatus'])" style="font-size: 20px"></i>
                </a>
                  <el-tooltip content="run/retry" effect="dark" placement="top">
                    <el-button :disabled="scope.row['deployStatus'] === 'running' || scope.row['coverageStatus'] === 'running'" circle
                               icon="el-icon-refresh"
                               style="float: right; height: 20px; width: 20px; padding: 2px"
                               @click="openCommitDialog(scope.row)"></el-button>
                  </el-tooltip>
              <i slot="reference" :class="pipelineIcon(scope.row['deployStatus'])" v-if="Boolean(scope.row['step1'])"></i>
            </el-popover>
          </el-tooltip>
          <div style="height: 2px;background: #c0c4cc; width: 10px; position: center" v-if="Boolean(scope.row['step1']) && Boolean(scope.row['step2'])"/>
          <el-tooltip effect="dark" placement="bottom" class="tooltipSize">
            <div v-if="scope.row['coverageStatus'] === 'fail'" slot="content" style="line-height: 20px">
              {{ scope.row['step2'] }} : {{ scope.row['coverageStatus'] }} <br/>
              失败原因: + {{ scope.row['reason']['coverage'] }} <br/>
            </div>
            <div v-else slot="content" style="line-height: 20px">
              {{ scope.row['step2'] }} : {{ scope.row['coverageStatus'] }} <br/>
            </div>
            <el-popover v-model="scope.row.visible2"
                        placement="bottom"
                        width="160">
              <a @click="handleToBuildConsole(scope.row, 'coverage')">
                <i :class="pipelineIcon(scope.row['coverageStatus'])" style="font-size: 20px"></i>
              </a>
                <el-tooltip content="run/retry" effect="dark" placement="top">
                  <el-button :disabled="scope.row['deployStatus'] === 'running' || scope.row['coverageStatus'] === 'running'" circle
                             icon="el-icon-refresh"
                             style="float: right; height: 20px; width: 20px; padding: 2px;"
                             @click="openMergeDialog(scope.row)"></el-button>
                </el-tooltip>
              <i slot="reference" :class="pipelineIcon(scope.row['coverageStatus'])" v-if="Boolean(scope.row['step2'])"></i>
            </el-popover>
          </el-tooltip>
          </div>
        </template>

      </el-table-column>
      <el-table-column prop="projectName" label="代码检查结果">
        <template slot-scope="scope">
          <div v-if="scope.row.sonarStatus === 'running'">
            <i class="el-icon-loading" style="font-size: 25px"></i>
          </div>
          <div v-else-if="scope.row.sonarStatus === 'fail'" style="color: red">
            sonar执行失败请重试
          </div>
          <div v-else>
            <a :href="'http://sonar.jlgltech.com/dashboard?id='+scope.row.projectName" target="_blank">
              {{scope.row.name}}</a>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" :width="table5BtnWidth">
        <template slot-scope="scope">
          <table-operator
            copy-tip="覆盖率构建记录"
            show-sonar
            show-copy
            show-delete
            show-edit
            show-run
            runIcon="el-icon-more"
            run-tip="查看服务构建记录"
            :sonar-disable="scope.row.sonarStatus === 'running'"
            @copyClick="handleToBuildRecord(scope.row)"
            @deleteClick="handleDelete(scope.row)"
            @editClick="handleAddOrEdit(scope.row)"
            @runClick="handleToServerDeployHistory(scope.row)"
            @sonarClick="openSonarDialog(scope.row)"
          >
          </table-operator>


        </template>
      </el-table-column>

    </el-table>
    <table-pagination
      :change="pollingDataList"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="total"
    />
    <pipeline-edit ref="edit" @fatherMethod="pollingDataList"></pipeline-edit>
    <el-dialog :visible.sync="dialogFormVisible"
               title="发版参数"
               width="50%"
               :close-on-click-modal="false">
      <el-form ref="commitForm" :model="commitForm" :rules="commitRules">
        <el-form-item label-width="160px" label="branch or commitId" prop="commitId">
          <el-input v-model="commitForm.commitId" placeholder="请输入要构建的分支/commitId"/>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <dialog-footer @cancel="dialogFormVisible = false" @confirm="handleTriggerDeployServe"/>
      </template>
    </el-dialog>
    <el-dialog :visible.sync="sonarFormVisible"
               title="sonar参数"
               width="50%"
               :close-on-click-modal="false">
      <el-form ref="sonarForm" :model="commitForm" :rules="commitRules">
        <el-form-item label-width="160px" label="branch or commitId" prop="commitId">
          <el-input v-model="commitForm.commitId" placeholder="请输入要构建的分支/commitId"/>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <dialog-footer @cancel="sonarFormVisible = false" @confirm="triggerSonar"/>
      </template>
    </el-dialog>
    <el-dialog :visible.sync="compareFormVisible" title="增量覆盖率参数" width="50%" :close-on-click-modal="false">
      <el-form ref="mergeForm" :model="compareForm">
        <el-form-item label-width="80px" label="对比分支" prop="compareBranch">
          <el-input v-model="compareForm.compareBranch" placeholder="请输入对比分支，不输入默认origin/master"/>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <dialog-footer @cancel="compareFormVisible = false" @confirm="handleTriggerCoverage"/>
      </template>

    </el-dialog>

  </el-card>

</template>

<script lang="ts">
import {coverageApi} from "@/api"
import variables from "@/assets/css/utils.scss"
import DialogFooter from '@/common/components/DialogFooter.vue'
import TablePagination from "@/common/components/pagination/TablePagination.vue"
import TableHeader from "@/common/components/TableHeader.vue"
import TableOperator from "@/common/components/TableOperator.vue"
import {PAGINATION_SIZE} from "@/constant"
import {PathName} from "@/constant/routeData"
import PipelineEdit from "@/pages/coverage/components/PipelineEdit.vue"
import {businessType, terminalType} from "@/constant/Coverage";
import {_filter} from "@/common/utils"
// 业务线
const businessOptions = Object.entries(businessType).map(([value, text]) => {
  return {text: text, value: value}
})
// 端
const terminalOptions = Object.entries(terminalType).map(([value, text]) => {
  return {text: text, value: value}
})

export default {
  name: "PipeLine",
  components: {TableHeader, TablePagination, TableOperator, PipelineEdit, DialogFooter},
  props: {},
  data() {
    return {
      businessType: businessType,
      terminalType: terminalType,
      terminalOptions: terminalOptions,
      businessOptions: businessOptions,
      noPolling: true,
      sonarFormVisible: false,
      dialogFormVisible: false,
      compareFormVisible: false,
      condition: {},
      total: 0,
      pageSize: PAGINATION_SIZE.LARGE,
      currentPage: 1,
      searchName: '',
      tableDatas: [],
      commitForm: {
        commitId: '',
      },
      compareForm: {
        compareBranch: ''
      },
      commitRules: {commitId: [{required: true, message: '请输入commitId', trigger: 'blur'}]},
      pipelineFilters: {}
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    table5BtnWidth() {
      return variables['table5BtnWidth']
    },
  },

  destroyed() {
    clearInterval(this.myInterval)
  },
  mounted() {
    this.pollingDataList()
  },
  methods: {
    filter(filters: any) {
      this.noPolling = true
      this.currentPage = 1
      _filter(filters, this.pipelineFilters, this.$route.path)
      this.pollingDataList()
    },
    pipelineIcon(status?: string) {
      if (status === 'success') {
        return 'el-icon-circle-check iconSize success'
      } else if (status === 'pending') {
        return 'el-icon-video-pause iconSize pending'
      } else if (status === 'running') {
        return 'el-icon-loading iconSize running'
      } else if (status === 'fail') {
        return 'el-icon-circle-close iconSize fail'
      } else if (status === 'skip') {
        return 'el-icon-warning-outline iconSize skip'
      }
    },
    getPipelineList(value?: string) {
      const params = {
        limit: this.pageSize,
        offset: this.pageSize * (this.currentPage - 1),
        name: value
      }
      this.pipelineFilters = sessionStorage.getItem(this.$route.path) || "{}"
      this.pipelineFilters = JSON.parse(this.pipelineFilters)
      // console.log('params', typeof this.pipelineFilters)
      Object.assign(params, this.pipelineFilters)
      this.$refs.pipelineTable.columns.forEach((item: any) => {
        item.filteredValue = this.pipelineFilters[item.columnKey]
      })
      coverageApi.getPipelineList(params).then(res => {
        this.tableDatas = res.data.data
        this.tableDatas.forEach(function (item: any) {
          item.visible = false
          item.visible2 = false
        })
        this.total = res.data.total
        this.noPolling = true
      })
    },
    pollingDataList(value?: string) {
      this.getPipelineList(value)
      clearInterval(this.myInterval)
      this.myInterval = window.setInterval(() => {
        setTimeout(() => {
          this.noPolling = false
          this.getPipelineList(value)
        }, 1)
      }, 10000)
    },
    handlePollingDataList(value?: string) {
      this.currentPage = 1
      this.pollingDataList(value)
    },
    handleToBuildRecord(row?: any) {
      this.$router.push({
        name: PathName.PipelineBuildRecordByPipelineId,
        params: {
          pipelineId: row.id
        }
      })
    },
    handleAddOrEdit(pipeline?: any) {
      this.$nextTick(function () {
        // DOM 现在更新了
        this.$refs.edit.open(pipeline)
        // this.$eventBus.$emit('createOrUpdatePipeline', pipeline)
      })

    },
    // 删除流水线
    handleDelete(row?: any) {
      this.$alert('确认删除流水线?', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action: string) => {
          if (action === 'confirm') {
            coverageApi.deletePipeline(row.id).then(() => {
                this.pollingDataList()
              }
            )
          }
        }
      })
    },
    // 填写合并报告id
    openMergeDialog(row?: any) {
      this.compareForm.compareBranch = row.coverageParams.compareBranch
      this.compareFormVisible = true
        this.compareForm.row = row
    },
    // 触发覆盖率收集
    handleTriggerCoverage() {
      const params = {
        pipelineId: this.compareForm.row.id,
        projectGit: this.compareForm.row.coverageParams.projectGit,
        compareBranch: this.compareForm.compareBranch
      }
      coverageApi.triggerCoverageDeploy(params)
      this.compareFormVisible = false
    },
    // 填写发版commit
    openCommitDialog(row?: any) {
      this.dialogFormVisible = true
      this.commitForm.row = row
    },
    // 触发服务端发版
    handleTriggerDeployServe() {
      this.$refs['commitForm'].validate((valid?: boolean) => {
        if (valid) {
          const params = {
            projectName: this.commitForm.row.projectName,
            pipelineId: this.commitForm.row.id,
            commitId: this.commitForm.commitId
          }
          coverageApi.triggerServerDeploy(params).finally(() => this.dialogFormVisible = false)
          coverageApi.triggerSonarBuild(params)
        }else {
          return false
        }
      })
    },
    // 填写sonar commit
    openSonarDialog(row?: any) {
      this.sonarFormVisible = true
      this.commitForm.row = row
    },
    //triggerSonar
    triggerSonar() {
      this.$refs['sonarForm'].validate((valid?: boolean) => {
        if (valid) {
          const params = {
            commitId: this.commitForm.commitId,
            pipelineId: this.commitForm.row.id,
          }
          coverageApi.triggerSonarBuild(params).finally(() =>this.sonarFormVisible = false)
        }else {
          return false
        }
      })
    },
    handleToBuildConsole(row?: any, step?: string) {
      this.$router.push({
        name: PathName.PipelineBuildConsole,
        params: {
          pipelineId: row.id,
          step: step,
        }
      })
    },
    handleToServerDeployHistory(row?: any) {
      this.$router.push({
        name: PathName.PipelineServerBuildRecordByPipelineId,
        params: {
          pipelineId: row.id
        }
      })
    }
  }
}
</script>

<style scoped>
.iconSize {
  font-size: 24px;
  border-radius: 12px;
}

.tooltipSize {
  width: 24px;
  height: 24px;
}

.success {
  color: #1aaa55;
}

i.success:hover {
  background-color: #dcf5e7;
}

.fail {
  color: #db3b21;
  font-size: 24px;
  border-radius: 12px;
}

i.fail:hover {
  background-color: #f8e2dd;
}

.pending {
  color: #a7a7a7;
  font-size: 24px;
  border-radius: 12px;
}

i.pending:hover {
  background-color: #f4f4f5;
}

.skip {
  color: #2e2e2e;
  font-size: 24px;
  border-radius: 12px;
}

.running {
  color: #1f78d1;
  font-size: 24px;
  border-radius: 12px;
}

i.running:hover {
  background-color: #ecf5ff;
}

.line {
  position: absolute;
  display: inline-block;
  width: 50px;
  height: 2px;
  top: 11px;
  left: 0;
  right: 0;
}

</style>
