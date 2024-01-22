<template>
  <el-drawer
    ref="drawer"
    :modal-append-to-body="false"
    :visible.sync="showDialog"
    :with-header="false"
    close-on-press-escape
    size="100%"
  >
    <el-alert
      v-if="parent.isQa"
      :closable="false"
      center
      effect="dark"
      title="当前处于测试验证模式"
      type="success"
    />

    <el-card class="container">

      <el-row class="cast-row">

        <!--  返回按钮  -->
        <el-col :span="1">
          <el-button icon="el-icon-back" plain size="mini" @click="cancel">返回</el-button>
        </el-col>

        <!--  评审操作  -->
        <el-col :span="22" class="head-right">

          <span>上一条用例：</span>
          <el-button
            :disabled="index + offset+ 1 <= 1"
            :loading="loading"
            icon="el-icon-arrow-up"
            plain
            size="mini"
            @click="handlePre"
          />
          <span>{{ `${index + offset + 1}/${total}` }}</span>
          <el-button
            :disabled="index + offset+ 1 >= total"
            :loading="loading"
            icon="el-icon-arrow-down"
            plain
            size="mini"
            @click="handleNext"
          />

        </el-col>

      </el-row>

      <el-row>
        <el-col>
          <el-divider content-position="left">{{ testCase.caseDetail.name }}</el-divider>
        </el-col>
      </el-row>

      <el-row class="cast-row">
        <el-col :offset="1" :span="4">
          <span class="cast-label">用例等级：</span>
          <priority-table-item :value="testCase.caseDetail.importance" text/>
        </el-col>
        <el-col :span="5">
          <span class="cast-label">用例类型：</span>
          <case-type-table-item :value="testCase.caseDetail.caseType"/>
        </el-col>
        <el-col :span="10">
          <test-plan-case-status-button
            v-if="parent.isQa"
            :status="testCase.smokeCheck"
            @statusChange="saveCase"
          />
          <test-plan-case-status-button v-else :status="testCase.status" @statusChange="saveCase"/>
        </el-col>
      </el-row>

      <el-row class="cast-row">
        <el-col :offset="1" :span="4">
          <span class="cast-label">测试方式：</span>
          <execution-type-table-item :value="testCase.caseDetail.executionType"/>
        </el-col>
        <el-col :span="5">
          <span class="cast-label">所属模块：</span>
          <span>{{ testCase.treePath }}</span>
        </el-col>
        <el-col :span="4">
          <span class="cast-label">所属项目：</span>
          <span>{{ testCase.projName }}</span>
        </el-col>
      </el-row>

      <el-row class="cast-row">
        <el-col :offset="1">
          <span class="cast-label">前置条件：</span>
          <span>{{ testCase.caseDetail.preconditions }}</span>
        </el-col>
      </el-row>

      <el-row v-if="testCase.method === executionEnum.AUTO && testCase.testId" class="cast-row">
        <el-col :offset="1" :span="20" class="test-detail">
          <el-tabs v-model="activeTab" type="border-card">
            <el-tab-pane label="测试详情" name="detail">
              <api-test-detail
                v-if="testCase.caseType === caseTypeEnum.API"
                :id="testCase.testId"
                ref="apiTestDetail"
                :is-read-only="true"
              />
              <performance-test-detail
                v-else-if="testCase.caseType === caseTypeEnum.PERFORMANCE"
                :id="testCase.testId"
                ref="performanceTestDetail"
                :is-read-only="true"
              />
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>

      <el-row v-if="testCase.executionType !== executionEnum.AUTO" class="cast-row">
        <el-col :offset="1" :span="21">
          <div class="cast-label">执行步骤：</div>
          <el-table
            :border="true"
            :data="testCase.caseDetail.steps"
            :default-sort="{prop: 'num', order: 'ascending'}"
            class="tb-edit"
            highlight-current-row
            size="mini"
          >
            <el-table-column label="编号" min-width="5%" prop="stepNumber"/>

            <el-table-column label="步骤描述" min-width="21%" prop="actions">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.actions"
                  :autosize="{ minRows: 1, maxRows: 4}"
                  :disabled="true"
                  class="border-hidden"
                  size="mini"
                  type="textarea"
                />
              </template>
            </el-table-column>
            <el-table-column label="预期结果" min-width="21%" prop="expectedresults">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.expectedresults"
                  :autosize="{ minRows: 1, maxRows: 4}"
                  class="border-hidden"
                  disabled
                  size="mini"
                  type="textarea"
                />
              </template>
            </el-table-column>
            <el-table-column label="实际结果" min-width="21%">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.actualResult"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  :rows="2"
                  class="table-edit-input"
                  clearable
                  placeholder="请输入内容"
                  size="mini"
                  type="textarea"
                />
              </template>
            </el-table-column>
            <el-table-column label="步骤执行结果" min-width="12%">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.actualStatus"
                  size="mini"
                  @change="stepResultChange()"
                >
                  <el-option
                    v-for="item in stepStatusOptions"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  >
                    <test-review-case-step-status :value="item.value"/>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row class="cast-row">
        <el-col :offset="1" :span="15">
          <div>
            <span class="cast-label">备注：</span>
            <span v-if="!testCase.description" style="color: darkgrey">未填写</span>
          </div>
          <div>
            <el-input
              v-if="testCase.description"
              v-model="testCase.description"
              :rows="3"
              disabled
              type="textarea"
            />
          </div>
        </el-col>
      </el-row>
    </el-card>

  </el-drawer>
