<template>
  <el-tabs v-model="editableTabsValue" type="border-card" class="tabStyle" @change="changeTab">
    <el-tab-pane
      :key=item.scene
      v-for="item in editableTabs"
      :label="item.scene"
      :name="item.scene"
    >
      <data-tools :datas="item.children"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import toolApi from "@/api/tool"
import dataTools from "./dataTools"
export default {
  name: "dataTool",
  components: {dataTools},
  data() {
    return {
      editableTabs: [],
      editableTabsValue: ""
    }
  },
  methods: {
    changeTab(){},
    getScenes() {
      toolApi.getScenes().then(res => {
        this.editableTabs = res.data.map(item => {
          return {
            chineseScene: item.project,
            scene: item.project,
            children: item.datas
          }
        })
        console.log('operation', this.editableTabs)
        this.editableTabsValue = this.editableTabs[0].scene
      });
    },
  },
  mounted() {
    this.getScenes()
  }
}
</script>

<style scoped lang="scss">
.tabStyle {
  height: calc(100vh - 135px);
  background-color: #f3f4f6;
}

</style>

<style>
.el-tabs--border-card>.el-tabs__header .el-tabs__item {
  font-size: 12px;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
  background-color: #f3f4f6 !important;
}
</style>
