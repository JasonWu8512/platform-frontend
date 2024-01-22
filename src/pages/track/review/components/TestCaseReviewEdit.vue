<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      class="dialog-title"
      title="编辑用例评审"
      width="65%"
      @close="close"
    >

      <el-form ref="reviewForm" :model="form" :rules="rules">

        <el-row>
          <el-col :offset="1" :span="10">
            <el-form-item
              :label-width="formLabelWidth"
              label="评审名称"
              placeholder="请输入评审名称"
              prop="name"
            >
              <el-input v-model="form.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label-width="formLabelWidth" label="所属项目" prop="projKey">
              <el-select
                v-model="form.projKey"
                :disabled="true"
                filterable
                placeholder="请选择所属项目"
                style="width: 100%"
              >
                <el-option
                  v-for="item in projects"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :offset="1" :span="10">
            <el-form-item :label-width="formLabelWidth" label="评审人" prop="reviewer">
              <el-select
                v-model="form.reviewerList"
                filterable
                multiple
                placeholder="请选择评审人"
              >
                <el-option
                  v-for="item in reviewerOptions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label-width="formLabelWidth" label="截止时间" prop="targetEnd">
              <el-date-picker
                v-model="form.targetEnd"
                :picker-options="pickerOptionsStart"
                placeholder="选择日期"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>


        <el-row class="row-content">
          <el-col :offset="1" :span="20">
            <el-form-item :label-width="formLabelWidth" label="描述" prop="description">
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
          <el-col :offset="1" :span="20">
            <el-form-item :label-width="formLabelWidth" label="当前状态" prop="status">
              <test-review-status-button :status="form.status" @statusChange="statusChange"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <template slot="footer">
        <dialog-footer @cancel="dialogFormVisible = false" @confirm="saveReview"/>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import {testReviewApi} from "@/api"
import {RequestUpdateTestCaseReview} from "@/api/types/testReview"
import {typeReviewData} from "@/api/types/testReviewType"
import variables from "@/assets/css/utils.scss"
import DialogFooter from "@/common/components/DialogFooter.vue"
import {datePickerOptionsStart} from "@/common/utils"
import {operationEnum} from "@/constant/TestCase"
import {reviewStatusEnum} from "@/constant/TestReivew"
import TestReviewStatusButton from "@/pages/track/review/commom/TestReviewStatusButton.vue"
import {reviewForm, reviewFormRules} from "@/pages/track/review/forms"
import {cloneDeep} from "lodash"

export default {
  name: "TestCaseReviewEdit",
  components: {DialogFooter, TestReviewStatusButton},
  data() {
    return {
      operationEnum: operationEnum,
      projects: this.projects,
      dialogFormVisible: false,
      form: reviewForm,
      rules: reviewFormRules,
      operation: '',
      reviewerOptions: [],
      pickerOptionsStart: {},
    }
  },
  props: {
    condition: Object,
  },
  inject: ['projects'],
  computed: {
    formLabelWidth() {
      return variables['formLabelWidth']
    },
  },
  mounted() {
    this.$eventBus.$on("caseReviewEdit", (caseReview: typeReviewData) => {
      this.open(caseReview)
    })
  },
  methods: {
    initOptions() {
      this.reviewerOptions = this.condition.reviewerOptions
    },
    initDateOptions() {
      this.pickerOptionsStart = datePickerOptionsStart()
    },
    open(caseReview: typeReviewData) {
      this.initOptions()
      this.initDateOptions()
      //修改
      if (caseReview) {
        this.form = cloneDeep(caseReview)
        this.operation = operationEnum.EDIT
      }
      // console.log(this.form)
      this.dialogFormVisible = true
    },
    saveReview() {
      this.$refs['reviewForm'].validate((valid: boolean) => {
        if (valid) {
          let reviewBody: RequestUpdateTestCaseReview = {
            name: this.form.name,
            targetEnd: this.form.targetEnd || null,
            reviewer: this.form.reviewerList,
            status: this.form.status,
          }
          testReviewApi.updateTestCaseReview(this.form.id, reviewBody)
            .then(() => {
              this.$emit("refresh")
              this.close()
            })
        }
      })
    },
    statusChange(status: reviewStatusEnum) {
      this.form.status = status
      this.$forceUpdate()
    },
    close() {
      this.dialogFormVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";
@import "src/assets/css/utils";

.dialog-title {
  @extend %dialog-title
}

.row-content {
  margin-top: 10px;
  @extend %flex-left-center-row;
}
</style>

