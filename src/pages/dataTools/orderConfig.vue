<template>
  <el-tabs v-model="activePannel">
    <el-tab-pane label="创建9.9订单" name="sampleOrder">
      <sample-order></sample-order>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import SampleOrder from "@/pages/dataTools/components/sampleOrder";
export default {
  name: "orderConfig",
  components: {SampleOrder},
  data() {
    return {
      activePannel: 'sampleOrder'
    }
  }
}
</script>

<style scoped>

</style>
