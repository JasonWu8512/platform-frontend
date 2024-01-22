<template>
  <el-dialog :visible.sync="dialogVisible" class="dialog-title" title="导入测试用例" @close="close">

    <el-tabs v-model="activeName" simple>
      <!-- Xmind 导入 -->
      <el-tab-pane label="思维导图" name="xmindImport" style="border: 0">
        <el-row class="import-row">
          <div class="el-step__icon is-text step-icon">
            <div class="el-step__icon-inner">1</div>
          </div>
          <label class="ms-license-label">导入说明</label>
        </el-row>
        <el-row class="import-row">
          <el-card :body-style="{ padding: '0px' }">
            <img alt="" class="testcase-import-img" src="@/assets/img/xmind.png">
          </el-card>

        </el-row>
        <el-row class="import-row">
          <div class="el-step__icon is-text step-icon">
            <div class="el-step__icon-inner">2</div>
          </div>
          <label class="ms-license-label">上传文件</label>
        </el-row>
        <el-row class="import-row">
          <el-upload
            :before-upload="handleBeforeUpload"
            :http-request="handleUpload"
            :show-file-list="false"
            action="."
            style="margin-right: 10px;"
          >
            <template v-slot:trigger>
              <el-button plain size="mini" type="success">点击上传</el-button>
            </template>
            <template v-slot:tip>
              <div class="el-upload__tip">支持文件类型：.xmind；</div>
            </template>
          </el-upload>
        </el-row>
      </el-tab-pane>

    </el-tabs>
  </el-dialog>
</template>

<script lang="ts">

import {testCaseApi} from "@/api"
import {buildUploadFileParams} from "@/pages/track/common/utils"

export default {
  name: "TestCaseImport",
  data() {
    return {
      result: {},
      activeName: 'xmindImport',
      dialogVisible: false,
    }
  },
  props: {
    selectNode: Object,
    currentProject: Object,
  },
  mounted() {
    this.$eventBus.$on('TestCaseImport', () => {
      this.open()
    })
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    },
    handleBeforeUpload(file: File) {
      // console.log('handleBeforeUpload', file)
      const isMatch = file.type === 'application/vnd.xmind.workbook' || file.name.replace(/.+\./, "") === 'xmind'
      if (!isMatch) {
        this.$message.error('文件只支持XMind格式！')
      }
      return isMatch
    },
    handleUpload(event: { file: File }) {
      const file = event.file
      const body: FormData = buildUploadFileParams({
        projId: this.currentProject.id,
        treeId: this.selectNode.id,
        caseFile: file
      })
      testCaseApi.uploadXMind(body)
        .then(() => {
          this.$emit("refresh")
          this.close()
        })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/utils";

.dialog-title {
  @extend %dialog-title;
}

.import-row {
  padding-top: 20px;
}

.step-icon {
  background-color: #C9E6F8;
  border-color: #C9E6F8 !important;
  margin-right: 10px;
}

</style>
