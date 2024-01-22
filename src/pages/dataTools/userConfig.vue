<template>
  <el-tabs v-model="activePannel">
    <el-tab-pane label="生成用户" name="generateAccount">
      <generate-account></generate-account>
    </el-tab-pane>
    <el-tab-pane label="修改用户" name="updateUser">
      <update-user></update-user>
    </el-tab-pane>
    <el-tab-pane label="转推关系" name="xshare">
      <relationship></relationship>
    </el-tab-pane>
    <el-tab-pane label="一键拼团" name="spellGroup">
      <spell-group></spell-group>
    </el-tab-pane>
    <el-tab-pane label="其他场景" name="other">
      <other-scene></other-scene>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import GenerateAccount from "@/pages/dataTools/components/generateAccount";
import Relationship from "@/pages/dataTools/components/relationship";
import UpdateUser from "@/pages/dataTools/components/updateUser";
import OtherScene from "@/pages/dataTools/components/otherScene";
import SpellGroup from "@/pages/dataTools/components/spellGroup";
export default {
  name: "userConfig",
  components: {SpellGroup, OtherScene, UpdateUser, Relationship, GenerateAccount},
  data() {
    return {
      activePannel: 'generateAccount'
    }
  }
}
</script>

<style scoped>

</style>
