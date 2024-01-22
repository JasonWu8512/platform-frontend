<template>
  <div>
    <el-input v-model="filterText" placeholder="搜索模块" size="small">
      <el-button
        v-if="type === operationEnum.EDIT && !disabled"
        slot="append"
        icon="el-icon-folder-add"
        @click="openEditNodeDialog(operationEnum.ADD)"
      />
    </el-input>

    <el-tree
      ref="tree"
      :data="treeNodes"
      :default-expanded-keys="expandedNode"
      :draggable="draggable"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      class="node-tree"
      highlight-current
      node-key="id"
    >
      <template slot-scope="{node, data}">
        <span class="custom-tree-node father" @click="handleNodeSelect(node, data)">
          <span class="node-title">
            <i class="el-icon-folder node-icon"/>
            {{ data.name }}
          </span>
          <span v-if="type === operationEnum.EDIT && !disabled" class="node-operate child">
            <el-tooltip
              :open-delay="200"
              content="重命名"
              effect="dark"
              placement="top"
            >
              <i
                class="el-icon-edit"
                @click.stop="openEditNodeDialog(operationEnum.EDIT, data)"
              />
            </el-tooltip>
            <el-tooltip
              :open-delay="200"
              content="添加子模块"
              effect="dark"
              placement="top"
            >
              <i
                class="el-icon-circle-plus-outline"
                @click.stop="openEditNodeDialog(operationEnum.ADD, data)"
              />
            </el-tooltip>
            <el-tooltip
              :open-delay="200"
              content="删除"
              effect="dark"
              placement="top"
            >
              <i class="el-icon-delete" @click.stop="remove(data)"/>
              </el-tooltip>
          </span>
        </span>
      </template>
    </el-tree>
    <node-edit
      ref="nodeEdit"
      :current-project="currentProject"
      :tree-nodes="treeNodes"
      @refreshNode="refreshNode"
    />
  </div>
</template>

<script lang="ts">
import {testCaseApi} from "@/api"
import {typeNode} from "@/api/types/testTrackType"
import {PathName} from "@/constant/routeData"
import {operationEnum} from "@/constant/TestCase"
import NodeEdit from "@/pages/track/common/NodeEdit.vue"

export default {
  name: "NodeTree",
  components: {NodeEdit},
  data() {
    return {
      operationEnum: operationEnum,
      expandedNode: [],
      filterText: "",
    }
  },
  props: {
    treeNodes: Array,
    currentNode: Object,
    currentProject: Object,
    type: {
      type: String,
      default: operationEnum.VIEW
    },
    draggable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    filterText(val: any) {
      this.$refs.tree.filter(val)
    },
    treeNodes() {
      if (this.currentNode.id) {
        // DOM加载完成再执行下一步操作
        this.$nextTick(() => {
          this.handleNodeSelect(this.$refs.tree.getNode(this.currentNode.id), this.currentNode)
        })
      }
    }
  },
  methods: {
    remove(data: { name: string; id: string }) {
      this.$alert(
        `确认删除模块: ${data.name}，以及模块下所有子模块和测试用例，评审及测试计划关联的用例？`,
        "",
        {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonText: '取消',
          callback: (action: string) => {
            if (action === "confirm") {
              testCaseApi.deleteTestCaseModules(data.id)
                .then(() => {
                  this.$emit("refreshNode")
                  // 清除当前选择节点
                  this.$emit("update:currentNode", {})
                  this.$router.push({
                    name: PathName.TestTrackTestcaseProject,
                    params: {projectId: this.currentProject.id}
                  })
                })
            }
          }
        }
      )
    },
    handleNodeSelect(node: typeNode, data: { id: string }) {
      if (node) {
        let pNodes: typeNode[] = []
        this.getParentNodes(node, pNodes)
        this.expandedNode.push(data.id)
        this.$refs.tree.setCurrentKey(data.id)
        this.$emit("nodeSelectEvent", data, pNodes, node)
      }
    },
    getParentNodes(currentNode: typeNode, pNodes: typeNode[]) {
      if (currentNode.level && currentNode.level !== 1) {
        this.getParentNodes(currentNode.parent, pNodes)
      }
      if (currentNode.data && currentNode.data.id !== "") {
        pNodes.push(currentNode.data)
      }
    },
    filterNode(value: string, data: { name: string }) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    openEditNodeDialog(type: operationEnum, data?: typeNode) {
      this.$refs.nodeEdit.open(type, data)
    },
    refreshNode() {
      this.$emit("refreshNode")
      this.$emit("refreshTable")
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";
@import "src/assets/css/font";

.el-input {
  margin-top: 15px;
}

.node-tree {
  margin-top: 15px;
}

.custom-tree-node {
  @extend %flex-between-center-row;
  @extend %font-14;
  padding-right: 8px;
  width: 100%;
}

.father .child {
  display: none;
}

.father:hover .child {
  display: block;
}

.node-icon {
  margin-right: 5px;
}

.node-title {
  white-space: nowrap;
  overflow: hidden;
}

.node-operate > i {
  color: #409eff;
  margin: 0 5px;
}
</style>
