<template>
  <el-form v-loading="loading" :model="form" :rules="rules">
    <el-row>
      <el-col :offset="1" :span="10">
        <el-form-item :label-width="formLabelWidth" label="用例名称" prop="name">
          <el-input
            v-model.trim="form.name"
            :disabled="readOnly"
            clearable
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item :label-width="formLabelWidth" label="所属模块" prop="module">
          <el-select
            v-model="form.module"
            :disabled="readOnly"
            filterable
            placeholder="请选择模块"
          >
            <el-option
              v-for="item in moduleOptions"
              :key="item.id"
              :label="item.path"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :offset="1" :span="10">
        <el-form-item :label-width="formLabelWidth" label="维护人" prop="maintainer">
          <el-select
            v-model="form.maintainer"
            :disabled="readOnly"
            filterable
            placeholder="请选择维护人"
          >
            <el-option
              v-for="item in maintainerOptions"
              :key="item.id"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item :label-width="formLabelWidth" label="用例等级" prop="priority">
          <el-select
            v-model="form.priority"
            :disabled="readOnly"
            clearable
            placeholder="请选择用例等级"
          >
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.text"
              :value="parseInt(item.value)"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :offset="1" :span="10">
        <el-form-item :label-width="formLabelWidth" label="类型" prop="caseType">
          <el-select
            v-model="form.caseType"
            disabled
            placeholder="请选择用例类型"
            @change="typeChange"
          >
            <el-option
              v-for="item in caseTypeOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item :label-width="formLabelWidth" label="测试方式" prop="method">
          <el-select v-model="form.method" disabled placeholder="请选择测试方式">
            <el-option
              v-for="item in executionOptions"
              :key="item.value"
              :label="item.text"
              :value="parseInt(item.value)"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="form.method && form.method === executionEnum.AUTO">
      <el-col :offset="1" :span="10">
        <el-form-item :label-width="formLabelWidth" label="关联测试" prop="testId">
          <el-select
            v-model="form.testId"
            :disabled="readOnly"
            filterable
            placeholder="请选择用例类型"
          >
            <el-option
              v-for="item in testOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="form.testId==='other'" :offset="1" :span="10">
        <el-form-item :label-width="formLabelWidth" label="测试名称" prop="testId">
          <el-input v-model="form.otherTestName" placeholder="请输入关联用例名称"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row class="row-title">
      <el-col :offset="2">前置条件:</el-col>
    </el-row>
    <el-row class="row-content">
      <el-col :span="20">
        <el-form-item prop="prerequisite">
          <el-input
            v-model="form.prerequisite"
            :autosize="{ minRows: 2, maxRows: 4}"
            :disabled="readOnly"
            placeholder="请输入前置条件"
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="form.method && form.method !== executionEnum.AUTO" class="row-title">
      <el-col :offset="2">执行步骤:</el-col>
    </el-row>

    <el-row v-if="form.method && form.method !== executionEnum.AUTO" class="row-content">
      <el-col :span="20">
        <el-table
          v-if="isStepTableAlive"
          :data="form.steps"
          :default-sort="{prop: 'stepNumber', order: 'ascending'}"
          border
          class="tb-edit"
          highlight-current-row
          size="mini"
        >
          <el-table-column label="编号" min-width="10%" prop="stepNumber"/>
          <el-table-column label="步骤描述" min-width="35%" prop="actions">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.actions"
                :autosize="{minRows: 2, maxRows: 6}"
                :disabled="readOnly"
                class="table-edit-input"
                clearable
                placeholder="请输入内容"
                type="textarea"
              />
            </template>
          </el-table-column>
          <el-table-column label="预期结果" min-width="35%" prop="expectedresults">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.expectedresults"
                :autosize="{minRows: 2, maxRows: 6}"
                :disabled="readOnly"
                class="table-edit-input"
                clearable
                placeholder="请输入内容"
                type="textarea"
              />
            </template>
          </el-table-column>
          <el-table-column v-if="!readOnly" :width="table3BtnWidth" label="操作">
            <template slot-scope="scope">
              <table-operator
                :delete-disable="(scope.$index === 0 && form.steps.length <= 1)"
                :edit-icon="'el-icon-plus'"
                :read-only="readOnly"
                copy-tip="复制"
                delete-tip="删除"
                edit-tip="添加步骤"
                show-copy
                show-delete
                show-edit
                @copyClick="handleCopyStep(scope.$index, scope.row)"
                @deleteClick="handleDeleteStep(scope.$index, scope.row)"
                @editClick="handleAddStep(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row class="row-title">
      <el-col :offset="2">备注:</el-col>
    </el-row>
    <el-row class="row-content">
      <el-col :span="20">
        <el-form-item prop="description">
          <el-input
            v-model="form.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            :disabled="readOnly"
            placeholder="请输入内容"
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
</template>

