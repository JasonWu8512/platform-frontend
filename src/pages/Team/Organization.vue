<template>
  <el-card>
    <el-row>
      <el-col :span="4">
        <el-select v-model="departmentName" style="width: 100%;padding-right: 15px">
          <el-option :value="departmentId" style="height: auto">
            <el-tree :data="organizations"
                     :props="defaultProps"
                     node-key="id"
                     ref="tree"
                     highlight-current
                     @node-click="handleNodeClick">
            </el-tree>

          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="selectedAccounts"
                   filterable
                   multiple
                   collapse-tags
                   placeholder="请选择成员" @change="changeSelect"
                   style="width: 100%;padding-right: 15px">
          <el-checkbox-button v-model="checked" @change='selectAll' style="padding-left: 5px;">全选</el-checkbox-button>
          <el-option v-for="account in accountOptions" :key="account.id" :label="account.name" :value="account.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-date-picker
          v-model="start_end_date"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          style="width: 100%;padding-right: 15px">
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-button @click="getAccountTasksGantt" type="primary" round>查询</el-button>
      </el-col>
    </el-row>
<!--    <el-card :v-loading="loading">-->
      <gantt style="margin-top: 30px; border-top: 1px solid #E6E6E6" :items="config" :v-loading="loading"></gantt>
<!--    </el-card>-->

  </el-card>
</template>

<script>
import organizationApi from '@/api/organization'
import gantt from "@/pages/Team/components/gantt"
import Qs from "qs"
export default {
name: "organization",
  components: {gantt},
  data() {
  return {
    loading: false,
    checked: false,
    config: {
      tasks: {},
      rows: {'1': {
          assignee: '',
        }},
      time: {from: 0, to: 0}
    },

    start_end_date: [],
    departmentId: '',
    departmentName: '',
    defaultProps: {
      children: 'children',
      label: 'name',
      value: 'id'
    },
    organizations: [],
    accountOptions: [],
    selectedAccounts: [],
    pickerOptions: {
      shortcuts: [{
        text: '最近一周',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
          picker.$emit('pick', [start, end]);
        }
      }, {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
          picker.$emit('pick', [start, end]);
        }
      }, {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
          picker.$emit('pick', [start, end]);
        }
      }]
    },
  }
  },
  mounted() {
    this.getOrganization();
    var end = new Date();
    var start = new Date();
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
    this.start_end_date = [start.format('yyyy-MM-dd'), end.format('yyyy-MM-dd')]
  },
  methods: {
    getOrganization(){
      organizationApi.getAceDepartment({}).then(res => {
        this.organizations = res.data
        this.departmentId = this.organizations[0].id
        this.departmentName = this.organizations[0].name
        this.getAccountByDepartment()
      })
    },
    getAccountByDepartment() {
      organizationApi.getAccountByDepartment({openDepartmentId: this.departmentId}).then(res => {
        this.accountOptions = res.data
      })
    },
    getAccountTasksGantt() {
      this.loading = true
      this.config = {
        tasks: {},
        rows: {'1': {
            assignee: '',
          }},
        time: {from: 0, to: 0}
      }
      organizationApi.getAccountTaskGantt({start_date:this.start_end_date[0], end_date: this.start_end_date[1]}, Qs.stringify({account_ids: this.selectedAccounts}, {arrayFormat: 'repeat'})).then(
        res => {
          this.config.time = res.data.time
          res.data.items.forEach(item => {
            this.config.tasks[item['id']] = Object.assign({}, item, {style: { // 每个块的样式
                'border-radius': '1px',
                'background': '#4caeca'
              }})
          })
          res.data.rows.forEach((item, index) => {
            this.config.rows[String(index + 1)] = item
          })
          })
          this.loading = false
    },
    handleNodeClick(node){
      this.checked = false
      this.departmentName = node[this.defaultProps.label]
      this.departmentId = node[this.defaultProps.value]
      this.selectedAccounts = []
      organizationApi.getAccountByDepartment({openDepartmentId: this.departmentId}).then(res => {
        this.accountOptions = res.data
        this.checked = true
        this.selectAll()
      })
    },
    selectAll(){
      this.selectedAccounts = []
      if (this.checked) {
        this.accountOptions.map((item) => {
          this.selectedAccounts.push(item.id)
        })
      } else {
        this.selectedAccounts = []
      }
    },
    changeSelect(val) {
      this.checked = val.length === this.accountOptions.length;
    },

  }
}
</script>

<style lang="scss">
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
  background-color: #ffffff !important;
}
.el-tree__empty-text {
  top: 30% !important;
  font-size: 12px !important;
}
.el-tree-node__label {
  font-size: 12px !important;
}
.el-checkbox__label {
  font-size: 12px !important;
}
.el-checkbox-button__inner {
  border-radius: 4px !important;
  border: 0 !important;
}
</style>
