<template>
  <span>
    <el-tag v-if="value === reviewStatusEnum.INIT" effect="dark" size="mini" type="info">
      {{ reviewStatusType[value] }}
    </el-tag>
    <el-tag v-else-if="value === reviewStatusEnum.IN_PROGRESS" effect="dark" size="mini" type="primary">
      {{ reviewStatusType[value] }}
    </el-tag>
    <el-tag v-else-if="value === reviewStatusEnum.DONE" effect="dark" size="mini" type="success">
      {{ reviewStatusType[value] }}
    </el-tag>
    <el-tag v-else-if="value === reviewStatusEnum.REJECT" effect="dark" size="mini" type="danger">
      {{ reviewStatusType[value] }}
    </el-tag>
    </span>
</template>

<script lang="ts">
import {reviewStatusEnum, reviewStatusType} from "@/constant/TestReivew"

export default {
  name: "ReviewStatusTableItem",
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      reviewStatusEnum: reviewStatusEnum,
      reviewStatusType: reviewStatusType,
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
