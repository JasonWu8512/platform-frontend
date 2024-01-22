<template>
  <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
    <span>{{ content }}</span>
    <span slot="footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitFunc">确 定</el-button>
        </span>
  </el-dialog>
</template>

<script>
export default {
name: "myDialog",
  props: {
    content: {
      type: String,
      default: '确定要做该操作吗？'
    },
    centerDialogVisible: {
      type: Boolean,
      default: false
    },
  },
  watch:{
  centerDialogVisible() {
    console.log('centerDialogVisible', this.centerDialogVisible)
  },
  },
  methods:{
    submitFunc() {
      this.$emit("callFather")
    },
    cancel() {
      this.centerDialogVisible=false;
      this.$emit('centerDialogVisible', this.centerDialogVisible)
    },
  }
}
</script>

<style scoped>

</style>