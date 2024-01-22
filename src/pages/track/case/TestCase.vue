<template>
  <el-container v-loading="loading">
    <el-aside v-if="!asideHidden">
      <select-menu
        :current-data="currentProject"
        :data="projects"
        title="项目"
        @dataChange="changeProject"
      />
      <node-tree
        ref="nodeTree"
        :current-node.sync="selectNode"
        :current-project="currentProject"
        :disabled="currentProject.id === undefined"
        :draggable="nodeTreeDraggable"
        :tree-nodes="treeNodes"
        :type="operationEnum.EDIT"
        @nodeSelectEvent="nodeChange"
        @refreshNode="refreshNode"
        @refreshTable="refreshTable"
      />
    </el-aside>
    <el-main :class="asideHidden ? 'main-class' : ''">
      <test-case-list
        ref="testCaseList"
        :condition.sync="condition"
        :current-project="currentProject"
        :read-only.sync="readOnly"
        :select-node="selectNode"
        :select-parent-nodes="selectParentNodes"
        :tree-nodes="treeNodes"
        @refresh="refreshTable"
      />
    </el-main>
    <test-case-edit
      ref="testCaseEditDialog"
      :condition="condition"
      :current-project="currentProject"
      :read-only="readOnly"
      :select-node="selectNode"
      :tree-nodes="treeNodes"
      @refresh="refreshTable"
    />
    <test-case-import
      :current-project="currentProject"
      :select-node="selectNode"
      @refresh="refreshTable"
    />
    <hidden-button @click="handleClick"/>
  </el-container>
</template>

<script lang="ts">
import {testCaseApi} from "@/api"
import {typeNode, typeNodeData} from "@/api/types/testTrackType"
import variables from "@/assets/css/utils.scss"
import HiddenButton from "@/common/components/side/HiddenButton.vue"
import {PathName} from "@/constant/routeData"
import {operationEnum} from "@/constant/TestCase"
import TestCaseEdit from "@/pages/track/case/components/TestCaseEdit.vue"
import TestCaseImport from "@/pages/track/case/components/TestCaseImport.vue"
import TestCaseList from "@/pages/track/case/components/TestCaseList.vue"
import NodeTree from "@/pages/track/common/NodeTree.vue"
import SelectMenu from "@/pages/track/common/SelectMenu.vue"


export default {
  name: "TestCase",
  components: {
    HiddenButton,
    TestCaseImport,
    NodeTree,
    TestCaseList,
    TestCaseEdit,
    SelectMenu,
  },
  comments: {},
  data() {
    return {
      operationEnum: operationEnum,
      projects: this.projects,
      currentProject: {},
      treeNodes: [],
      selectNode: {},
      asideHidden: false,
      selectParentNodes: [],
      readOnly: true,
      nodeTreeDraggable: false,
      condition: {
        // components: TEST_CASE_CONFIGS
      },
    }
  },
  inject: ['projects'],
  computed: {
    projectId() {
      return this.$route.params.projectId
    },
    moduleId() {
      return this.$route.params.moduleId
    },
    loading() {
      return this.$store.state.loading
    },
    hiddenButtonPosition() {
      return variables['hiddenButtonPosition']
    },
  },
  watch: {
    selectNode() {
      // 值为空代表是节点被删除了或切换了项目
      if (!this.selectNode.id) {
        // 清除面包屑导航
        this.selectParentNodes = []
      }
    }
  },
  mounted() {
    let currentProject
    if (this.projectId) {
      currentProject = this.projects.find((item: { id: string }) => item.id === this.projectId)
    } else {
      currentProject = this.projects[0]
    }
    if (this.moduleId) {
      this.selectNode.id = this.moduleId
    }
    this.changeProject(currentProject, this.moduleId)
  },
  methods: {
    async changeProject(project: { id: string }, moduleId?: string) {
      this.currentProject = project
      await this.getNodeTree()
      if (!moduleId) {
        this.selectNode = {}
        this.refreshTable()
        await this.$router.push({
          name: PathName.TestTrackTestcaseProject,
          params: {projectId: project.id}
        })
      }
    },
    nodeChange(data: typeNodeData, pNodes: typeNode[]) {
      this.selectParentNodes = pNodes
      this.selectNode = data
      this.refreshTable()
      this.$router.push({
        name: PathName.TestTrackTestcaseModule,
        params: {projectId: this.currentProject.id, moduleId: data.id}
      })
    },
    async getNodeTree() {
      if (this.currentProject) {
        await testCaseApi.getTestCaseModules({projId: this.currentProject.id})
          .then((data) => {
            this.treeNodes = data.data
          })
      }
    },
    refreshNode() {
      this.getNodeTree()
    },
    refreshTable() {
      this.$nextTick(() => {
        // 重置页面
        this.$refs.testCaseList.currentPage = 1
        this.$refs.testCaseList.initTableData()
      })
    },
    handleClick(isHidden: Boolean) {
      this.asideHidden = isHidden
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/utils";

.el-aside {
  padding: 10px;
  background: white;
  width: $aside-tree-width !important;
}

.main-class {
  padding: 0;
}
</style>
