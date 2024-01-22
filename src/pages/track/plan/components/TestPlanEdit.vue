<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="operation === operationEnum.EDIT? '编辑测试计划' : '创建测试计划'"
    :visible.sync="dialogFormVisible"
    class="dialog-title"
    width="65%"
  >

    <el-form ref="planForm" :model="form" :rules="rules">

      <el-row>
        <el-col :offset="1" :span="10">
          <el-form-item :label-width="formLabelWidth" label="计划名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入测试计划名称"/>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item :label-width="formLabelWidth" label="所属项目" prop="projIds">
            <el-select
              v-model="form.projIds"
              filterable
              multiple
              placeholder="请选择所属项目"
              style="width: 100%"
            >
              <el-option
                v-for="item in projectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="1" :span="10">
          <el-form-item :label-width="formLabelWidth" label="负责人" prop="owner">
            <el-select v-model="form.owner" filterable placeholder="请选择负责人" style="width: 100%">
              <el-option
                v-for="item in ownerOptions"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item :label-width="formLabelWidth" label="测试阶段" prop="stage">
            <el-select v-model="form.stage" placeholder="请选择测试阶段" style="width: 100%">
              <el-option
                v-for="item in planStageOptions"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="1" :span="10">
          <el-form-item :label-width="formLabelWidth" label="计划开始" prop="targetStart">
            <el-date-picker
              v-model="form.targetStart"
              :picker-options="pickerOptionsStart"
              placeholder="计划开始"
              style="width: 100%"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item :label-width="formLabelWidth" label="计划结束" prop="targetEnd">
            <el-date-picker
              v-model="form.targetEnd"
              :picker-options="pickerOptionsStart"
              placeholder="计划结束"
              style="width: 100%"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="1" :span="10">
          <el-form-item :label-width="formLabelWidth" label="迭代" prop="sprintId">
            <el-select
              v-model="form.sprintId"
              filterable
              placeholder="请选择sprint"
              style="width: 100%"
            >
              <el-option
                v-for="item in sprintOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.stage === planStageEnum.SMOKE" :span="10">
          <el-form-item :label-width="formLabelWidth" label="对应功能测试" prop="parent">
            <el-select
              v-model="form.parent"
              :remote-method="setPlanOptions"
              filterable
              placeholder="请选择对应功能测试计划"
              remote
              style="width: 100%"
            >
              <el-option
                v-for="item in planOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-content" v-if="form.stage === planStageEnum.SMOKE && ['', '0',null, undefined].indexOf(form.sprintId) < 0">
        <el-col :offset="1" :span="10">
          <el-form-item :label-width="formLabelWidth" label="需求" prop="storyIds">
            <el-select v-model="form.storyIds" filterable multiple :multiple-limit="1" placeholder="请选择冒烟需求" style="width: 100%">
              <el-option v-for="item in storyOptions"
              :key="item.id"
              :label="item.summary"
              :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label-width="formLabelWidth" label="应用" prop="pipelineIds">
            <el-select v-model="form.pipelineIds" filterable multiple placeholder="请选择关联工程" style="width: 100%">
              <el-option v-for="item in pipelineOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="row-content">
        <el-col :offset="1" :span="20">
          <el-form-item :label-width="formLabelWidth" label="描述">
            <el-input
              v-model="form.description"
              :autosize="{ minRows: 2, maxRows: 4}"
              :rows="2"
              placeholder="请输入内容"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="operation === operationEnum.EDIT" class="row-content">
        <el-col :offset="1" :span="18">
          <el-form-item :label-width="formLabelWidth" label="当前状态">
            <test-plan-status-button
              :show-reject="form.stage === planStageEnum.SMOKE"
              :status="form.status"
              @statusChange="statusChange"
            />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <template slot="footer">
      <dialog-footer @cancel="dialogFormVisible = false" @confirm="savePlan"/>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {coverageApi, jiraApi, testPlanApi} from "@/api"
import {RequestCreateTestCasePlan, RequestGetTestCasePlanList, RequestUpdateTestCasePlan} from "@/api/types/testPlan"
import {typePlanData} from "@/api/types/testPlanType"
import variables from "@/assets/css/utils.scss"
import DialogFooter from '@/common/components/DialogFooter.vue'
import {datePickerOptionsStart} from "@/common/utils"
import {operationEnum} from "@/constant/TestCase"
import {planStageEnum, planStatusEnum} from "@/constant/TestPlan"
import TestPlanStatusButton from "@/pages/track/plan/common/TestPlanStatusButton.vue"
import {planForm, planRules} from "@/pages/track/plan/forms"
import {cloneDeep} from "lodash"

// 计划状态
// const planStageOptions = Object.entries(planStageType).map(([value, text]) => {
//   return {text: text, value: value}
// })


