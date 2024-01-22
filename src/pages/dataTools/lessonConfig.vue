<template>
  <el-tabs v-model="activePannel">
    <el-tab-pane label="一键完课" name="lessonProgress">
      <lesson-progress></lesson-progress>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import LessonProgress from "@/pages/dataTools/components/lessonProgress";
export default {
  name: "lessonConfig",
  components: {LessonProgress},
  data() {
    return {
      activePannel: 'lessonProgress'
    }
  }
}
</script>

<style scoped>

</style>
