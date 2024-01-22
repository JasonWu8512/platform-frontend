<template>
  <el-badge :hidden="!isDotHidden" class="item" is-dot>
    <el-dropdown @command="handleChange" @click.native.stop>
      <span>
        <el-tag v-if="value === planInstanceStatusEnum.INIT" effect="dark" size="mini" type="info">
          {{ planInstanceStatusType[value] }}
        </el-tag>
        <el-tag v-else-if="value === planInstanceStatusEnum.PENDING" effect="dark" size="mini" type="primary">
          {{ planInstanceStatusType[value] }}
        </el-tag>
        <el-tag v-else-if="value === planInstanceStatusEnum.APPROVED" effect="dark" size="mini" type="success">
          {{ planInstanceStatusType[value] }}
        </el-tag>
        <el-tag v-else-if="value === planInstanceStatusEnum.REJECTED" effect="dark" size="mini" type="danger">
          {{ planInstanceStatusType[value] }}
        </el-tag>
        <el-tag v-else-if="value === planInstanceStatusEnum.CANCELED" effect="dark" size="mini" type="warning">
          {{ planInstanceStatusType[value] }}
        </el-tag>
      </span>
      <el-dropdown-menu v-if="value === planInstanceStatusEnum.PENDING" slot="dropdown">
        <el-dropdown-item :command="planInstanceStatusEnum.APPROVED">通过</el-dropdown-item>
        <el-dropdown-item :command="planInstanceStatusEnum.REJECTED">拒绝</el-dropdown-item>
      </el-dropdown-menu>
      <el-dropdown-menu v-else slot="dropdown"></el-dropdown-menu>
    </el-dropdown>
  </el-badge>
</template>

<script lang="ts">
import {planInstanceStatusEnum, planInstanceStatusType} from "@/constant/TestPlan"

export default {
  name: "PlanTestTableItem",
  props: {
    value: {
      type: String
    },
    isDotHidden: {
      type: Boolean
    }
  },
  data() {
    return {
      planInstanceStatusEnum: planInstanceStatusEnum,
      planInstanceStatusType: planInstanceStatusType,
    }
  },
  methods: {
    handleChange(command: any) {
      this.$emit("approvalStatus", command)
      this.$emit("handleChange")
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-badge__content.is-dot {
  margin-top: 2px;
}
</style>
