<template>
  <div class="project_menu">
    <span class="menu-title">{{ `[${title}]` }}</span>
    <el-select
      slot="prepend"
      v-model="value"
      filterable
      size="small"
      @change="changeData"
    >
      <el-option v-for="item in data" :key="item.id" :label="item.name" :value="item.id"/>
    </el-select>
  </div>
</template>

<script lang="ts">
export default {
  name: "SelectMenu",
  props: {
    data: Array,
    title: String,
    currentData: Object,
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    currentData() {
      this.value = this.currentData.id
    },
  },
  methods: {
    changeData(value: string) {
      const data = this.data.find((item: { id: string }) => item.id === value)
      this.$emit("dataChange", data)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";

.project_menu {
  @extend %flex-left-center-row;
  margin-left: 10px;
  margin-right: 10px;
}

.menu-title {
  white-space: nowrap;
  color: darkgrey;
  margin-right: 10px;
}
</style>
