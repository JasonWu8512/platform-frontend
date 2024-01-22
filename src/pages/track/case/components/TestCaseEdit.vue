<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :title="operationType[operation]"
      :visible.sync="dialogFormVisible"
      class="dialog-title"
      width="65%"
      @close="close"
    >
      <test-case-form ref="testCaseForm" :condition="condition" :read-only="readOnly"/>

      <template slot="footer">
        <el-switch
          v-if="operation === operationEnum.ADD"
          v-model="isCreateContinue"
          active-text="保存并继续创建"
        />
        <dialog-footer v-if="!readOnly" @cancel="dialogFormVisible = false" @confirm="saveCase"/>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {testCaseApi} from "@/api"
import {RequestCreateTestCase, RequestUpdateTestCase} from "@/api/types/testTrack"
import {typeCaseData, typeCaseForm} from "@/api/types/testTrackType"
import DialogFooter from '@/common/components/DialogFooter.vue'
import {caseUpdateTypeEnum, executionEnum, operationEnum, operationType} from '@/constant/TestCase'
import TestCaseForm from "@/pages/track/case/components/TestCaseForm.vue"
import {caseForm, caseStep} from "@/pages/track/case/forms"
import {cloneDeep} from "lodash"


export default {
  name: "TestCaseEdit",
  components: {TestCaseForm, DialogFooter},
  data() {
    return {
      operationEnum: operationEnum,
      operationType: operationType,
      testCase: {},
      operation: '',
      dialogFormVisible: false,
      isCreateContinue: false,
      isStepTableAlive: true,
    }
  },
  props: {
    treeNodes: Array,
    readOnly: {
      type: Boolean,
      default: true
    },
    selectNode: Object,
    currentProject: Object,
    condition: Object,
  },
  mounted() {
    this.$eventBus.$on('testCaseAddOrEditOrCopy', (testcase: typeCaseData, isCopy: boolean) => {
      this.open(testcase, isCopy)
    })
  },
  methods: {
    reload() {
      this.isStepTableAlive = false
      this.$nextTick(() => (this.isStepTableAlive = true))
    },
    open(testCase: typeCaseData, isCopy: Boolean) {
      this.dialogFormVisible = true
      // 强制等待DOM加载完毕再操作
      this.$nextTick(() => {
        const form: typeCaseData & typeCaseForm = cloneDeep(testCase || caseForm)
        this.operation = operationEnum.ADD
        if (testCase) {
          // 修改或查看
          if (this.readOnly) {
            this.operation = operationEnum.VIEW
          } else {
            this.operation = operationEnum.EDIT
            form.module = testCase.treeId
            form.maintainer = testCase.qa
            form.priority = testCase.importance
            form.method = testCase.executionType
            form.prerequisite = testCase.preconditions
          }
          // 复制
          if (isCopy) {
            this.operation = operationEnum.ADD
            form.name = ''
          }
        } else {
          form.module = this.selectNode.id
          form.maintainer = this.$store.state.login.username
        }
        // 没有步骤加一个步骤
        if (form.steps.length === 0) {
          form.steps.push(caseStep)
        }
        this.$refs.testCaseForm.initForm(form)
      })
    },
    close() {
      this.dialogFormVisible = false
      this.reload()
    },
    saveCase() {
      const testCaseForm = this.$refs.testCaseForm.$children[0]
      testCaseForm.validate((valid: any) => {
        if (valid) {
          this.testCase = testCaseForm.model
          const body: RequestCreateTestCase = this.buildParam()
          if (this.operation === operationEnum.ADD) {
            if (this.validate(body)) {
              testCaseApi.createTestCase(body)
                .then(() => {
                  if (this.isCreateContinue) {
                    const form = cloneDeep(caseForm)
                    form.module = this.selectNode.id
                    form.maintainer = this.$store.state.login.username
                    this.$refs.testCaseForm.initForm(form)
                  } else {
                    this.dialogFormVisible = false
                  }
                  this.$emit("refresh")
                  return
                })
            }
          } else if (this.operation === operationEnum.EDIT) {
            let updateBody: RequestUpdateTestCase = {
              type: caseUpdateTypeEnum.UPDATE_CASE,
              case: body
            }
            if (this.validate(body)) {
              testCaseApi.updateTestCase(this.testCase.id, updateBody)
                .then(() => {
                  if (this.isCreateContinue) {
                    this.$refs.testCaseForm.$children[0].resetFields()
                  } else {
                    this.dialogFormVisible = false
                  }
                  this.$emit("refresh")
                  return
                })
            }
          }
        }
      })
    },
    buildParam() {
      this.testCase = this.$refs.testCaseForm.$children[0].model
      let body: RequestCreateTestCase = {
        projId: this.currentProject.id,
        treeId: this.testCase.module,
        name: this.testCase.name.trim(),
        executionType: this.testCase.method,
        caseType: this.testCase.caseType,
        importance: this.testCase.priority,
        qa: this.testCase.maintainer,
        description: this.testCase.description
      }
      if (this.testCase.method !== executionEnum.AUTO) {
        body = Object.assign({testId: null}, body)
      }
      // 前置条件
      if (this.testCase.prerequisite.trim()) {
        body = Object.assign({preconditions: this.testCase.prerequisite}, body)
      }
      // 没有测试步骤
      if (this.testCase.steps[0].desc !== '') {
        body = Object.assign({steps: this.testCase.steps}, body)
      }
      return body
    },
    validate(param: RequestCreateTestCase) {
      if (param.steps) {
        for (let i = 0; i < param.steps.length; i++) {
          if ((param.steps[i].actions && param.steps[i].actions.length > 300) ||
            (param.steps[i].expectedresults && param.steps[i].expectedresults.length > 300)) {
            this.$message.warning('步骤描述,预期结果长度必须小于300')
            return false
          }
        }
      }
      return true
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/utils";

.dialog-title {
  @extend %dialog-title
}

.el-switch {
  margin-bottom: 10px
}
</style>
