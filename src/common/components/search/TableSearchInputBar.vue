<template>
  <!-- 监听输入框回车事件，回车绑定到输入框失焦，避免触发两次事件 -->
  <el-input
    ref="input"
    v-model="inputValue"
    :placeholder="placeholder"
    clearable
    prefix-icon="el-icon-search"
    @blur="handleSearch"
    @clear="handleClear"
    @keyup.enter.native="$event.target.blur"
  />
</template>

<script lang="ts">
export default {
  name: "TableSearchInputBar",
  props: {
    placeholder: {
      type: String,
      default: '根据名称搜索'
    }
  },
  data() {
    return {
      inputValue: '',
    }
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.inputValue)
    },
    handleClear() {
      this.$refs.input.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/utils";

.el-input {
  width: $search-bar-width
}
</style>
