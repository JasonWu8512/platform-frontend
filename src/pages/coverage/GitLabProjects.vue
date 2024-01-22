<template>
  <el-card>
    <template slot="header">
      <table-header :condition="condition"
                    placeholder="(每次搜索只返回20条数据，请输入更精准的project名称搜索)"
                    :showCreate="false"
                    :showSearch="true"
                    @search="handleGetProjects"
      >
        <template slot="title">
          <div>GitLab Projects</div>
        </template>
      </table-header>

    </template>
    <!--    <div slot="header" class="title">-->
    <!--      <span>流水线构建记录</span>-->
    <!--    </div>-->
    <el-table :data="tableData" size="medium" v-loading="loading">
      <el-table-column prop="pathWithNamespace" label="name with group"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column prop="createdAt" label="创建时间">
        <template v-slot:default="scope">
          <span>{{new Date(scope.row.createdAt).format('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <table-operator
            copy-tip="查看分支"
            show-copy
            copyIcon="el-icon-share"
            @copyClick="handleToBranches(scope.row)"
          >
          </table-operator>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import {coverageApi} from "@/api"
import TableHeader from "@/common/components/TableHeader.vue"
import TableOperator from "@/common/components/TableOperator.vue";
import {PathName} from "@/constant/routeData";
export default {
  name: "GitLabProjects",
  components: {TableHeader, TableOperator},
  data() {
    return {
      condition: {},
      tableData: []
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
  },
  mounted() {
    this.handleGetProjects('')
  },
  methods: {
    handleGetProjects(value?: string) {
      coverageApi.getGitlabProjects({search: value}).then(res => {
        this.tableData = res.data
      })
    },
    handleToBranches(row?: any) {
      this.$router.push({name: PathName.GitLabProjectBranches,
        query: {
          projectId: row.id,
          projectName: row.pathWithNamespace
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
