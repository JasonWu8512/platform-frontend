<template>
  <el-dialog
    :destroy-on-close="true"
    :visible.sync="dialogVisible"
    title="请选择用例目录"
    width="20%"
  >
    <node-tree :disabled="true" :tree-nodes.sync="treeNodes" @nodeSelectEvent="nodeClick"/>
    <template slot="footer">
      <dialog-footer @cancel="dialogVisible = false" @confirm="save"/>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {typeNode} from "@/api/types/testTrackType"
import DialogFooter from "@/common/components/DialogFooter.vue"
import NodeTree from "@/pages/track/common/NodeTree.vue"

export default {
  name: "BatchMove",
  components: {
    NodeTree,
    DialogFooter
  },
  data() {
    return {
      treeNodes: [],
      dialogVisible: false,
      currentKey: "",
    }
  },
  methods: {
    open(treeNodes: typeNode[]) {
      this.dialogVisible = true
      this.treeNodes = treeNodes
    },
    save() {
      if (!this.currentKey) {
        this.$message.warning('请选择模块')
        return
      }
      this.$emit("batchMove", this.currentKey);
      this.dialogVisible = false;
    },
    nodeClick(node: typeNode) {
      this.currentKey = node.id
    }
  }
}
</script>

<style lang="scss" scoped>
.node-title {
  width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 auto;
  padding: 0 5px;
  overflow: hidden;
}

</style>
