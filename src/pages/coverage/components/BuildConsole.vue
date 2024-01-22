<template>
  <div style="background-color: #000000; color: #ffffff">
    <div style="font-size: 2em; font-weight: bold;">#{{step}} Console Output</div>
    <pre class="console-text">
      <code>{{consoleText}}</code>
    </pre>
    <i class="el-icon-loading" style="font-size: 18px; margin-top: 4px;" v-if="isBuilding"></i>
  </div>
</template>

<script>
import {coverageApi} from "@/api";

export default {
name: "buildConsole",
  computed:{
    pipelineId() {
      return this.$route.params.pipelineId
    },
    step() {
      return this.$route.params.step ? this.$route.params.step : ''
    }
  },
  data() {
  return {
    consoleText: '',
    isBuilding: true,
  }
  },
  mounted() {
    this.PolingGetConsoleOutput()
  },
  destroyed() {
    clearInterval(this.myInterval);
  },
  methods: {
    getBuildConsole(){
      if (this.step === 'deploy') {
        coverageApi.getPipelineDeployConsole(this.pipelineId).then(res => {
          this.consoleText = res.data.text
          this.isBuilding = res.data.isBuilding
        })
      } else {
        coverageApi.getPipelineCoverageConsole(this.pipelineId).then(res => {
          this.consoleText = res.data.text
          this.isBuilding = res.data.isBuilding
        })
      }
      if (this.isBuilding === false){
        clearInterval(this.myInterval);
      }
    },
    PolingGetConsoleOutput() {
      this.getBuildConsole();
      // 每3秒轮询获取日志
      this.myInterval = window.setInterval(() => {
        setTimeout(() => {
          this.getBuildConsole()
        }, 1)
      }, 3000)
    },
  },
}
</script>

<style scoped>
.console-text {
  text-align: left;
  background-color: #2b2b2b;
  color: #e9eded;
  padding: 10px 20px;
  white-space: pre-wrap;
}

</style>
