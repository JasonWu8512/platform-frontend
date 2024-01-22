<template>
  <div>
    <el-card style="margin-top: 20px">
      <div slot="header" class="title">
        <span>月度资源报告</span>
        <el-date-picker
          v-model="month"
          :clearable="false"
          placeholder="选择月"
          type="month"
          value-format="yyyy-MM"
          style="width: 200px;float: right; padding: 3px 0; border: 0;"
        />
      </div>
      <el-table :data="tableData"
                row-key="id"
                size="medium"
                v-loading="loading" style="margin-top: -10px">
        <template v-for="col in columns">
          <el-table-column :prop="col.prop" :label="col.label" :key="col.prop" :width="col.width">
            <template slot-scope="scope">
              <el-input v-if="col.editable" style="width: 60%"
                        @change="changeMark(scope.row)"
                        @keyup.enter.native="$event.target.blur"
                        v-model="scope.row[col.prop]"></el-input>
              <span v-else>{{scope.row[col.prop]}}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-card>
  </div>

</template>

<script>
import {jiraApi} from "@/api";

export default {
  name: "MonthResourceReport",
  data() {
    return{
      loading: false,
      month: '',
      tableData: [],
      columns: [
        {
          label: "部门",
          prop: "departName",
          editable: false,
        },
        {
          label: "负责人",
          prop: "leader",
          editable: false,
        },
        {
          label: "人数",
          prop: "peopleCount",
          editable: false,
        },
        {
          label: "工作日",
          prop: "workDays",
          editable: false,
        },
        {
          label: "总工时",
          prop: "totalWorkingDays",
          editable: false,
        },
        {
          label: "上月开始,本月完成",
          prop: "preDepartmentDays",
          editable: false,
        },
        {
          label: "本月开始,本月完成",
          prop: "currentDepartmentDays",
          editable: false,
        },
        {
          label: "本月开始,下月完成",
          prop: "nextDepartmentDays",
          editable: false,
        },
        {
          label: "工时差值",
          prop: "targetDaysDiff",
          editable: false,
        },
        {
          label: "饱和度",
          prop: "productivity",
          editable: false,
        },
        {
          label: "备注",
          prop: "mark",
          editable: true,
        }
      ]
    }

  },
  mounted() {
    this.getdatatime()
  },
  watch: {
    month() {
      this.getMonthReport()
    }
  },
  methods: {
    getdatatime(){
      this.month = new Date().format("yyyy-MM");
    },
    getMonthReport(){
      this.loading = true
      jiraApi.getMonthResourceReport({month: this.month}).then(res => {
        this.tableData = res.data.map(item => {
          return{
            id: item.id,
            departName: item.departName,
            leader: item.leader,
            peopleCount: item.peopleCount,
            workDays: item.workDays,
            totalWorkingDays: item.totalWorkingDays,
            preDepartmentDays: item.preDepartmentDays,
            currentDepartmentDays: item.currentDepartmentDays,
            nextDepartmentDays: item.nextDepartmentDays,
            targetDaysDiff: item.targetDaysDiff,
            productivity: item.productivity,
            mark: item.mark,
            editable: item.editable
          }
        })
        this.loading = false
      })

    },
    changeMark(row) {
      jiraApi.editMonthResourceReport(row.id, row).then(
        // eslint-disable-next-line no-unused-vars
        res => {
          this.getMonthReport()
        }
      )
    },
  }
}
</script>

<style scoped lang="scss">
.title {
  font-size: 20px;
  font-weight: 700;
  margin-left: 5px;
  line-height: 35px;
  text-align: left;
}
</style>
