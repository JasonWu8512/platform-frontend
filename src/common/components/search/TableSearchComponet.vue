<template>
  <div>
    <div class="search-label">{{ component.label }}</div>

    <el-select
      v-model="component.operator.value"
      v-bind="component.operator.props"
      class="search-operator"
      placeholder="请选择"
      size="small"
      @change="change"
      @input="input"
    >
      <el-option v-for="o in operators" :key="o.value" :label="o.label" :value="o.value"/>
    </el-select>

    <div v-if="showContent" class="search-content">
      <slot v-bind:component="component"/>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "TableSearchComponent",
  props: ['component'],
  data() {
    return {
      operators: this.component.operator.options || [],
    }
  },
  methods: {
    change(value: string) {
      if (this.component.operator.change) {
        this.component.operator.change(this.component, value)
      }
      this.$emit('change', value);
    },
    input(value: string) {
      this.$emit('input', value);
    }
  },
  computed: {
    showContent() {
      if (this.component.isShow) {
        return this.component.isShow(this.component.operator.value);
      }
      return true;
    }
  }
}
</script>

<style lang="scss" scoped>
.search-label {
  display: inline-block;
  width: 120px;
  box-sizing: border-box;
  padding-left: 5px;
}

.search-operator {
  display: inline-block;
  width: 120px;
}

.search-content {
  display: inline-block;
  padding: 0 5px 0 10px;
  width: calc(100% - 240px);
  box-sizing: border-box;
}
</style>
