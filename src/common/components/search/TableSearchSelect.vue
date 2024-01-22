<template>
  <table-search-component v-model="component.operator.value" :component="component">
    <template v-slot="scope">
      <el-select
        v-model="scope.component.value"
        v-bind="scope.component.props"
        class="search-select"
        filterable
        placeholder="请选择"
        size="small"
      >
        <el-option v-for="op in options" :key="op.value" :label="label(op)" :value="op.value"/>
      </el-select>
    </template>
  </table-search-component>
</template>

<script lang="ts">
import TableSearchComponent from "@/common/components/search/TableSearchComponet.vue"

export default {
  name: "TableSearchSelect",
  components: {TableSearchComponent},
  props: ['component'],
  data() {
    return {
      options: !(this.component.options instanceof Array) ? [] : this.component.options || []
    }
  },
  created() {
    if (!(this.component.options instanceof Array) && this.component.options.url) {
      this.$get(this.component.options.url, (response: { data: { [x: string]: any }[] }) => {
        if (response.data) {
          response.data.forEach((item: { [x: string]: any }) => {
            this.options.push({
              label: item[this.component.options.labelKey],
              value: item[this.component.options.valueKey]
            })
          })
        }
      })
    }
  },
  computed: {
    label() {
      return (op: { label: string | string[] }) => {
        if (this.component.options.showLabel) {
          return this.component.options.showLabel(op);
        }
        return op.label.indexOf(".") !== -1 ? this.$t(op.label) : op.label;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-select {
  display: inline-block;
  width: 100%;
}
</style>