export default {
  name: "TestPlanEdit",
  components: {TestPlanStatusButton, DialogFooter},
  data() {
    return {
      operationEnum: operationEnum,
      planStageEnum: planStageEnum,
      planStageOptions: [],
      dialogFormVisible: false,
      form: planForm,
      rules: planRules,
      operation: '',
      ownerOptions: [],
      projectOptions: [],
      storyOptions: [],
      sprintOptions: [],
      planOptions: [],
      pipelineOptions: [],
      pickerOptionsStart: {},
    }
  },
  props: {
    condition: Object,
  },
  computed: {
    formLabelWidth() {
      return variables['formLabelWidth']
    },
  },
  watch: {
    'form.sprintId'() {
      jiraApi.getStoryBySprint({sprintId: this.form.sprintId}).then(res => {
        this.storyOptions = res.data
      })
    },
    'form.projIds'() {
      this.setSprintOptions()
    }
  },
  mounted() {
    this.$eventBus.$on('testPlanCreateOrUpdate', (testPlan: typePlanData, stage: any) => {
      this.open(testPlan, stage)
      console.log('sprintId', this.form.sprintId)
    })
    coverageApi.getPipelineList({limit: 1000}).then(res => {
      this.pipelineOptions = res.data.data
    })
  },
  methods: {
    initOptions() {
      this.ownerOptions = this.condition.ownerOptions
      this.projectOptions = this.condition.projectOptions
      this.pickerOptionsStart = datePickerOptionsStart()
      this.setPlanOptions()
      // this.setSprintOptions()
    },
    open(testPlan: typePlanData, stage: any) {
      this.planStageOptions = stage
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.form = {
          status: planStatusEnum.INIT,
          name: '',
          projIds: [],
          projNames: [],
          owner: '',
          stage: '',
          description: '',
          targetStart: '',
          targetEnd: '',
          epics: [],
          parent: ''
        }
        this.operation = operationEnum.ADD
        //修改
        if (testPlan) {
          this.operation = operationEnum.EDIT
          this.form = cloneDeep(testPlan)
        }
        this.initOptions()
      })
    },
    savePlan() {
      this.$refs.planForm.validate((valid: boolean) => {
        if (valid) {
          if (!this.validate()) return false
          if (this.operation === operationEnum.ADD) {
            const body: RequestCreateTestCasePlan = this.buildParams()
            testPlanApi.createTestCasePlan(body)
              .then(() => {
                this.$emit('refresh')
              })
          } else if (this.operation === operationEnum.EDIT) {
            const body: RequestUpdateTestCasePlan = this.buildParams()
            testPlanApi.updateTestCasePlan(this.form.id, body)
              .then(() => {
                this.$emit('refresh')
              })
          }
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    validate() {
      if (this.form.targetStart > this.form.targetEnd) {
        this.$message.warning('开始日期不能大于结束日期')
        return false
      }
      return true
    },
    buildParams() {
      // console.log(this.form.projIds, this.projectOptions)
      let body: RequestCreateTestCasePlan | RequestUpdateTestCasePlan = {
        name: this.form.name,
        stage: this.form.stage,
        projIds: this.form.projIds,
        projNames: this.form.projIds.map((id: any) => {
          return this.projectOptions.find((obj: { id: any }) => obj.id === id).name
        }),
        owner: this.form.owner,
        targetStart: this.form.targetStart || undefined,
        targetEnd: this.form.targetEnd || undefined,
        description: this.form.description,
        storyIds: this.form.storyIds || undefined,
        pipelineIds: this.form.pipelineIds || undefined,
        sprintId: this.form.sprintId,
        status: this.form.status,
      }
      if (body.stage === planStageEnum.SMOKE) {
        body = Object.assign({parent: this.form.parent}, body)
      }
      return body
    },
    statusChange(status: any) {
      this.form.status = status
      this.$forceUpdate()
    },
    setPlanOptions(value?: any) {
      const params: RequestGetTestCasePlanList = {
        stage: planStageEnum.SYSTEM,
        name: value || ''
      }
      testPlanApi.getTestCasePlanList(params)
        .then(({data}) => {
          this.planOptions = data.data
        })
    },
    setSprintOptions() {
      this.sprintOptions = []
      this.form.projIds.forEach((item: any) =>{
        console.log('proj', item)
        jiraApi.getSprintByProject({projId: item}).then(res => {
          this.sprintOptions = this.sprintOptions.concat(res.data.datas)
        })
      })
      // jiraApi.getSprintByProject({search: value || '', epics: this.form.epics})
      //   .then(({data}) => {
      //     this.epicOptions = data
      //   })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";
@import "src/assets/css/utils";

.dialog-title {
  @extend %dialog-title;
}

.row-content {
  margin-top: 10px;
  @extend %flex-left-center-row;
}
</style>
