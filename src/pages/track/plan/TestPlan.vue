<template>
  <div>
    <test-plan-list ref="testPlanList" :condition.sync="condition" stage="notSmoke"/>
    <test-plan-edit ref="testPlanEditDialog" :condition="condition" @refresh="refresh"/>
    <packaging-test ref="packingTestDialog" @refresh="refresh"/>
  </div>
</template>

<script lang="ts">

import PackagingTest from "@/pages/track/plan/components/PackagingTest.vue"
import TestPlanEdit from "@/pages/track/plan/components/TestPlanEdit.vue"
import TestPlanList from "@/pages/track/plan/components/TestPlanList.vue"

export default {
  name: "TestPlan",
  components: {PackagingTest, TestPlanEdit, TestPlanList},
  data() {
    return {
      condition: {},
    }
  },
  methods: {
    refresh() {
      this.$refs.testPlanList.initTableData()
    },
  }
}
</script>

<style lang="scss" scoped>
.card-content {
  overflow-y: auto;
}
</style>
