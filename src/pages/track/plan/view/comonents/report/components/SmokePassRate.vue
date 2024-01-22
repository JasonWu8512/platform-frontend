<template>
  <common-component title="开发冒烟结果">
    <template>
      <el-table
        class="adjust-table"
        :data="data"
        stripe
        style="width: 100%"
        size="large"
      >
        <el-table-column
          prop="name"
          label="冒烟计划"
        >
        </el-table-column>
        <el-table-column
          prop="story"
          label="提测需求"
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
        label="未执行">
        </el-table-column>
        <el-table-column
          prop="approvalCount"
          label="提测次数">
        </el-table-column>
        <el-table-column
          prop="rejectCount"
          label="打回次数"
        >
<!--          <template v-slot:default="scope">-->
<!--            {{scope.row.passRate}}%-->
<!--          </template>-->
        </el-table-column>
      </el-table>
    </template>

  </common-component>


</template>

<script>
import CommonComponent from "@/pages/track/plan/view/comonents/report/components/CommonComponent";

export default {
  name: "SmokePassRate",
  components: {CommonComponent},
  data() {
    return {

    }
  },
  props: {
    data: {type: Array}
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
<style scoped>

</style>
