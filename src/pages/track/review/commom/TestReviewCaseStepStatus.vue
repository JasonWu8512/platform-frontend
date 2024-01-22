<template>
  <span v-if="value === stepStatusEnum.PASS" style="color: #7ebf50">
    {{ stepStatusType[value] }}
  </span>
  <span v-else-if="value === stepStatusEnum.FAIL" style="color: #e57471">
      {{ stepStatusType[value] }}
  </span>
  <span v-else-if="value === stepStatusEnum.BLOCK" style="color: #dda451">
      {{ stepStatusType[value] }}
  </span>
  <span v-else-if="value === stepStatusEnum.SKIP" style="color: #919399">
      {{ stepStatusType[value] }}
  </span>
</template>

<script lang="ts">
import {stepStatusEnum, stepStatusType} from '@/constant/TestCase'

export default {
  name: "TestReviewCaseStepStatus",
  props: {
    value: String,
  },
  data() {
    return {
      stepStatusEnum: stepStatusEnum,
      stepStatusType: stepStatusType,
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
