<template>
  <common-component title="需求列表">
    <template>
      <el-table
        class="adjust-table"
        :data="data"
        style="width: 100%"
        size="large"
        :cell-style="cellStyle"
      >
        <el-table-column
          prop="key"
          label="关键字"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="summary"
          label="需求描述"
        >
        </el-table-column>
        <el-table-column
          prop="statusChinese"
          label="状态"
          width="180"
        >
          <template v-slot:default="scope">
            <el-tag :type="tagType(scope.row)" effect="dark">{{scope.row.statusChinese}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="assignee"
          label="经办人"
          width="180"
        >
        </el-table-column>
      </el-table>
    </template>

  </common-component>


</template>

<script>
import CommonComponent from "@/pages/track/plan/view/comonents/report/components/CommonComponent";

export default {
name: "TicketList",
  components: {CommonComponent},
  data() {
  return {

  }
  },
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
<style lang="scss">
.adjust-table td {
  border-right: 0;
}

.adjust-table th {
  border-right-color: white;
}

.adjust-table {
  border-color: white;
}

.adjust-table:after {
  background-color: white;
}

.adjust-table th:not([class*="el-table-column--selection"]):hover:after {
  content: '';
  position: absolute;
  top: 25%;
  right: 0;
  height: 50%;
  width: 2px;
  background-color: #EBEEF5;
}

.adjust-table tr:hover td {
  border-right: 0;
}
</style>
<style scoped lang="scss">

</style>
