<template>
  <div>
    <el-button :disabled="cancelDisable" size="medium" @click="cancel">取消</el-button>
    <el-button :disabled="confirmDisable" size="medium" type="primary" @click="confirm" @keydown.enter.native.prevent>
      确认
    </el-button>
  </div>
</template>

<script lang="ts">
export default {
  name: "DialogFooter",
  props: {
    cancelDisable: {
      type: Boolean,
      default: false,
    },
    confirmDisable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel")
    },
    confirm() {
      this.$emit("confirm")
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button {
  //size: ;
}
</style>
