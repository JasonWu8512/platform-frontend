<template>
  <common-component title="sonar结果">
    <template>
      <el-table size="large"
                :data="tableData"
                :cell-style="cellStyle">
        <el-table-column prop="appName" label="应用"/>
        <el-table-column prop="lang" label="语言"/>
        <el-table-column prop="checkResult" label="扫描结论">
          <template v-slot:default="scope">
            <el-tag :type="tagType(scope.row.checkResult)" effect="dark">{{scope.row.checkResult}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="blocker" label="Blocker问题数"/>
        <el-table-column prop="critical" label="Critical问题数"/>
        <el-table-column prop="sonarUrl" label="问题详情">
          <template slot-scope="scope">
            <a :href="scope.row.sonarUrl" target="_blank">
              {{scope.row.appName}}</a>
          </template>
        </el-table-column>
      </el-table>
    </template>

  </common-component>


</template>

<script>
import {testPlanApi} from "@/api"
import CommonComponent from "@/pages/track/plan/view/comonents/report/components/CommonComponent"

export default {
  name: "SonarResult",
  components: {CommonComponent},
  props: {
    pipelineIds: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  // watch: {
  //   pipelineIds() {
  //     console.log('pipelineIdsidsids', this.pipelineIds)
  //     this.getTableData()
  //   }
  // },
  mounted() {
    this.getTableData()
  },
  methods: {
    tagType(status){
      if (status === '通过') {
        return 'success'
      }else if(status === '不通过') {
        return 'danger'
      }
    },
    cellStyle(){
      return 'font: 13px Arial;font-weight: 500; color: #606266;'
    },
    getTableData() {
      console.log('pipelineids', this.pipelineIds)
      if (this.pipelineIds.length > 0)
      {
        testPlanApi.getSonarResult({pipelineIds: this.pipelineIds}).then(res => {
          this.tableData = res.data.data
        })
      }

    }
  }
}
</script>

<style scoped>

</style>
