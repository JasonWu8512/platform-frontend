<template>

  <common-component title="模块测试结果">
    <template>
      <el-table
        highlight-current-row
        class="adjust-table"
        :data="tableData"
        stripe
        style="width: 100%"
        size="large"
        :cell-style="cellStyle"
      >
        <el-table-column
          prop="module"
          label="模块"
        >
        </el-table-column>
        <el-table-column
          prop="project"
          label="所属项目"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="caseCount"
          label="用例数"
        >
        </el-table-column>
        <el-table-column
          prop="pass"
          label="通过"
        >
        </el-table-column>
        <el-table-column
          prop="fail"
          label="失败"
        >
        </el-table-column>
        <el-table-column
          prop="block"
          label="阻塞"
        >
        </el-table-column>
        <el-table-column
          prop="skip"
          label="跳过"
        >
        </el-table-column>
        <el-table-column
          prop="init"
          label="未执行"
        >
        </el-table-column>

        <el-table-column
          prop="passRate"
          label="通过率"
        >
          <template v-slot:default="scope">
            {{scope.row.passRate}}%
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="issueCount"-->
<!--          label="缺陷数"-->
<!--        >-->
<!--        </el-table-column>-->
      </el-table>
    </template>

  </common-component>

</template>

<script>
import CommonComponent from "./CommonComponent";
export default {
  name: "ModuleExecuteResult",
  components: {CommonComponent},
  props: {
    data: {
      type: Array,
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  watch: {
    data() {
      this.getTableData()
    }
  },
  methods: {
    getTableData(){
      this.tableData = this.data.map(item => {
        return {
          module: item.module,
          project: item.project,
          caseCount: item.caseCount,
          init: item.init,
          pass: item.pass,
          fail: item.fail,
          skip: item.skip,
          block: item.block,
          passRate: item.passRate,
          // issueCount: item.issueCount ? item.issueCount : 0,
        }
      })
    },
    cellStyle(){
      return 'font: 13px Arial;font-weight: 500; color: #606266;'
    }
  },
  mounted() {
    this.getTableData()
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
