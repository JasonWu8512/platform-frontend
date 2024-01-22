<template>
  <span>
    <el-tag v-if="value === planStatusEnum.INIT" effect="dark" size="mini" type="info">
      {{ planStatusType[value] }}
    </el-tag>
    <el-tag v-else-if="value === planStatusEnum.IN_PROGRESS" effect="dark" size="mini" type="primary">
      {{ planStatusType[value] }}
    </el-tag>
    <el-tag v-else-if="value === planStatusEnum.DONE" effect="dark" size="mini" type="success">
      {{ planStatusType[value] }}
    </el-tag>
    <el-tag v-else-if="value === planStatusEnum.REJECT" effect="dark" size="mini" type="danger">
      {{ planStatusType[value] }}
    </el-tag>
    </span>
</template>

<script lang="ts">
import {planStatusEnum, planStatusType} from "@/constant/TestPlan"

export default {
  name: "PlanStatusTableItem",
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      planStatusEnum: planStatusEnum,
      planStatusType: planStatusType,
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
