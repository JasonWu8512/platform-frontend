<template>
  <el-table :data="tableData"
            :row-class-name="tableRowClassName"
            :cell-style="cellStyle"
            size="medium"
            row-key="id"
            v-loading="loading">
    <template v-for="col in columns">
      <el-table-column :key="col.props" :label="col.label" :prop="col.props" :sortable="col.sortable">
        <template slot-scope="scope" style=" vertical-align: text-bottom">
          <div v-if="levels.indexOf(col.props) > -1 && scope.row[col.props]">
            <el-tag :type="tagType(col.props)"
                    effect="dark">
              {{scope.row[col.props]}}
            </el-tag>
          </div>
          <div v-else-if="scope.row[col.props] !== 0"><span>{{ scope.row[col.props]}}</span></div>
<!--          <div v-else>-->
<!--            -->
<!--          </div>-->
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
import jiraApi from '@/api/jira'
// import bugItems from "@/common/components/bugItems.vue"
// import myPieChart from "@/common/components/myPieChart.vue"

export default {
  name: "DepartmentMonthReport",
  data() {
    return {
      loading: false,
      chartSettings: {
        roseType: 'radius'
      },
      summaryData: {},
      levels: ['P0', 'P1', 'P2', 'P3', 'S0', 'S1', 'S2', 'S3'],
      tableData: [],
      columns: [{
        label: '组织部门',
        props: 'departName',
        sortable: false,
      },
        {
          label: '开发人数',
          props: 'peopleCount',
        },
        {
          label: '开发人天',
          props: 'day',
        },
        {
          label: '总bug数',
          props: 'count',
        },
        {
          label: '线上P0',
          props: 'P0',
        },{
          label: '线上P1',
          props: 'P1',
        },{
          label: '线上P2',
          props: 'P2',
        },{
          label: '线上P3',
          props: 'P3',
        },{
          label: '线下S0',
          props: 'S0',
        },{
          label: '线下S1',
          props: 'S1',
        },{
          label: '线下S2',
          props: 'S2',
        },{
          label: '线下S3',
          props: 'S3',
        },
        {
          label: '线下bug指数',
          props: 'offlineBugRate',
          sortable: true,
        },
        {
          label: 'P0~S1 平均解决时长(小时)',
          props: 'avgFixTime',
          sortable: true,
        },
        {
          label: 'P0~S1 fix->close时间(小时)',
          props: 'avgCloseTime',
          sortable:true
        }
      ],
    }
  },
  props: {
    month: {type: String}
  },
  watch: {
    month() {
      this.getDepartMonthReport();

    }
  },
  methods: {
    cellStyle(){
      return 'font: 13px Arial;font-weight: 500; color: #606266;'
    },
    tagType(value){
      if(['P0', 'P1', 'P2', 'P3'].indexOf(value) > -1) {
        return "danger"
      }
      else {
        return "warning"
      }

    },
    margin(index) {
      let mr = {
        "padding": "10px 0 10px 10px"
      }
      if (index % 2 === 0) {
        mr["padding"] = "10px 10px 10px 0"
      }
      return mr
    },
    tableRowClassName(row) {
      // console.log('row', row)
      if (row.row.bugLevel === '线上') {
        return 'bug-row';
      } else if (row.row.bugLevel === '线下') {
        return 'task-row';
      }
      return '';
    },
    getDepartMonthReport() {
      this.tableData = []
      this.loading = true
      jiraApi.getTestDepartmentMonthReport({month: this.month}).then(res => {
        this.summaryData = res.data.summary;
        this.summaryData.departName = '全部'
        res.data.summary.bugs.forEach(item => {
          let key = item.subBugLevel
          console.log('ppp', key)
          this.summaryData[key] = item.count
        })
        this.tableData.push(this.summaryData)
        res.data.details.forEach(item => {
          var data = {
            departName: item.departName,
            peopleCount: item.peopleCount === null ? 0 : item.peopleCount,
            count: item.count === null ? 0 : item.count,
            day: item.day,
            point: item.point === null ? 0 : item.point,
            onlinePoint: item.onlinePoint === null ? 0 : item.onlinePoint,
            offlinePoint: item.offlinePoint === null ? 0 : item.offlinePoint,
            offlineBugRate: item.offlineBugRate,
            avgFixTime: item.avgFixTime,
            avgCloseTime: item.avgCloseTime,
          };
          if (item.bugs != null) {
            item.bugs.forEach(value => {
              let key = value.subBugLevel
              data[key] = value.count
            })
          }

          this.tableData.push(data);
        })
        this.loading = false
        // console.log('ddddd', this.tableData)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/utils";

.dashboard-header {
  width: 100%;
  margin: 0 auto;
  //position: fixed;
  //position: absolute;
  top: 50px;
  background-color: #fff;
  text-align: left;
  padding: 5px;
  z-index: $header-z-index - 1;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  text-align: left;
}

</style>
