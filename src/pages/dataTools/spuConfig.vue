<template>
  <el-tabs v-model="activePannel">
    <el-tab-pane label="spu详情" name="spuDetail">
      <spu-detail></spu-detail>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import spuDetail from "@/pages/dataTools/components/spuDetail";

export default {
  name: "spuConfig",
  components: {spuDetail},
  data() {
    return {
      activePannel: 'spuDetail'
    }
  }
}
</script>

<style scoped>

</style>
