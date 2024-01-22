<template>
  <div>
    <el-container>
      <el-header class="dashboard-header" height="40px">
        <el-row>
          <el-col>
            <el-date-picker
                v-model="month"
                :clearable="false"
                placeholder="选择月"
                type="month"
                value-format="yyyy-MM"
            />
          </el-col>
        </el-row>
      </el-header>
      <el-container style="height: calc(100vh - 120px)">
        <el-main style="margin-top: 15px; padding: 0">
          <el-card v-loading="loading">
            <div slot="header" class="card-title">
              <el-tooltip class="item" effect="dark" placement="bottom">
                <div slot="content" style="line-height: 20px">
                  bug指数 = 线下bug分 / 总人天数; <br/>
                  线下bug分 = S0_count * 20 + S1_count * 5 + S2_count * 3 + S3_count * 1; <br/>
                </div>

                <i class="el-icon-question"></i>
              </el-tooltip>
              <span>线下bug指数月度走势</span>
            </div>
            <month-trend-report :month="month"></month-trend-report>
          </el-card>
<!--          <bug-time :month="month"></bug-time>-->
          <el-card style="margin-top: 20px" v-loading="loading">
            <div slot="header" class="card-title">
              <span>缺陷总览</span>
            </div>
            <el-table :data="tableData"
                      :row-class-name="tableRowClassName"
                      :cell-style="cellStyle"
                      size="medium"
                      row-key="id">
              <template v-for="col in columns">
                <el-table-column :key="col.props" :label="col.label" :prop="col.props" :sortable="col.sortable">
                  <template slot-scope="scope" style=" vertical-align: text-bottom">
                    <div v-if="levels.indexOf(col.props) > -1 && scope.row[col.props]">
                      <el-tag :type="tagType(col.props)"
                              effect="dark">
                        {{scope.row[col.props]}}
                      </el-tag>
                    </div>
                    <div v-else>
                      <span>{{ scope.row[col.props]}}</span>
                    </div>
                  </template>
                </el-table-column>
              </template>
            </el-table>
            <!--        <div>-->
            <!--          <el-row>-->
            <!--            <el-col :span="8">-->
            <!--              <bug-items :item="summaryData"></bug-items>-->
            <!--            </el-col>-->
            <!--            <el-col :span="14">-->
            <!--              <my-pie-chart :data="summaryBugs" height="400px%"-->
            <!--                            name="bug等级"-->
            <!--                            text="缺陷分布图"-->
            <!--                            width="100%"></my-pie-chart>-->
            <!--            </el-col>-->
            <!--          </el-row>-->
            <!--        </div>-->
          </el-card>
          <el-card style="margin-top: 20px" v-loading="loading">
            <div slot="header" class="card-title">
              <span>缺陷总览/组织架构</span>
            </div>
            <department-month-report :month="month"></department-month-report>
          </el-card>
          <!--      <el-row>-->
          <!--        <div-->
          <!--            v-for="(item, index) in details"-->
          <!--            :key="index"-->
          <!--            style="margin: 10px 0"-->
          <!--        >-->
          <!--          <el-col :span="12" :style="margin(index)">-->
          <!--            <el-card body-style="height: 350px" v-loading="loading">-->
          <!--              <div slot="header" class="card-title">-->
          <!--                <span>{{ item.projName }}</span>-->
          <!--              </div>-->
          <!--              <div>-->
          <!--                <el-row>-->
          <!--                  <el-col :span="10">-->
          <!--                    <bug-items :item="item"></bug-items>-->
          <!--                  </el-col>-->
          <!--                  <el-col :span="14">-->
          <!--                    <my-pie-chart :data="item.bugs" name="bug等级" text="缺陷分布图" width="100%"/>-->
          <!--                  </el-col>-->
          <!--                </el-row>-->
          <!--              </div>-->
          <!--            </el-card>-->
          <!--          </el-col>-->
          <!--        </div>-->
          <!--      </el-row>-->
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import jiraApi from '@/api/jira'
// import bugItems from "@/common/components/bugItems.vue"
// import myPieChart from "@/common/components/myPieChart.vue"
import {PathName} from '@/constant/routeData'
// import bugTime from "@/pages/jira/components/bugTime"
import DepartmentMonthReport from "@/pages/jira/DepartmentMonthReport"
import MonthTrendReport from "@/pages/jira/MonthTrendReport"

