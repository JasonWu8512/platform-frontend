<template>
  <div class="status-button">
    <el-button
      :icon="status === reviewStatusEnum.INIT ? 'el-icon-check' : ''"
      round
      type="info"
      @click="setStatus(reviewStatusEnum.INIT)"
    >
      {{ reviewStatusType[reviewStatusEnum.INIT] }}
    </el-button>
    <el-button
      :icon="status === reviewStatusEnum.IN_PROGRESS ? 'el-icon-check' : ''"
      round
      type="primary"
      @click="setStatus(reviewStatusEnum.IN_PROGRESS)"
    >
      {{ reviewStatusType[reviewStatusEnum.IN_PROGRESS] }}
    </el-button>
    <el-button
      :icon="status === reviewStatusEnum.DONE? 'el-icon-check' : ''"
      round
      type="success"
      @click="setStatus(reviewStatusEnum.DONE)"
    >
      {{ reviewStatusType[reviewStatusEnum.DONE] }}
    </el-button>
    <el-button
      :icon="status === reviewStatusEnum.REJECT? 'el-icon-check' : ''"
      round
      type="danger"
      @click="setStatus(reviewStatusEnum.REJECT)"
    >
      {{ reviewStatusType[reviewStatusEnum.REJECT] }}
    </el-button>
  </div>
</template>

<script>
import {reviewStatusEnum, reviewStatusType} from '@/constant/TestReivew'

export default {
  name: "TestReviewStatusButton",
  props: {
    status: {
      type: String
    }
  },
  data() {
    return {
      reviewStatusEnum: reviewStatusEnum,
      reviewStatusType: reviewStatusType,
    }
  },
  methods: {
    setStatus(status) {
      this.$emit('statusChange', status);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";

.status-button {
  @extend %flex-left-center-row;
}

</style>
