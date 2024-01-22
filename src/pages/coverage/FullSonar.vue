<template>
  <el-card class="card-content">
    <template slot="header">
      <template slot="title">
        <div>sonar扫描结果</div>
      </template>
    </template>
    <el-table :data="tableDatas" size="medium"  ref="sonarTable" v-loading="loading">
      <el-table-column label="应用名称" prop="appName"/>
      <el-table-column label="负责人" prop="owner"/>
      <el-table-column label="blocker级别问题" prop="blocker"/>
      <el-table-column label="critical级别问题" prop="critical"/>
      <el-table-column label="sonar问题详情">
        <template slot-scope="scope">
          <div>
            <a :href="'http://sonar.jlgltech.com/dashboard?id='+scope.row.appName" target="_blank">
              {{scope.row.appName}}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="语言类型" prop="lang"/>
    </el-table>
    <table-pagination
      :change="getFullSonarList"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="total"
    />
  </el-card>
</template>

<script>
import TablePagination from "../../common/components/pagination/TablePagination";
import {PAGINATION_SIZE} from "../../constant";
import {sonarApi} from "@/api"
export default {
  name: "FullSonar",
  components: {TablePagination},
  props: {},
  data(){
    return{
      condition: {},
      total: 0,
      pageSize: PAGINATION_SIZE.XLARGE,
      currentPage: 1,
      searchName: '',
      tableDatas: [],
    }
  },
  mounted() {
    this.getFullSonarList()
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
  },
  methods: {
    getFullSonarList(){
      const params = {
        limit: this.pageSize,
        offset: this.currentPage,
      }
      sonarApi.getAllSonarInfos(params).then(res=>{
        this.tableDatas = res.data.data
        this.total = 51
        }
      )
    },
    handlePollingDataList(){
      this.currentPage = 1
      this.getFullSonarList()
    }
  }
}
</script>

<style scoped>

</style>
