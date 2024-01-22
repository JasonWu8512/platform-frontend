<template>
  <el-card v-loading="loading">
    <div slot="header" class="title">
      <slot name="header">{{ title }}</slot>
    </div>

    <template class="el-main">
      <div>
        <slot></slot>
      </div>
    </template>

  </el-card>

</template>

<script>

export default {
  name: "CommonComponent",
  props: {
    title: {
      type: String,
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

.title {
  font-size: 16px;
  font-weight: 700;
  text-align: left;
}

.el-main {
  min-height: 200px;
}

</style>
