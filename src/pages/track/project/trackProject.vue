<template>
  <el-card v-loading="loading">
    <div slot="header" class="card-header">
      <span class="title">项目</span>
      <table-search-input-bar placeholder="根据名称搜索" @search="handleSearch"/>
    </div>
    <el-table :data="projects" :header-cell-style="headerStyle">
      <el-table-column label="名称" prop="name" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="table-col">{{ scope.row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">

      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import fontStyle from "@/assets/css/font.scss"
import TableSearchInputBar from "@/common/components/search/TableSearchInputBar.vue"


export default {
  name: "trackProject",
  components: {TableSearchInputBar},
  data() {
    return {
      createVisible: false,
      projects: this.projects,
      result: {},
      projectName: '',
      condition: {},
      tapd: false,
      jira: false,
      zentao: false,
      form: {},
      currentPage: 1,
      pageSize: 5,
      total: 0,
    }
  },
  props: {
    baseUrl: String,
  },
  inject: ['loading', 'projects'],
  methods: {
    handleSearch(value: string) {
      console.log(value)
      // testCaseApi.getTestCaseModules({})
    },
    headerStyle() {
      return `padding: 17px 0 font-family: ${fontStyle['fontFamily']}`
    }
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";
@import "src/assets/css/font";
@import "src/assets/css/utils";

.el-table {
  cursor: pointer;
}

pre {
  margin: 0 0;
}

.title {
  @extend %font-title;
}

.el-card {
  @extend %el-card;
}

.el-table {
  margin-top: -15px;
  @extend %font-14;
}

.table-col {
  padding: 9px 0;
}

.card-header {
  @extend %flex-between-top-row;
}
</style>