</template>

<script lang="ts">
import {testCaseApi} from "@/api"
import {typePlanData} from "@/api/types/testPlanType"
import {RequestUpdateTestCase} from "@/api/types/testTrack"
import {typeCaseStep} from "@/api/types/testTrackType"
import {caseTypeEnum, caseUpdateTypeEnum, executionEnum, stepStatusEnum, stepStatusType} from "@/constant/TestCase"
import {planResultEnum} from "@/constant/TestPlan"
import CaseTypeTableItem from "@/pages/track/common/tableItems/CaseTypeTableItem.vue"
import ExecutionTypeTableItem from "@/pages/track/common/tableItems/ExecutionTypeTableItem.vue"
import PriorityTableItem from "@/pages/track/common/tableItems/PriorityTableItem.vue"
import TestPlanCaseStatusButton from "@/pages/track/plan/common/TestPlanCaseStatusButton.vue"
import TestReviewCaseStepStatus from "@/pages/track/review/commom/TestReviewCaseStepStatus.vue"
import {cloneDeep} from "lodash"

// 用例步骤执行结果
const stepStatusOptions = Object.entries(stepStatusType).map(([value, text]) => {
  return {text: text, value: value}
})

export default {
  name: "TestCasePlanRun",
  components: {
    PriorityTableItem,
    CaseTypeTableItem,
    ExecutionTypeTableItem,
    TestPlanCaseStatusButton,
    TestReviewCaseStepStatus,
  },
  data() {
    return {
      caseTypeEnum: caseTypeEnum,
      executionEnum: executionEnum,
      stepStatusOptions: stepStatusOptions,
      showDialog: false,
      testCase: {caseDetail: {}},
      index: 0,
      total: 0,
      parent: '',
      tableData: [],
      test: {},
      activeTab: 'detail',
      isFailure: true,
    }
  },
  props: {
    searchParam: Object,
    planId: [String, Number],
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    offset() {
      return this.parent.pageSize * (this.parent.currentPage - 1)
    }
  },
  mounted() {
    this.$eventBus.$on('testPlanCaseRun', (testcase: typePlanData, tableData: typePlanData[], parent: any) => {
      this.parent = parent
      this.open(testcase, tableData)
    })
  },
  methods: {
    cancel() {
      this.showDialog = false
      this.$emit('refresh')
    },
    saveCase(status: planResultEnum) {
      let body: RequestUpdateTestCase = {
        type: caseUpdateTypeEnum.UPDATE_PLAN_STATUS,
        planId: this.planId,
        executor: this.$store.state.login.username,
        stepActualResults: this.testCase.caseDetail.steps.map((step: typeCaseStep) => {
          return step.actualResult || ''
        }),
        stepActualStatus: this.testCase.caseDetail.steps.map((step: typeCaseStep) => {
          return step.actualStatus || planResultEnum.PASS
        }),
        issueIds: [],
      }
      if (this.parent.isQa) {
        this.testCase.smokeCheck = status
        body = Object.assign(body, {
          type: caseUpdateTypeEnum.UPDATE_PLAN_SMOKE_CHECK,
          smokeCheck: status,
        })
      } else {
        this.testCase.status = status
        body = Object.assign(body, {status: status})
      }
      testCaseApi.updateTestCase(this.testCase.caseId, body)
        .then(() => {
          this.handleNext()
        })
        .catch(() => {
          this.parent.isQa
            ? this.testCase.smokeCheck = planResultEnum.INIT
            : this.testCase.status = planResultEnum.INIT
        })
    },
    async handleNext() {
      if (this.index + this.offset + 1 === this.total) {
        return
      }
      // 超过当前页总数时，触发翻页
      if (this.index + 1 !== this.tableData.length) {
        this.index++
        this.getTestCase(this.index)
      } else {
        try {
          this.parent.currentPage++
          // 重置列表索引
          this.index = -1
          await this.parent.getData()
          this.tableData = this.parent.tableData
          await this.handleNext()
        } catch {
          // 恢复列表索引
          this.index = this.parent.pageSize - 1
          this.parent.currentPage--
        }
      }
    },
    async handlePre() {
      if (this.index !== 0) {
        this.index--
        this.getTestCase(this.index)
      } else {
        try {
          this.parent.currentPage--
          // 重置列表索引
          this.index = this.parent.pageSize
          await this.parent.getData()
          this.tableData = this.parent.tableData
          await this.handlePre()
        } catch {
          // 恢复列表索引
          this.index = this.parent.pageSize + 1
          this.parent.currentPage++
        }
      }
    },
    getTestCase(index: number) {
      this.testCase = this.tableData[index]
    },
    open(testCase: typePlanData, tableData: typePlanData[]) {
      this.showDialog = true
      this.total = this.parent.total
      this.activeTab = 'detail'
      this.testCase = cloneDeep(testCase)
      this.tableData = tableData
      this.index = this.tableData.indexOf(testCase)
    },
    stepResultChange() {
      if (this.testCase.method === executionEnum.MANUAL) {
        this.isFailure = this.testCase.caseDetail.steps.filter((s: { actualStatus: stepStatusEnum }) => {
          return s.actualStatus === stepStatusEnum.FAIL || s.actualStatus === stepStatusEnum.BLOCK
        }).length > 0
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.cast-row {
  text-align: left;
}

.border-hidden > > > .el-textarea__inner {
  border-style: hidden;
  background-color: white;
  color: #606266;
}

.cast-label {
  color: dimgray;
}

.status-button {
  padding-left: 4%;
}

.head-right {
  text-align: right;
}

.el-col:not(.test-detail) {
  line-height: 50px;
}

.issues-edit > > > p {
  line-height: 16px;
}

.status-button {
  float: right;
}

.head-right-tip {
  color: darkgrey;
}

.el-scrollbar {
  height: 100%;
}

.container {
  height: 100%;
  margin: 15px;
}

.el-switch > > > .el-switch__label {
  color: dimgray;
}

.el-switch > > > .el-switch__label.is-active {
  color: #409EFF;
}

.container > > > .el-card__body {
  height: calc(100vh - 70px);
}

.el-divider__text {
  text-align: left;
  line-height: normal;
}

</style>

<style lang="scss">
.el-drawer.rtl {
  overflow: auto;
}
</style>
