<template>
  <el-container v-loading="loading">
    <el-aside v-if="!asideHidden">
      <node-tree
        ref="nodeTree"
        :current-node="selectNode"
        :disabled="selectNode.id === undefined"
        :draggable="nodeTreeDraggable"
        :treeNodes="treeNodes"
        :type="operationEnum.VIEW"
        @nodeSelectEvent="handleSelect"
        @refresh="reloadMenu"
      />
    </el-aside>
    <el-main :class="asideHidden ? 'main-class' : ''">
      <test-case-plan-list
        ref="testCasePlanList"
        :select-node="selectNode"
        :select-parent-nodes="selectParentNodes"
        :tree-nodes="treeNodes"
        @refresh="refresh"
        @testCaseEdit="editTestCase"
      />
    </el-main>
    <hidden-button @click="handleClick"/>
    <!--    <test-case-edit-->
    <!--      ref="testCaseEditDialog"-->
    <!--      :current-project="selectNode"-->
    <!--      :read-only="readOnly"-->
    <!--      :select-node="selectNode"-->
    <!--      :tree-nodes="treeNodes"-->
    <!--      @refresh="refreshTable">-->
    <!--    </test-case-edit>-->
    <!--    <div>-->
    <!--          <test-plan-functional v-if="activeIndex === 'functional'" :plan-id="planId"/>-->
  </el-container>
</template>

<script lang="ts">

import {testPlanApi} from "@/api"
import {typeNode} from "@/api/types/testTrackType"
import variables from "@/assets/css/utils.scss"
import HiddenButton from "@/common/components/side/HiddenButton.vue"
import {PathName} from "@/constant/routeData"
import {operationEnum} from "@/constant/TestCase"
import NodeTree from "@/pages/track/common/NodeTree.vue"
import TestCasePlanList from "@/pages/track/plan/view/comonents/TestCasePlanList.vue"

export default {
  name: "TestPlanView",
  components: {
    HiddenButton,
    TestCasePlanList,
    NodeTree
  },
  data() {
    return {
      operationEnum: operationEnum,
      testPlans: [],
      treeNodes: [],
      selectNode: {},
      selectParentNodes: [],
      activeIndex: "functional",
      isMenuShow: true,
      nodeTreeDraggable: false,
      asideHidden: false,
    }
  },
  computed: {
    planId() {
      return this.$route.params.planId
    },
    projId() {
      return this.$route.query.projId
    },
    treeId() {
      return this.$route.query.treeId
    },
    loading() {
      return this.$store.state.loading
    },
    hiddenButtonPosition() {
      return variables['hiddenButtonPosition']
    },
  },
  watch: {
    '$route'() {
      if (this.planId && !(this.treeId || this.projId)) {
        this.getTestPlanCaseTree()
      }
    },
  },
  mounted() {
    if (this.planId) {
      this.getTestPlanCaseTree()
    }
    if (this.projId || this.treeId) {
      this.selectNode.id = this.projId | this.treeId
    }
  },
  methods: {
    getTestPlanCaseTree() {
      // 清除面包屑导航
      this.selectParentNodes = []
      testPlanApi.getTestCasePlanCaseTree(this.planId)
        .then(({data}) => {
          this.treeNodes = data
        })
    },
    handleSelect(data: typeNode, pNodes: any, node: typeNode) {
      this.selectParentNodes = pNodes
      this.selectNode = data
      this.$refs.testCasePlanList.currentPage = 1
      const _query = node.level === 1 ? {projId: data.id} : {treeId: data.id}
      this.$router.push({
        name: PathName.TestTrackCasePlanView,
        query: _query
      })
    },
    openTemplateReport() {
      this.$refs.testReportTemplateList.open(this.planId)
    },
    editTestCase() {

    },
    refresh() {
      this.$refs.testCasePlanList.initTableData()
      this.getTestPlanCaseTree()
    },
    reloadMenu() {
      this.isMenuShow = false
      this.$nextTick(() => {
        this.isMenuShow = true
      })
    },
    handleClick(isHidden: Boolean) {
      this.asideHidden = isHidden
    }
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/utils";

.el-aside {
  padding: 10px;
  background: white;
  width: $aside-tree-width !important;
}

.select-menu {
  display: inline-block;
}

.header-menu.el-menu--horizontal > li {
  height: 49px;
  line-height: 50px;
  color: dimgray;
}

.main-class {
  padding: 0;
}

</style>