export default {
  name: "MonthReport",
  components: {MonthTrendReport, DepartmentMonthReport},
  data() {
    return {
      chartSettings: {
        roseType: 'radius'
      },
      month: '',
      summaryData: {},
      levels: ['P0', 'P1', 'P2', 'P3', 'S0', 'S1', 'S2', 'S3'],
      tableData: [],
      columns: [{
        label: '项目',
        props: 'projName',
        sortable: false,
      },
        {
          label: '开发人数',
          props: 'peopleCount'
        },
        {
          label: '开发人天',
          props: 'day',
        },{
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
  computed: {
    loading() {
      return this.$store.state.loading
    }
  },
  watch: {
    month() {
      this.$router.push({name: PathName.MonthReport, query: {month: this.month}})
      this.getMonthReport();

    }
  },
  methods: {
    cellStyle(){
      return 'font: 13px Arial;font-weight: 500; color: #606266;'
    },
    tagType(value){
      // let tag = {
      //   "background-color": "#fde2e2",
      //   "border": 0,
      //   "width": "25px",
      //   "text-align": "center"
      // }
      if(['P0', 'P1', 'P2', 'P3'].indexOf(value) > -1) {
        return "danger"
      }
      else {
        return "warning"
      }

      // if (value === 'Done') {
      //   return 'success'
      // }else if(value === 'ToDo') {
      //   return 'info'
      // }else if(value === 'Fixed') {
      //   return ''
      // }else if(value === 'Closed') {
      //   return 'success'
      // }else if(value === 'Reopened') {
      //   return 'danger'
      // }else {
      //   return 'warning'
      // }
      // return tag
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
    getMonthReport() {
      this.tableData = []
      jiraApi.getTestMonthReport({month: this.month}).then(res => {
        this.summaryData = res.data.summary;
        // this.summaryBugs = res.data.summary.bugs.map(item => {
        //   return {
        //     name: item.bugLevel + '-' + item.subBugLevel,
        //     value: item.count,
        //   }
        // })
        this.summaryData.projName = '全部'
        // this.summaryData.bugLevel = '全部'
        // // this.summaryData.combineBugLevel = '全部'
        // this.summaryData.id = '0'
        res.data.summary.bugs.forEach(item => {
          let key = item.subBugLevel
          console.log('ppp', key)
          this.summaryData[key] = item.count
        })
        // this.summaryData.bugs = res.data.summary.bugs.map(item => {
        //     return {
        //       id: '0' + item.subBugLevel,
        //       bugLevel: item.bugLevel,
        //       combineBugLevel: item.bugLevel + '-' + item.subBugLevel,
        //       count: item.count,
        //       projName: '全部'
        //     }
        //   })
        this.tableData.push(this.summaryData)
        res.data.details.forEach(item => {
          var data = {
            id: item.projId,
            projName: item.projName,
            count: item.count === null ? 0 : item.count,
            peopleCount: item.peopleCount === null ? 0 : item.peopleCount,
            day: item.day,
            point: item.point === null ? 0 : item.point,
            onlinePoint: item.onlinePoint === null ? 0 : item.onlinePoint,
            offlinePoint: item.offlinePoint === null ? 0 : item.offlinePoint,
            offlineBugRate: item.offlineBugRate,
            avgFixTime: item.avgFixTime,
            avgCloseTime: item.avgCloseTime,
            // bugLevel: '全部',
            // combineBugLevel: '全部',
          };
          if (item.bugs != null) {
            item.bugs.forEach(value => {
              let key = value.subBugLevel
              data[key] = value.count
            })
          }

          this.tableData.push(data);
        // this.details = res.data.details.map(item => {
        //   let bugs = []
        //   if (item.bugs != null) {
        //     bugs = item.bugs.map(value => {
        //       return {
        //         name: value.bugLevel + '-' + value.subBugLevel,
        //         value: value.count,
        //       }
        //     })
        //   }
        //   return {
        //     projName: item.projName,
        //     count: item.count === null ? 0 : item.count,
        //     day: item.day,
        //     point: item.point === null ? 0 : item.point,
        //     onlinePoint: item.onlinePoint === null ? 0 : item.onlinePoint,
        //     offlinePoint: item.offlinePoint === null ? 0 : item.offlinePoint,
        //     offlineBugRate: item.offlineBugRate,
        //     bugs: bugs
        //   }
        })
        // console.log('ddddd', this.tableData)
      })
    },
  },
  mounted() {
    this.month = this.$route.query.month ? this.$route.query.month : this.$store.state.jira.defaultMonth
      //this.$store.state.jira.defaultMonth
    // this.getMonthReport()
  }
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
