<template>
  <div class="status-button">
    <el-button
      :icon="status === planStatusEnum.INIT ? 'el-icon-check' : ''"
      round
      type="info"
      @click="setStatus(planStatusEnum.INIT)"
    >
      {{ planStatusType[planStatusEnum.INIT] }}
    </el-button>
    <el-button
      :icon="status === planStatusEnum.IN_PROGRESS ? 'el-icon-check' : ''"
      round
      type="primary"
      @click="setStatus(planStatusEnum.IN_PROGRESS)"
    >
      {{ planStatusType[planStatusEnum.IN_PROGRESS] }}
    </el-button>
    <el-button
      :icon="status === planStatusEnum.DONE? 'el-icon-check' : ''"
      round
      type="success"
      @click="setStatus(planStatusEnum.DONE)"
    >
      {{ planStatusType[planStatusEnum.DONE] }}
    </el-button>
    <el-button
      v-if="showReject"
      :icon="status === planStatusEnum.REJECT? 'el-icon-check' : ''"
      round
      type="danger"
      @click="setStatus(planStatusEnum.REJECT)"
    >
      {{ planStatusType[planStatusEnum.REJECT] }}
    </el-button>
  </div>
</template>

<script>
import {planStatusEnum, planStatusType} from '@/constant/TestPlan'

export default {
  name: "TestPlanStatusButton",
  props: {
    status: String,
    showReject: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      planStatusEnum: planStatusEnum,
      planStatusType: planStatusType,
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
