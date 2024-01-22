<template>
  <el-row class="status-button">
    <el-col>
      <el-button
        :disabled="isReadOnly || isFailure"
        :icon="status === planResultEnum.PASS ? 'el-icon-check' : ''"
        :loading="loading && status === planResultEnum.PASS"
        round
        size="mini"
        type="success"
        @click="setStatus(planResultEnum.PASS)"
      >
        {{ planResultType[planResultEnum.PASS] }}
      </el-button>
    </el-col>
    <el-col>
      <el-button
        :disabled="isReadOnly"
        :icon="status === planResultEnum.FAIL ? 'el-icon-check' : ''"
        :loading="loading && status === planResultEnum.FAIL"
        round
        size="mini"
        type="danger"
        @click="setStatus(planResultEnum.FAIL)"
      >
        {{ planResultType[planResultEnum.FAIL] }}
      </el-button>
    </el-col>
    <el-col>
      <el-button
        :disabled="isReadOnly"
        :icon="status === planResultEnum.BLOCK ? 'el-icon-check' : ''"
        :loading="loading && status === planResultEnum.BLOCK"
        round
        size="mini"
        type="warning"
        @click="setStatus(planResultEnum.BLOCK)"
      >
        {{ planResultType[planResultEnum.BLOCK] }}
      </el-button>
    </el-col>
    <el-col>
      <el-button
        :disabled="isReadOnly"
        :icon="status === planResultEnum.SKIP ? 'el-icon-check' : ''"
        :loading="loading && status === planResultEnum.SKIP"
        round
        size="mini"
        type="info"
        @click="setStatus(planResultEnum.SKIP)"
      >
        {{ planResultType[planResultEnum.SKIP] }}
      </el-button>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {planResultEnum, planResultType} from '@/constant/TestPlan'

export default {
  name: "TestPlanCaseStatusButton",
  props: {
    status: {
      type: String
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    isFailure: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    }
  },
  data() {
    return {
      planResultEnum: planResultEnum,
      planResultType: planResultType,
    }
  },
  methods: {
    setStatus(status: planResultEnum) {
      this.$emit('statusChange', status)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";

.status-button {
  @extend %flex-left-center-row;
}

.el-col {
  margin-left: 20px;
}

</style>
