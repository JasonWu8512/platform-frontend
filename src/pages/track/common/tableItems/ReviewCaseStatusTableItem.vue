<template>
  <div>
    <el-tag v-if="value === reviewCaseStatusEnum.INIT" effect="dark" type="info">
      {{ reviewCaseStatusType[value] }}
    </el-tag>
    <el-tag v-else-if="value === reviewCaseStatusEnum.PASS" effect="dark" type="success">
      {{ reviewCaseStatusType[value] }}
    </el-tag>
    <el-tag v-else-if="value === reviewCaseStatusEnum.REJECT" effect="dark" type="danger">
      {{ reviewCaseStatusType[value] }}
    </el-tag>
  </div>
</template>

<script>
import {reviewCaseStatusEnum, reviewCaseStatusType} from '@/constant/TestReivew'

export default {
  name: "ReviewCaseStatusTableItem",
  props: {
    value: String
  },
  data() {
    return {
      reviewCaseStatusEnum: reviewCaseStatusEnum,
      reviewCaseStatusType: reviewCaseStatusType,
    }
  }
}
</script>

<style scoped>

</style>
