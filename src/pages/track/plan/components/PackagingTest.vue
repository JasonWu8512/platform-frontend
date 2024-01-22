<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    class="dialog-title"
    title="开发提测"
    width="65%"
  >

    <el-form ref="planForm" :model="form" :rules="rules" label-position="top">
      <el-form-item :label-width="formLabelWidth" label="提测需求" prop="name">
        <el-input v-model="form.name" placeholder="当前版本相关需求列表" type="textarea"/>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="技术概要链接" prop="summary">
        <el-input v-model="form.summary" placeholder="技术&接口文档&阿波罗配置&数据库业务配置" type="textarea"/>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="影响范围" prop="influence">
        <el-input v-model="form.influence" placeholder="当前提测涉及到的业务影响范围" type="textarea"/>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="前后端提测服务" prop="server">
        <el-input v-model="form.server" placeholder="前后端提测服务及commit id" type="textarea"/>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="冒烟结果" prop="result">
        <el-input v-model="form.result" placeholder="附上测试平台冒烟测试计划链接" type="textarea"/>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="是否延期" prop="postpone">
        <el-select v-model="form.postpone" placeholder="是否延期">
          <el-option
            v-for="item in [{text: '是', value: true}, {text: '否', value: false}]"
            :key="item.value"
            :label="item.text"
            :value="item.text"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="延期原因" prop="reason">
        <el-input v-model="form.reason" placeholder="延期原因" type="textarea"/>
      </el-form-item>
      <el-form-item v-if="form.rejectCount" :label-width="formLabelWidth" label="驳回次数">
        <div>{{ form.rejectCount }} 次</div>
      </el-form-item>
    </el-form>

    <template slot="footer">
      <dialog-footer
        :confirm-disable="form.status === planInstanceStatusEnum.PENDING"
        @cancel="dialogFormVisible = false"
        @confirm="approvalSubmit"
      />
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {testPlanApi} from "@/api"
import {RequestCreatePackagingTestApproval} from "@/api/types/testPlan"
import {typePackagingTestData, typePlanData} from "@/api/types/testPlanType"
import variables from "@/assets/css/utils.scss"
import DialogFooter from "@/common/components/DialogFooter.vue"
import {planInstanceStatusEnum} from '@/constant/TestPlan'
import {packagingTestForm, packagingTestRules, planForm} from "@/pages/track/plan/forms"
import {cloneDeep} from "lodash"

export default {
  name: "PackagingTest",
  components: {DialogFooter},
  data() {
    return {
      dialogFormVisible: false,
      planInstanceStatusEnum: planInstanceStatusEnum,
      form: packagingTestForm,
      rules: packagingTestRules,
      operation: '',
      ownerOptions: [],
      projectOptions: [],
      epicOptions: [],
      planOptions: [],
      pickerOptionsStart: {},
      testPlan: planForm,
    }
  },
  computed: {
    formLabelWidth() {
      return variables['formLabelWidth']
    },
  },
  mounted() {
    this.$eventBus.$on('packagingTestSubmit', (testPlan: typePlanData) => {
      this.testPlan = testPlan
      console.log(testPlan)
      this.open(testPlan)
    })
  },
  methods: {
    open(testPlan: typePlanData) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.planForm) {
          this.$refs.planForm.resetFields()
        }
        if (testPlan.approvalInstance) {
          let tmp: typePackagingTestData = cloneDeep(JSON.parse(testPlan.approvalInstance))
          Object.assign(this.form, tmp)
        } else {
          this.form.name = testPlan.name
          this.form.result = window.location.href.replace("list", testPlan.id)
        }
        this.form.id = testPlan.id
        this.form.status = testPlan.instanceStatus
        this.form.rejectCount = testPlan.rejectCount
        this.form.ownerEmail = this.$store.state.users.users.find((s: { username: string }) => s.username == testPlan.owner).email
      })
    },
    buildParams() {
      let body: RequestCreatePackagingTestApproval = {
        name: this.form.name,
        summary: this.form.summary,
        influence: this.form.influence,
        server: this.form.server,
        result: this.form.result,
        postpone: this.form.postpone,
        reason: this.form.reason,
        rejectCount: this.form.rejectCount,
        userEmail: this.$store.state.login.email,
        ownerEmail: this.form.ownerEmail,
        jiraProjects: this.testPlan.projIds,
      }
      return body
    },
    approvalSubmit() {
      this.$refs.planForm.validate((valid: boolean) => {
        if (valid) {
          const body: RequestCreatePackagingTestApproval = this.buildParams()
          testPlanApi.createPackagingTestApproval(this.form.id, body)
            .then(() => {
              this.$emit('refresh')
            })
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
