<template>
  <el-tabs v-model="activePannel">
    <el-tab-pane label="mock工具" name="mock">
      <mock-switch></mock-switch>
    </el-tab-pane>
    <el-tab-pane label="数据工具" name="datatools">
      <data-tool></data-tool>
    </el-tab-pane>
  </el-tabs>


</template>

<script>
import dataTool from "./dataTool"
import MockSwitch from "./mockSwitch"
export default {
  components: {MockSwitch, dataTool},
  data() {
    return {
      activePannel: 'mock',
    }
  }
}
</script>

<style lang="scss">

</style>
