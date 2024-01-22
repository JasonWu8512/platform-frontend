<template>
  <table-search-component v-model="component.operator.value" :component="component">
    <template v-slot="scope">
      <el-input v-model="scope.component.value" v-bind="props" placeholder="请输入内容" size="small"/>
    </template>
  </table-search-component>
</template>

<script lang="ts">
import TableSearchComponent from "@/common/components/search/TableSearchComponet.vue"

export default {
  name: "TableSearchInput",
  components: {TableSearchComponent},
  props: ['component'],
  data() {
    return {
      props: {
        maxlength: "60",
        showWordLimit: true,
        ...this.component.props
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
