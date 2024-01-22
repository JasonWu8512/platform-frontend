<template>
  <span>{{ planStageType[value] }}</span>
</template>

<script lang="ts">
import {planStageType} from "@/constant/TestPlan"

export default {
  name: "PlanStageTableItem",
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      planStageType: planStageType,
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
