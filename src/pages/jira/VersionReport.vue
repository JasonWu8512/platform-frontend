<template>
  <el-card shadow="never">
    <div style="position: relative">
      <el-tabs v-model="activePannel" :before-leave="getVersionsReport">
        <el-tab-pane label="人员工作量报告" name="versionEstimateReport">

          <div
            v-for="(version, index) in versionsEstimate"
            :key="index"
            :index="index"
            :version="version"
            style="margin-top: 20px;"
          >
            <el-card :body-style="{ padding: '0px' }">
              <div
                style="font-size: 14px; font-weight: 600; height: 40px; color: #fff;background-color:#2c2a48;  text-align: left;line-height: 40px; padding-left: 10px">
                <span>{{ version.version }}</span>
              </div>
              <el-table
                :data="version['details']"
                :row-class-name="tableRowClassName"
                :cell-style="cellStyle"
                :tree-props="{children: 'tasks'}"
                row-key="id"
                size="medium"
              >
                <template v-for="col in columnsParent">
                  <el-table-column :key="col.props" :label="col.label" :prop="col.props" :sortable="col.sortable">
                    <template slot-scope="scope" style=" vertical-align: text-bottom">
                      <img v-if="col.props === 'type'" :src="typeIcon(scope.row.type)"
                           alt style="width: 12px; height: 12px;">
                      <span>{{ scope.row[col.props] }}</span>
                    </template>
                  </el-table-column>
                </template>
              </el-table>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="人员质量报告" name="versioQualityReport">
          <version-quality-report :active-name="activePannel" :versions.sync="versionsQuality"></version-quality-report>
        </el-tab-pane>

      </el-tabs>
      <div class="cur_project">
        <el-cascader v-model="spValues" :options="projectSprints" :props="optionProps" placeholder="请选择项目->迭代"
                     size="mini" style="width: 300px"></el-cascader>
      </div>
    </div>

  </el-card>


</template>

<script>
import jiraApi from "@/api/jira"
import noData from "@/common/components/noData.vue"
import versionQualityReport from "@/pages/jira/versionQualityReport.vue"

export default {
  name: "VersionReport",
  components: {
    versionQualityReport,
    // eslint-disable-next-line vue/no-unused-components
    noData,
  },
  data() {
    return {
      activePannel: 'versionEstimateReport',
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'sprints'
      },
      spValues: [],
      columnsParent: [{
        label: '指派人',
        props: 'bugOwner',
        sortable: true,
      },
        {
          label: '类型',
          props: 'type',
          sortable: false,
        },
        {
          label: '任务id',
          props: 'key',
          sortable: false,
        },
        {
          label: '所属story',
          props: 'parentKey',
          sortable: true
        },
        {
          label: '状态',
          props: 'status',
          sortable: true,
        }, {
          label: '工作量(天)',
          props: 'day',
          sortable: true
        }],
      columnsChild: [],
      versionsEstimate: [],
      versionsQuality: [],
    }
  },
  computed: {
    projectSprints() {
      return this.$store.state.jira.projects;
    },
    sprintId() {
      if (this.spValues.length === 0) {
        // eslint-disable-next-line vue/no-async-in-computed-properties
        jiraApi.getLatestSprint({}).then(res => {
          this.spValues = [res.data.projId, res.data.id]
          // this.getVersionsReport(this.spValues[1])
        })
      }
      return this.spValues[1]
    }
  },
  watch: {
    sprintId() {
      this.getVersionsReport()
    }
  },
  methods: {
    cellStyle(){
      return 'font: 13px Arial;font-weight: 500; color: #606266;'
    },
    getVersionsReport() {
      // console.log('spValues', this.spValues)
      jiraApi.getVersionDetailsBySprint({sprintId: this.sprintId, type: 'noBug'}).then(res => {
        this.versionsEstimate = res.data.datas.map(version => {
          var details = version.details.map(detail => {
            return {
              bugOwner: detail.bugOwner,
              id: detail.bugOwner,
              type: '合计',
              status: '',
              day: detail.day,
              tasks: detail.tasks,
            }
          })
          return {
            version: version.version,
            details: details
          }
        })
      })
      jiraApi.getVersionDetailsBySprint({sprintId: this.sprintId, type: 'Bug'}).then(res => {
        this.versionsQuality = res.data.datas.map(version => {
          var details = version.details.map(detail => {
            return {
              bugOwner: detail.bugOwner,
              bug数: detail.tasks.length,
              线下bug分: detail.offlinePoint,
              线上bug分: detail.onlinePoint,
              人天bug率: detail.day ? (detail.tasks.length / detail.day).toFixed(2) : 0,
            }
          })
          return {
            version: version.version,
            chartData: {
              rows: details,
              columns: ['bugOwner', 'bug数', '线下bug分', '线上bug分', '人天bug率'],
            },
          }
        })
      })
    },
    tableRowClassName(row) {
      // console.log('row', row)
      if (row.row.type === 'Bug') {
        return 'bug-row';
      } else if (row.row.type === 'Sub-task') {
        return 'task-row';
      } else if (row.row.type === 'Task') {
        return 'task-row'
      } else if (row.row.type === 'Story') {
        return 'story-row'
      }
      return '';
    },
    typeIcon(type) {
      if (type === 'Bug') {
        return require('../../assets/img/jira_bug.svg');
      } else if (type === 'Sub-task') {
        return require('../../assets/img/jira_subtask.svg');
      } else if (type === 'Task') {
        return require('../../assets/img/jira_task.svg')
      } else if (type === 'Story') {
        return require('../../assets/img/jira_story.svg')
      }
      return '';

    }

  },

  mounted() {
    // this.getVersionsReport();
  }
}
</script>
<style lang="scss" scoped>


</style>
<style lang="scss">
.el-cascader-panel {
  font-size: 12px !important;
}
.el-cascader__suggestion-list{
  font-size: 12px !important;
}

.cur_project {
  position: absolute;
  right: 10px;
  top: 2px
}

div.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: #fff;
}

.el-table .bug-row {
  background: #fde2e2;
}

.el-table .task-row {
  background: #b3d8ff;
}

.el-table .story-row {
  background: #e0f0d5;
}

</style>
