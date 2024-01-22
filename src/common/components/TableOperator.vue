<template>
  <span>
    <slot name="front"/>
    <el-tooltip v-if="showSonar" :content="sonarTip" placement="top">
      <el-button
          :disabled="sonarDisable || readOnly"
          :icon="sonarIcon"
          circle
          size="mini"
          type="info"
          @click.native.stop="sonarClick"
      />
    </el-tooltip>
    <slot name="middle"/>
    <el-tooltip v-if="showEdit" :content="editTip" placement="top">
      <el-button
        :disabled="editDisable || readOnly"
        :icon="editIcon"
        circle
        size="mini"
        type="primary"
        @click.native.stop="editClick"
      />
    </el-tooltip>
    <slot name="middle"/>
    <el-tooltip v-if="showCopy" :content="copyTip" placement="top">
      <el-button
        :disabled="copyDisable || readOnly"
        :icon="copyIcon"
        circle
        size="mini"
        type="success"
        @click.native.stop="copyClick"
      />
    </el-tooltip>
    <el-tooltip v-if="showReport" :content="reportTip" placement="right">
      <el-button
        :disabled="reportDisable || readOnly"
        :icon="reportIcon"
        circle
        size="mini"
        type="success"
        @click.native.stop="reportClick"
      />
    </el-tooltip>
    <slot name="behind"/>
    <el-tooltip v-if="showRun" :content="runTip" placement="top">
      <el-button
        :disabled="runDisable || readOnly"
        :icon="runIcon"
        circle
        size="mini"
        type="warning"
        @click.native.stop="runClick"
      />
    </el-tooltip>
    <slot name="last"/>
    <el-tooltip v-if="showDelete" :content="deleteTip" placement="top">
      <el-button
        :disabled="deleteDisable || readOnly"
        :icon="deleteIcon"
        circle
        size="mini"
        type="danger"
        @click.native.stop="deleteClick"
      />
    </el-tooltip>
    <slot name="latest"/>
 </span>
</template>

<script lang="ts">
export default {
  name: "TableOperator",
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
    sonarTip: {
      type: String,
      default: 'sonar'
    },
    editTip: {
      type: String,
      default: '编辑'
    },
    copyTip: {
      type: String,
      default: '复制'
    },
    deleteTip: {
      type: String,
      default: '删除'
    },
    runTip: {
      type: String,
      default: '执行'
    },
    reportTip: {
      type: String,
      default: '复制'
    },
    sonarDisable: {
      type: Boolean,
      default: false,
    },
    editDisable: {
      type: Boolean,
      default: false
    },
    copyDisable: {
      type: Boolean,
      default: false
    },
    deleteDisable: {
      type: Boolean,
      default: false
    },
    runDisable: {
      type: Boolean,
      default: false
    },
    reportDisable: {
      type: Boolean,
      default: false
    },
    sonarIcon: {
      type: String,
      default: 'el-icon-finished'
    },

    editIcon: {
      type: String,
      default: 'el-icon-edit'
    },
    copyIcon: {
      type: String,
      default: 'el-icon-document-copy'
    },
    deleteIcon: {
      type: String,
      default: 'el-icon-delete'
    },
    runIcon: {
      type: String,
      default: 'el-icon-video-play'
    },
    reportIcon: {
      type: String,
      default: 'el-icon-document-copy'
    },
    showSonar: {
      type: Boolean,
      default: false,
    },
    showEdit: {
      type: Boolean,
      default: false,
    },
    showCopy: {
      type: Boolean,
      default: false,
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
    showRun: {
      type: Boolean,
      default: false
    },
    showReport: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    sonarClick() {
      this.$emit('sonarClick')
    },
    editClick() {
      this.$emit('editClick')
    },
    copyClick() {
      this.$emit('copyClick')
    },
    deleteClick() {
      this.$emit('deleteClick')
    },
    runClick() {
      this.$emit('runClick')
    },
    reportClick() {
      this.$emit('reportClick')
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
