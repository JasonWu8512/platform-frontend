<template>
  <common-component title="缺陷列表">
    <template>
      <el-table
        class="adjust-table"
        :data="data"
        stripe
        style="width: 100%"
        size="medium"
        :cell-style="cellStyle"
      >
        <el-table-column
          prop="key"
          label="关键字"
        >
        </el-table-column>
        <el-table-column
          prop="summary"
          label="主题"
          show-overflow-tooltip
          width="400"
        >
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="type"-->
<!--          label="问题类型"-->
<!--        >-->
<!--        </el-table-column>-->
        <el-table-column label="bug子等级" prop="subBugLevel"></el-table-column>
        <el-table-column
          prop="statusChinese"
          label="状态"
        >
          <template v-slot:default="scope">
            <el-tag :type="tagType(scope.row)" effect="dark">{{scope.row.statusChinese}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="assignee"
          label="经办人"
        >
        </el-table-column>
        <el-table-column
          prop="creator"
          label="报告人"
        >
        </el-table-column>
      </el-table>
    </template>

  </common-component>
</template>

<script>
import CommonComponent from "./CommonComponent";
export default {
name: "BugList",
  components: {CommonComponent},
  props: {
  data: {type: Array}
  },
  methods: {
    cellStyle(){
      return 'font: 13px Arial;font-weight: 500; color: #606266;'
    },
    tagType(row){
      if (row.status === 'Done') {
        return 'success'
      }else if(row.status === 'ToDo') {
        return 'info'
      }else if(row.status === 'Fixed') {
        return ''
      }else if(row.status === 'Closed') {
        return 'success'
      }else if(row.status === 'Reopened') {
        return 'danger'
      }else {
        return 'warning'
      }
    }
  }
}
</script>

<style scoped>

</style>
