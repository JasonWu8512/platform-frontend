<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>
      <span class="el-breadcrumb__item" @click="showAll">
        <i class="el-icon-s-home" style="margin-right: 5px"/>
        {{ title }}
      </span>
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="node in data" :key="node.id">{{ node.name }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
export default {
  name: "NodeBreadcrumb",
  data() {
    return {
      data: []
    }
  },
  props: {
    nodes: {
      type: Array
    },
    title: {
      type: String,
      default: '全部用例'
    }
  },
  watch: {
    nodes() {
      this.filterData()
    }
  },
  created() {
    this.filterData()
  },
  methods: {
    showAll() {
      this.$emit('refresh')
    },
    filterData() {
      this.data = this.nodes
      if (this.data.length > 4) {
        let lastData = this.data[this.data.length - 1]
        this.data.splice(1, this.data.length)
        this.data.push({id: lastData.id + '1', name: '...'})
        this.data.push(lastData)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";
@import "src/assets/css/font";

.el-breadcrumb__item {
  @extend %font-title;
  @extend %flex-left-top-row;
  margin: 0 auto;
  cursor: pointer;
}

</style>