<script lang="ts">
import {typeCaseForm, typeCaseStep} from "@/api/types/testTrackType"
import variables from '@/assets/css/utils.scss'
import TableOperator from "@/common/components/TableOperator.vue"
import {executionEnum} from '@/constant/TestCase'
import {caseFormRules} from "@/pages/track/case/forms"

export default {
  name: "TestCaseForm",
  components: {TableOperator},
  data() {
    return {
      executionEnum: executionEnum,
      moduleOptions: [],
      maintainerOptions: [],
      priorityOptions: [],
      executionOptions: [],
      caseTypeOptions: [],
      form: {},
      testOptions: [],
      rules: this.readOnly ? {} : caseFormRules,
      isStepTableAlive: true,
    }
  },
  props: {
    readOnly: {
      type: Boolean,
      default: true
    },
    condition: Object,
  },
  computed: {
    formLabelWidth() {
      return variables['formLabelWidth']
    },
    table3BtnWidth() {
      return variables['table3BtnWidth']
    },
    loading() {
      return this.$store.state.loading
    },
  },
  methods: {
    initSelectOptions() {
      this.moduleOptions = this.condition.moduleOptions
      this.maintainerOptions = this.condition.maintainerOptions
      this.priorityOptions = this.condition.priorityOptions
      this.executionOptions = this.condition.executionOptions
      this.caseTypeOptions = this.condition.caseTypeOptions
    },
    initForm(form: typeCaseForm) {
      this.initSelectOptions()
      this.form = form
    },
    handleAddStep(index: number, data: typeCaseStep) {
      let step: typeCaseStep = {stepNumber: data.stepNumber + 1, actions: '', expectedresults: ''}
      this.form.steps.forEach((step: typeCaseStep) => {
        if (step.stepNumber > data.stepNumber) {
          step.stepNumber++
        }
      })
      this.form.steps.splice(index + 1, 0, step)
    },
    handleCopyStep(index: number, data: typeCaseStep) {
      let step: typeCaseStep = {
        stepNumber: data.stepNumber + 1,
        actions: data.actions,
        expectedresults: data.expectedresults
      }
      this.form.steps.forEach((step: typeCaseStep) => {
        if (step.stepNumber > data.stepNumber) {
          step.stepNumber++
        }
      })
      this.form.steps.splice(index + 1, 0, step)
    },
    handleDeleteStep(index: number, data: typeCaseStep) {
      this.form.steps.splice(index, 1)
      this.form.steps.forEach((step: typeCaseStep) => {
        if (step.stepNumber > data.stepNumber) {
          step.stepNumber--
        }
      })
    },
    typeChange() {
      this.form.testId = ''
      this.getTestOptions()
    },
    getTestOptions() {
      this.testOptions = []
      if (this.currentProject && this.form.type != '' && this.form.type != 'functional') {
        this.expectedresults = this.$get('/' + this.form.type + '/list/' + this.currentProject.id, (response: any) => {
          this.testOptions = response.data
          this.testOptions.unshift({id: 'other', name: this.$t('test_track.case.other')})
        })
      } else if (this.form.type === 'functional') {
        this.testOptions = [{id: 'other', name: this.$t('test_track.case.other')}]
        this.form.testId = 'other'
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";

.el-input {
  width: auto;
}

.row-title {
  margin-top: 15px;
}

.row-content {
  margin-top: 10px;
  @extend %flex-center-row
}

</style>

<style lang="scss">
/* <-- 表格 input 编辑效果 */
.table-edit-input .el-textarea__inner {
  border-style: hidden;
}
</style>
