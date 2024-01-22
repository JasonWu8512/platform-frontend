<template>
  <el-dialog
    :before-close="close"
    :title="type === operationEnum.EDIT ? '重命名' : '添加模块'"
    :visible.sync="dialogFormVisible"
    class="dialog-title"
    width="30%"
  >
    <el-row justify="center" type="flex">
      <el-col :span="18">
        <el-form ref="nodeForm" :model="form" :rules="rules" @submit.native.prevent>
          <el-form-item
            label="模块名称"
            label-width="80px"
            prop="name"
          >
            <el-input v-model="form.name"/>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <template slot="footer">
      <dialog-footer @cancel="close" @confirm="saveNode"/>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {testCaseApi} from "@/api"
import {RequestCreateTestCaseModules} from "@/api/types/testTrack"
import {typeNode} from "@/api/types/testTrackType"
import DialogFooter from "@/common/components/DialogFooter.vue"
import {operationEnum} from "@/constant/TestCase"


export default {
  components: {DialogFooter},
  data() {
    return {
      operationEnum: operationEnum,
      name: "NodeEdit",
      form: {
        name: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {max: 30, message: '长度必须小于30', trigger: 'blur'}
        ]
      },
      type: '',
      node: {},
      dialogFormVisible: false,
    }
  },
  props: {
    treeNodes: Array,
    currentProject: Object,
  },
  methods: {
    open(type: operationEnum, node: typeNode) {
      this.type = type
      this.node = node
      if (type === operationEnum.EDIT) {
        this.form.name = this.node.name
      } else {
        this.form.name = ''
      }
      this.dialogFormVisible = true
    },
    saveNode() {
      this.$refs.nodeForm.validate((valid: boolean) => {
        if (valid) {
          if (!this.currentProject.id) {
            this.$message.warning('暂无项目，请先创建项目')
            return
          }
          if (this.form.name.trim() === '') {
            this.$message.warning('请输入名称')
            return
          }
          this.buildParam()
        } else {
          return false
        }
      })
    },
    buildParam() {
      let body: RequestCreateTestCaseModules = {
        name: this.form.name,
        projId: this.currentProject.id
      }
      if (this.type === operationEnum.ADD) {
        if (this.node) {
          //根节点，添加需要带上父节点id
          body = Object.assign({parent: this.node.id}, body)
        }
        testCaseApi.createTestCaseModules(body)
          .then(() => {
            this.$emit("refreshNode")
            this.close()
          })
      } else if (this.type === operationEnum.EDIT) {
        testCaseApi.updateTestCaseModules(this.node.id, body)
          .then(() => {
            this.$emit("refreshNode")
            this.close()
          })
      }
    },
    close() {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/utils";

.dialog-title {
  @extend %dialog-title;
}
</style>
