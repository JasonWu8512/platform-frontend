<template>
  <el-dialog
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :title="operation === operationEnum.EDIT? '编辑自动化配置' : '创建自动化配置'"
    :visible.sync="dialogFormVisible"
    class="dialog-title"
    width="65%"
  >
    <el-form ref="autoConfigForm" :model="form" :rules="rules">
      <el-row>
        <el-col :offset="1" :span="10">
          <el-form-item :label-width="formLabelWidth" label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入自动化名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label-width="formLabelWidth" label="流水线" prop="pipelineIds">
            <el-select v-model="form.pipelineIds" multiple filterable style="width: 100%;">
              <el-option v-for="item in pipelineOptions"
                         :key="item.id"
                         :value="item.name"
                         :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="10">
          <el-form-item :label-width="formLabelWidth" label="定时器:" prop="crontabSchedule">
            <el-input v-model="form.crontabSchedule" placeholder="请输入crontab表达式：分 小时 日 月 星期"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label-width="formLabelWidth" label="开启定时:" prop="enableAutoTrigger">
            <el-radio v-model="form.enableAutoTrigger" :label="true">是</el-radio>
            <el-radio v-model="form.enableAutoTrigger" :label="false">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="20">
          <el-form-item :label-width="formLabelWidth" label="环境:" prop="execEnv">
            <el-radio v-model="form.execEnv" label="fat">fat</el-radio>
            <el-radio v-model="form.execEnv" label="rc">rc</el-radio>
            <el-radio v-model="form.execEnv" label="prod">prod</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="20">
          <el-form-item :label-width="formLabelWidth" label="用例标签:" prop="tags">
            <el-input v-model="form.tags" placeholder="请输入执行用例的标签,方式有：mark1; not mark1; mark1 or mark2; mark1 and mark2等多种组合方式"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="20">
          <el-form-item :label-width="formLabelWidth" label="指定用例:" prop="cases">
            <el-select v-model="caseNames"
                       multiple
                       filterable
                       :filter-method="selectFilterNodeMethod"
                       @change="selectChange"
                       style="width: 100%"
            >
              <el-option :value="caseNodes" style="height: auto">
                <el-tree :data="caseTree"
                         show-checkbox
                         :props="{children: 'children', label: 'name'}"
                         @check-change="handleCheckChange"
                         :filter-node-method="filterNode"
                         :default-checked-keys="form.cases"
                         node-key="id"
                         ref="caseTree"
                ></el-tree>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="20">
          <el-form-item :label-width="formLabelWidth" label="通知群:" prop="notifyChatIds">
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

<script>
import {autoApi, coverageApi} from "@/api"
import variables from "@/assets/css/utils.scss"
import DialogFooter from '@/common/components/DialogFooter.vue'
import {operationEnum} from "@/constant/TestCase"
import tagsSelect from '@/pages/auto/components/tagsSelect.vue'

