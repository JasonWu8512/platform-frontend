<template>
    <span>
      <el-tag v-if="value === planResultEnum.INIT" effect="dark" type="info">
        {{ planResultType[value] }}
      </el-tag>
      <el-tag v-else-if="value === planResultEnum.IN_PROGRESS" effect="dark" type="primary">
        {{ planResultType[value] }}
      </el-tag>
      <el-tag v-else-if="value === planResultEnum.PASS" effect="dark" type="success">
        {{ planResultType[value] }}
      </el-tag>
      <el-tag v-else-if="value === planResultEnum.FAIL" effect="dark" type="danger">
        {{ planResultType[value] }}
      </el-tag>
      <el-tag v-else-if="value === planResultEnum.BLOCK" effect="dark" type="warning">
        {{ planResultType[value] }}
      </el-tag>
      <el-tag v-else-if="value === planResultEnum.SKIP " effect="dark" type="info">
        {{ planResultType[value] }}
      </el-tag>
    </span>
</template>

<script lang="ts">
import {planResultEnum, planResultType} from '@/constant/TestPlan'

export default {
  name: "PlanCaseStatusTableItem",
  props: {
    value: String
  },
  data() {
    return {
      planResultEnum: planResultEnum,
      planResultType: planResultType,
    }
  }
}
</script>

<style scoped>

</style>
