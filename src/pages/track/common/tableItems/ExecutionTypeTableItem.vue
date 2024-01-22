<template>
  <span>{{ executionType[value] }}</span>
</template>

<script lang="ts">
import {executionType} from '@/constant/TestCase'

export default {
  name: "ExecutionTypeTableItem",
  props: {
    value: Number
  },
  data() {
    return {
      executionType: executionType,
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