export default {
  name: "AutoConfigEdit",
  // eslint-disable-next-line vue/no-unused-components
  components: {DialogFooter,tagsSelect},
  computed: {
    owner() {
      return this.$store.getters.userName;
    },
    formLabelWidth() {
      return variables['formLabelWidth']
    },
    chatOptions() {
      return this.$store.state.coverage.larkChats
    }
  },
  data() {
    const validateTags = (rule, value, callback) => {
      if (value === '' && this.form.cases.length === 0) {
        callback(new Error('标签和用例必须填一项'));
      } else if (value !== '' && this.form.cases.length > 0) {
        callback(new Error('标签和用例只能填一项'));
      } else {
        callback();
      }
    };
    const validateCases = (rule, value, callback) => {
      console.log('value', value)
      if (value.length === 0 && this.form.tags === '') {
        callback(new Error('标签和用例必须填一项'));
      }else if (value.length > 0 && this.form.tags !== '') {
        callback(new Error('标签和用例只能填一项'));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      operationEnum: operationEnum,
      tagOptions: [],
      caseTree: [],
      pipelineOptions: [],
      operation: '',
      caseNames: '',
      caseNodes: '',
      form: {
        name: '',
        tags: '',
        cases: [],
        crontabSchedule: '',
        enableAutoTrigger: false,
        execEnv: 'fat',
        notifyChatIds: [],
        pipelineIds: [],
      },
      rules: {
        name: [{required: true, message: '请输入自动化配置名称', trigger: 'blur'}],
        tags: [{required: false, validator: validateTags, trigger: "blur"}],
        cases: [{required: false, validator: validateCases, trigger: "blur"}],
      }
    }
  },
  mounted() {
    this.getTags()
    this.getCaseTree()
    this.getPipelines()
  },
  methods: {
    // 获取自动化标签
    getTags() {
      autoApi.getAutoTags().then(res => {
        this.tagOptions = res.data
      })
    },
    // 获取所有自动化用例树
    getCaseTree() {
      autoApi.getAutoCases().then(res => {
        this.caseTree = res.data
      })
    },
    // 获取所有流水线
    getPipelines() {
      coverageApi.getPipelineList({offset: 0, limit: 1000}).then(res => {
        this.pipelineOptions = res.data.data.map(item => {
          return {
            id: item.id,
            name: item.name,
          }
        })
      })
    },
    // 打开创建/编辑配置表单
    open(autoConfig) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.autoConfigForm) {
          this.$refs['autoConfigForm'].resetFields()
          this.form.cases = []
          this.caseNames =  []
          this.caseNodes = []
          this.$refs.caseTree.setCheckedNodes(this.caseNodes)
        }
        this.operation = operationEnum.ADD
        //修改
        if (autoConfig) {
          this.operation = operationEnum.EDIT
          this.form.id = autoConfig.id
          this.form.name = autoConfig.name
          this.form.tags = autoConfig.tags
          this.form.cases = autoConfig.cases
          this.form.crontabSchedule = autoConfig.crontabSchedule
          this.form.enableAutoTrigger = autoConfig.enableAutoTrigger
          this.form.execEnv = autoConfig.execEnv
          this.form.notifyChatIds = autoConfig.notifyChatIds
          this.form.pipelineIds = autoConfig.pipelineIds
          console.log(this.caseNames, "123")
        }
      })
    },
    // 保存自动化配置
    savePipeline() {
      this.$refs['autoConfigForm'].validate((valid) => {
        if (valid) {
          const params = {
            name: this.form.name,
            tags: this.form.tags,
            cases: this.form.cases,
            crontabSchedule: this.form.crontabSchedule,
            enableAutoTrigger: this.form.enableAutoTrigger,
            exec_env: this.form.execEnv,
            pipelineIds: this.form.pipelineIds,
            notifyChatIds: this.form.notifyChatIds
          }
          if (this.operation === operationEnum.ADD) {
            // @ts-ignore
            params.owner = this.owner
          } else if (this.operation === operationEnum.EDIT) {
            params.id = this.form.id
          }
          autoApi.createOrEditAutoConfig(params).then(
            () => {
              this.$emit('fatherMethod')
            }
          ).catch(() => {})
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    selectChange(event) {
      // 这个event数组只有label
      // 这里主要处理框内选中项的取消选中
      let arrNew = [];
      let caseIdNew = [];
      this.caseNodes.forEach(item => {
        event.forEach(eventItem => {
          if (eventItem == item.name) {
            arrNew.push(item)
            caseIdNew.push(item.id)
          }
        })
      })
      this.form.cases = caseIdNew
      this.$refs.caseTree.setCheckedNodes(arrNew)
    },
    // eslint-disable-next-line no-unused-vars
    handleCheckChange (data, checked, indeterminate) {
      let res = this.$refs.caseTree.getCheckedNodes(true, true);
      let arrPath = [];
      let arr = [];
      let caseNodes = [];
      res.forEach(item => {
        arrPath.push(item.id);
        arr.push(item.name)
        caseNodes.push(item)
      })
      this.form.cases = arrPath
      this.caseNames = arr;
      this.caseNodes = caseNodes;
    },
    // 搜索树
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // select-tree filter_method
    selectFilterNodeMethod(val) {
      this.$refs.caseTree.filter(val)
    }
  }
}
</script>

<style scoped>

</style>
