<template>
  <table-search-component v-model="component.operator.value" :component="component">
    <template v-slot="scope">
      <el-date-picker
        :key="type"
        v-model="scope.component.value"
        v-bind="scope.component.props"
        :type="type"
        end-placeholder="结束日期"
        placeholder="选择日期"
        range-separator="至"
        size="small"
        start-placeholder="开始日期"
        value-format="timestamp"
      >
      </el-date-picker>
    </template>
  </table-search-component>
</template>

<script lang="ts">
import TableSearchComponent from "@/common/components/search/TableSearchComponet.vue"
import {OPERATORS} from "./search-components"

export default {
  name: "TableSearchDatePicker",
  components: {TableSearchComponent},
  props: ['component'],
  methods: {
    change(value: string) {
      if (value === OPERATORS.BETWEEN.value) {
        if (!Array.isArray(this.component.value)) {
          this.component.value = [];
        }
      } else {
        if (Array.isArray(this.component.value)) {
          this.component.value = "";
        }
      }
    }
  },
  computed: {
    type() {
      if (this.component.operator.value === OPERATORS.BETWEEN.value) {
        return "daterange";
      } else {
        return "date";
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
