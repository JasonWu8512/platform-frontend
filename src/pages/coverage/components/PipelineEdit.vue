<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="operation === operationEnum.EDIT? '编辑流水线' : '创建流水线'"
    :visible.sync="dialogFormVisible"
    class="dialog-title"
    width="65%"
  >
    <el-form ref="pipelineForm" :model="form" :rules="rules" :label-width="formLabelWidth">
      <el-row>
        <el-col :offset="1" :span="10">
          <el-form-item label="流水线名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入流水线名称"/>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="服务名称" prop="projectId">
            <el-select
              v-model="form.projectId"
              filterable
              placeholder="请选择服务"
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
          <el-form-item label="业务线" prop="business">
            <el-select v-model="form.business" filterable placeholder="请选择端">
              <el-option v-for="item in businessOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
          <el-col :span="10">
            <el-form-item label="端" prop="terminal">
              <el-select v-model="form.terminal" filterable placeholder="请选择端" @change="handleChangeTerminal">
                <el-option v-for="item in terminalOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="10">
          <el-form-item  label="对比分支" prop="compareBranch">
            <el-input v-model="form.compareBranch" placeholder="请输入测试对比分支"/>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="git地址" prop="projectGit">
            <el-input v-model="form.projectGit" placeholder="请输入git地址"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1">
          <el-form-item label="流水线步骤">
            <template>
              <el-checkbox v-model="checked1" disabled>服务端发版</el-checkbox>
              <el-checkbox v-model="checked2">覆盖率收集</el-checkbox>
            </template>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="20">
          <el-form-item label="通知群" prop="notifyChatIds">
            <el-select v-model="form.notifyChatIds"
                       filterable
                       multiple
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
      <dialog-footer @cancel="dialogFormVisible = false" @confirm="savePipeline"/>
    </template>
  </el-dialog>

</template>

<script lang="ts">
import {coverageApi} from "@/api"
import variables from "@/assets/css/utils.scss"
import DialogFooter from '@/common/components/DialogFooter.vue'
import {operationEnum} from "@/constant/TestCase"
import {businessType, terminalType} from "@/constant/Coverage";
// 业务线
const businessOptions = Object.entries(businessType).map(([value, text]) => {
  return {label: text, value: value}
})
// 端
const terminalOptions = Object.entries(terminalType).map(([value, text]) => {
  return {label: text, value: value}
})

export default {
  name: "PipelineEdit",
  components: {DialogFooter,},
  computed: {
    owner() {
      return this.$store.getters.userName;
    },
    formLabelWidth() {
      return variables['formLabelWidth']
    },
    projectOptions() {
      return this.$store.state.coverage.gitProjects
    },
    chatOptions() {
      return this.$store.state.coverage.larkChats
    }
  },
  watch: {
    'form.projectId'() {
      this.projectOptions.forEach((item: any) => {
        if (item.id === this.form.projectId) {
          this.form.projectGit = item.sshUrl
        }
      })
    }
  },
  data() {
    return {
      checked1: true,
      checked2: true,
      terminalOptions: terminalOptions,
      businessOptions: businessOptions,
      dialogFormVisible: false,
      operationEnum: operationEnum,
      operation: '',
      // projectOptions: [],
      form: {
        projectGit: '',
        compareBranch: 'origin/master',
        name: '',
        projectId: '',
        notifyChatIds: '',
        terminal: 'BE',
        business: '',
      },
      rules: {
        name: [{required: true, message: '请输入流水线名称', trigger: 'blur'}],
        compareBranch: [{required: true, message: '请输入对比分支', trigger: 'blur'}],
        terminal: [{required: true, message: '请选择端', trigger: 'blur'}],
        business: [{required: true, message: '请选择业务线', trigger: 'blur'}],
        projectId: [{required: true, message: '请选择服务', trigger: 'change'}],
        projectGit: [{required: true, message: '请输入服务简写git地址', trigger: 'blur'}]
      }
    }
  },

  methods: {
    handleChangeTerminal() {
      this.checked1 = !(this.form.terminal === 'FE')
    },
    open(pipeline?: any) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.pipelineForm) {
          this.$refs['pipelineForm'].resetFields()
          this.checked1 = true
          this.checked2 = true
        }
        this.operation = operationEnum.ADD
        //修改
        if (pipeline) {
          this.operation = operationEnum.EDIT
          this.form.id = pipeline.id
          this.form.name = pipeline.name
          this.form.terminal = pipeline.terminal
          this.form.business = pipeline.business
          this.form.projectId = pipeline.projectId
          this.form.projectGit = pipeline.coverageParams.projectGit
          this.form.compareBranch = pipeline.coverageParams.compareBranch || 'origin/master'
          this.form.notifyChatIds = pipeline.notifyChatIds
          this.checked1 = Boolean(pipeline.step1)
          this.checked2 = Boolean(pipeline.step2)
        }
      })
    },
    savePipeline() {
      this.$refs['pipelineForm'].validate((valid?: boolean) => {
        if (valid) {
          const params = {
            name: this.form.name,
            projectId: this.form.projectId,
            coverageParams: {
              compareBranch: this.form.compareBranch,
              projectGit: this.form.projectGit,
              ifCoverage: this.checked2
            },
            notifyChatIds: this.form.notifyChatIds,
            step1: this.checked1 ? '服务端发版' : '',
            step2: this.checked2 ? '覆盖率收集' : '',
            business: this.form.business,
            terminal: this.form.terminal,
          }
          if (this.operation === operationEnum.ADD) {
            // @ts-ignore
            params.owner = this.owner
            coverageApi.createPipeline(params)
              .then(() => {
                this.$emit('fatherMethod')
              })
          } else if (this.operation === operationEnum.EDIT) {
            coverageApi.updatePipeline(this.form.id, params)
              .then(() => {
                this.$emit('fatherMethod')
              })
          }
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
