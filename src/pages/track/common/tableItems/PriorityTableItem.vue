<template>
  <span>
    <span v-if="text">{{ priorityType[value] }}</span>
    <div v-else>
      <el-tag v-if="value === priorityEnum.P1" effect="dark" size="mini" type="danger">
        {{ priorityType[value] }}
      </el-tag>
      <el-tag v-if="value === priorityEnum.P2" effect="dark" size="mini" type="warning">
        {{ priorityType[value] }}
      </el-tag>
      <el-tag v-if="value === priorityEnum.P3" size="mini" type="danger">
        {{ priorityType[value] }}
      </el-tag>
    </div>
  </span>
</template>

<script lang="ts">
import {priorityEnum, priorityType} from '@/constant/TestCase'

export default {
  name: "PriorityTableItem",
  props: {
    value: Number,
    text: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      priorityEnum: priorityEnum,
      priorityType: priorityType,
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
