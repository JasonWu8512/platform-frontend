<template>
  <div>
    <el-card>
      <div slot="header" class="title_big">
        <span>项目资源报告</span>
        <i class="el-icon-refresh" style="font-size: 16px; color: #909399; cursor: pointer; float: right" @click="synReport()">刷新</i>
      </div>
      <el-card shadow="never" v-loading="loading">


      <div slot="header" class="title">
        <span>迭代时间：{{sprintTime}}</span>
        <el-cascader v-model="spValues" :options="projectSprints" :props="optionProps" placeholder="请选择项目->迭代"
                     size="mini" style="width: 400px;float: right; padding: 3px 0; border: 0"></el-cascader>
        <span class="title-right">技改需求数：{{techStoryCount}}</span>
        <span class="title-right"> 业务需求数：{{businessStoryCount}}</span>
        <el-input type="textarea" v-model="textarea" :rows="5"
                  style="margin-top: 10px; font-size: 13px;"
                  :disabled="true"></el-input>
      </div>
      <el-table :data="tableData"
                row-key="id"
                size="medium">
        <template v-for="col in tableColumns">
          <el-table-column :prop="col.prop" :label="col.label" :key="col.prop" :width="col.width">
            <template slot-scope="scope">
              <el-tooltip :disabled="col.prop !== 'mark'" class="item" effect="dark" :content="scope.row[col.prop]" placement="top">
                <el-input v-if="col.editable" style="width: 80%"
                                 @change="changeSprintEstimate(col.prop, scope.row)"
                                  @keyup.enter.native="$event.target.blur"
                                 v-model="scope.row[col.prop]"></el-input>
                <span v-else-if="col.isClick"
                @click="goto(scope.row)">{{scope.row[col.prop]}}</span>
                <span v-else-if="col.prop === 'saturation'">{{scope.row[col.prop]}}%</span>
                <span v-else>{{scope.row[col.prop]}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>

      </el-table>
      </el-card>
      <el-card style="margin-top: 15px" shadow="never" v-loading="loading">
        <el-row>
          <el-col :span="12">
            <span class="title_top">研发测试投入及BUG数</span>
            <div v-if="resourceData.rows.length === 0" style="margin: 50px;">
              <span style="font-size: 16px; color: #909390;">暂无数据</span>
            </div>
            <ve-histogram v-else :data="resourceData" :extend="resourceExtend" style="margin-top: 20px"></ve-histogram>
          </el-col>
          <el-col :span="12">
            <span class="title_top">占用研发+测试资源Top10需求(人天)</span>
            <div v-if="rankData.rows.length === 0" style="margin-top: 50px;">
              <span style="font-size: 16px; color: #909390;">暂无数据</span>
            </div>
            <ve-bar v-else :data="rankData" :extend="extend" tyle="margin-top: 20px"></ve-bar>
          </el-col>
        </el-row>
      </el-card>
      <el-card style="margin-top: 15px" shadow="never" v-loading="loading">
        <el-row>
          <el-col :span="12">
            <span class="title_top">Bug质量分</span>
            <div v-if="bugPointData.rows.length === 0" style="margin: 50px;">
              <span style="font-size: 16px; color: #909390;">暂无数据</span>
            </div>
            <ve-line :data="bugPointData" :extend="pointExtend" tyle="margin-top: 20px"></ve-line>
          </el-col>
          <el-col :span="12">
            <el-select v-model="fix_type" style="width: 200px; padding: 3px 0; border: 0; z-index: 99; float: right">
              <el-option v-for="item in fixTypes"
                         :key="item.label"
                         :label="item.label"
                         :value="item.label"></el-option>
            </el-select>
            <span class="title_top">Bug修复时长/h</span>
            <div v-if="bugFixTimeData.rows.length === 0" style="margin: 50px;">
              <span style="font-size: 16px; color: #909390;">暂无数据</span>
            </div>
            <ve-line :data="bugFixTimeData" :extend="fixExtend" tyle="margin-top: 20px"></ve-line>

          </el-col>
          <download-excel :data="json_data" :fields="json_fields" type="xls" name="Bug详情.xls">
            <i class="el-icon-download" style="font-size: 16px; color: #909399; cursor: pointer;">下载详情</i>
          </download-excel>
        </el-row>
      </el-card>
      <el-card style="margin-top: 15px" shadow="never" v-loading="loading">
        <el-row>
          <el-col :span="12">
            <span class="title_top">研发测试投入占比</span>
            <div v-if="rankData.rows.length === 0" style="margin: 50px;">
              <span style="font-size: 16px; color: #909390;">暂无数据</span>
            </div>
            <ve-pie v-else :data="developResourceData" :settings="chartSettings" :extend="pieExtend" style="margin-left: -50px; margin-top: -20px"></ve-pie>
          </el-col>
          <el-col :span="12">
            <span class="title_top">饱和度</span>
            <div v-if="saturationData.rows.length === 0" style="margin: 50px;">
              <span style="font-size: 16px; color: #909390;">暂无数据</span>
            </div>
            <ve-line :data="saturationData" :extend="satExtend" tyle="margin-top: 20px"></ve-line>
          </el-col>
        </el-row>
      </el-card>

    </el-card>

  </div>
</template>

<script>
import jiraApi from "@/api/jira"
import {cloneDeep} from "lodash"
import JsonExcel from "vue-json-excel"
import {PathName} from "@/constant/routeData";
export default {
name: "SprintEstimate",
  components: {downloadExcel: JsonExcel},
  data() {
  return {
    textarea: "",
    json_fields: {
      "关键字": "key",
      "概要": "summary",
      "Sprint": "sprintName",
      "创建日期": "created",
      "报告人": "creator",
      "平台": "platform",
      "Bug Owner": "bugOwner",
      "Server环境": "env",
      "Bug Level": "subBugLevel",
      "修复时长": "fixHour",
      "关闭时长": "closeHour"
    },
    json_data: [],
    json_meta: [
      [
        {
          key: "charset",
          value: "utf-8"
        }
      ]
    ],
    extend: {
      legend: {
        // show: false
        bottom: "20px"
      },
    },
    pointExtend: {
      legend: {
        show: false
      },
      series: {
        smooth: false
      }
    },
    satExtend: {
      legend: {
        show: false
      },
      series: {
        smooth: false
      },
      yAxis: {
        axisLabel:{
          show: true,
          interval: 'auto',
          formatter: '{value}%'
        },
      },
      tooltip:{
        formatter: '{c}%'
      }
    },
    fixExtend: {
      legend: {
        bottom: "20px"
      },
      series: {
        smooth: false
      }
    },
    resourceExtend: {
      label: {
        show: true,
        position: "top",
        color: "inherit",
        fontStyle: "oblique",
        fontWeight: "bold",
      },
      legend: {
        bottom: "20px"
      }
    },
    pieExtend: {
      legend: {
        show: false
      }
    },
    chartSettings: {
      label: {
        position: "inner",
        formatter: '{b}:{d}%'
      }
    },
    subTask: '',
    version: '',
    url: '',
    sprintTime:'',
    sprId: '',
    // peopleResource: {},
    // bugResource: {},
    businessStoryCount: 0,
    techStoryCount: 0,
    spValues: [],
    tableData: [],
    cloneTable: [],
    saturationData: {
      columns: [],
      rows: []
    },
    bugFixTimeData: {
      columns: [],
      rows: []
    },
    fixTypes: [{
      label: "Open -> Closed"
    },{
      label: "Fixed -> Closed"
    },{
      label: "Open -> Fixed"
    }],
    fix_type: '',
    type_fix: '',
    optionProps: {
      value: 'id',
      label: 'name',
      children: 'sprints'
    },
    resourceData: {
      columns: [],
      rows: []
    },
    rankData: {
      columns: [],
      rows: []
    },
    developResourceData: {
      columns: [],
      rows: []
    },
    bugPointData:{
      columns: [],
      rows: []
    },
    tableColumns: [
      {
        label: '组别',
        prop: 'terminal',
        editable: false,
        isClick: false,
      },
      {
        label: '团队人数',
        prop: 'teamPeople',
        editable: true,
        number: true,
        isClick: false,
      },
      {
        label: 'Jira人数',
        prop: 'peopleCount',
        editable: false,
        number: true,
        isClick: true,
      },
      {
        label: '实际人数',
        prop: 'realPeople',
        editable: true,
        number: true,
        isClick: false,
      },
      {
        label: '迭代工作日',
        prop: 'sprintDays',
        editable: false,
        isClick: false,
      },
      {
        label: '业务需求',
        prop: 'businessStoryDays',
        editable: false,
        isClick: false,
      },
      {
        label: '技改需求',
        prop: 'techStoryDays',
        editable: false,
        isClick: false,
      },
      {
        label: '需求变更/增加',
        prop: 'changeStoryDays',
        editable: false,
        isClick: false,
      },
      {
        label: '跟测/回归',
        prop: 'regressionStoryDays',
        editable: false,
        isClick: false,
      },
      {
        label: '资源损耗',
        prop: 'resourceDepletionDays',
        editable: false,
        isClick: false,
      },
      {
        label: '饱和度',
        prop: 'saturation',
        editable: false,
        isClick: false,
      },
      {
        label: '备注',
        prop: 'mark',
        editable: true,
        isClick: false,
      }

    ]
  }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    projectSprints() {
      return this.$store.state.jira.projects;
    },
    sprintId() {
      if (this.spValues.length === 0) {
        // eslint-disable-next-line vue/no-async-in-computed-properties
        jiraApi.getSprintSpecific({}).then(res => {
          this.spValues = [res.data.projId, res.data.id]
          if (this.$route.query.sprintId) {
            this.spValues = [this.$route.query.projId, this.$route.query.sprintId]
          }
          // this.getVersionsReport(this.spValues[1])
        })
      }
      return this.spValues[1]
    }
  },
  watch: {
    sprintId() {
      this.$router.push({name: PathName.EfficiencyData, query:{projId: this.spValues[0], sprintId: this.sprintId}})
      this.getSprintEstimate();
      this.getRankData();
      this.getDevQaAndBug();
      this.getBugPoint();
      this.getBugFixTime();
      this.downloadBugDetaild();
    },
    spValues() {
      this.$emit("getChildValue",{projId:this.spValues[0]})
    },
    fix_type() {
      this.getBugFixTime();
    }
  },
  mounted() {
  this.fix_type = this.fixTypes[0].label
  },
  methods: {
  downloadBugDetaild(){
    this.json_data = []
    jiraApi.downloadBugDetails({sprintId: this.sprintId}).then(res => {
      res.data.forEach(item => {
        this.json_data.push({
          key: item.key,
          summary: item.summary,
          sprintName: item.sprintName,
          created: item.created,
          creator: item.creator,
          platform: item.platform,
          bugOwner: item.bugOwner,
          env: item.env,
          subBugLevel: item.subBugLevel,
          fixHour: item.fixHour,
          closeHour: item.closeHour
        })
      })
    })
  },
  getBugFixTime(){
    if(this.fix_type === "Open -> Fixed") {
      this.type_fix = "OpenToFixed"
    }else if (this.fix_type === "Fixed -> Closed") {
      this.type_fix = "FixedToClosed"
    }else{
      this.type_fix = "OpenToClosed"
    }
    this.bugFixTimeData.columns = []
    this.bugFixTimeData.rows = []
    jiraApi.getBugFixTime({sprintId: this.sprintId, type: this.type_fix}).then(res => {
      res.data.forEach(item => {
        this.bugFixTimeData.rows.push(item)
        this.bugFixTimeData.columns = Object.keys(this.bugFixTimeData.rows[0])
      })
    })
  },
  getBugPoint(){
    this.bugPointData.columns = []
    this.bugPointData.rows = []
    jiraApi.getBugPoint({sprintId: this.sprintId}).then(res => {
      res.data.forEach(item => {
        this.bugPointData.rows.push({
          'platform': item.platform,
          'BugPoint': item.pointRate
        })
        this.bugPointData.columns = Object.keys(this.bugPointData.rows[0])
      })
    })
  },
  getDevQaAndBug(){
    this.resourceData.columns = []
    this.resourceData.rows = []
    jiraApi.getDevQaAndBug({sprintId: this.sprintId}).then(res => {
      res.data.forEach(item => {
        this.resourceData.rows.push({
          'platform': item.platform,
          '人天': item.peopleCount,
          'BUG数': item.bugs
        })
        this.resourceData.columns = Object.keys(this.resourceData.rows[0])
      })
    })
  },
  getRankData(){
    this.rankData.columns = []
    this.rankData.rows = []
    jiraApi.getStoryResourceRank({sprintId: this.sprintId}).then(res => {
      res.data.forEach(item => {
        this.rankData.rows.push({
          "需求": item.name,
          "人天": item.estimate
        })
        this.rankData.columns = Object.keys(this.rankData.rows[0])
      })
    })
  },
  goto(row){
    jiraApi.getSubTask({sprintId: this.sprintId, terminal: row['terminal']}).then(res => {
      this.subTask = res.data.key
      this.version = res.data.version
      this.url = "https://jira.jiliguala.com/browse/" + this.subTask +
        "?jql=issuetype = Sub-task AND Sprint = " + row['sprintId'] + " AND assignee in " + row['people'] +
        "AND fixVersion in " + this.version
      console.log(this.url)
      window.open(this.url)
    })
  },
  getSprintEstimate(){
    this.developResourceData.columns = []
    this.developResourceData.rows = []
    this.saturationData.columns = []
    this.saturationData.rows = []
    // this.peopleResource = {}
    // this.bugResource = {}
    jiraApi.getSprintEstimateReport({sprintId: this.sprintId}).then(res => {
      this.businessStoryCount = 0
      this.techStoryCount = 0
      this.sprintTime = ''
      this.textarea = ''
      res.data.forEach(item =>{
        if (item.terminal !== "total"){
          this.developResourceData.rows.push({
            'terminal': item.terminal,
            '人天': item.businessStoryDays + item.techStoryDays + item.changeStoryDays + item.regressionStoryDays
              + item.resourceDepletionDays
          })
          this.developResourceData.columns = Object.keys(this.developResourceData.rows[0])
        }
      })
      this.tableData = res.data.map(item => {
        if (item.terminal === "total"){
          this.sprId = item.sprintId
          this.textarea = item.mark
        }
        if (item.terminal !== "total"){
          this.sprintTime = item.sprintTime
          this.businessStoryCount = item.businessStoryCount
        }
        this.techStoryCount = item.techStoryCount
        // 饱和度实时计算，不再存库。实际人数为0的与没有迭代工作日的饱和度为0
        let s = 0
        if (item.realPeople !== '0.0' && item.sprintDays !== null && item.sprintDays !== 0){
          s = (item.regressionStoryDays + item.techStoryDays + item.businessStoryDays + item.changeStoryDays + item.resourceDepletionDays) / (item.sprintDays * item.realPeople) * 100
          s = parseFloat(s).toFixed(2)
        }
        if (s !== 0){
          this.saturationData.rows.push({
            'terminal': item.terminal,
            'saturation': s
          })
          this.saturationData.columns = Object.keys(this.saturationData.rows[0])
        }
        return {
          id: item.id,
          sprintId: item.sprintId,
          terminal: item.terminal,
          peopleCount: item.peopleCount,
          teamPeople: item.teamPeople,
          realPeople: parseFloat(item.realPeople).toFixed(1),
          sprintDays: item.sprintDays,
          techStoryDays: item.techStoryDays,
          changeStoryDays: item.changeStoryDays,
          businessStoryDays: item.businessStoryDays,
          regressionStoryDays: item.regressionStoryDays,
          resourceDepletionDays: item.resourceDepletionDays,
          saturation: s,
          mark: item.mark,
          editable: item.editable,
          people: item.people
        }
      })
      this.tableData.pop()
      this.cloneTable = cloneDeep(this.tableData)
    })
  },
  changeSprintEstimate(prop, row) {
    // if (['teamPeople', 'realPeople'].indexOf(prop) > -1) {
    //   row.edited = true
    // }
    if (prop === 'realPeople'){
      row.realPeople = parseFloat(row.realPeople).toFixed(1)
      // let sat = (row.regressionStoryDays + row.techStoryDays + row.businessStoryDays + row.changeStoryDays + row.resourceDepletionDays) / (row.sprintDays * row.realPeople) * 100
      // row.saturation = parseFloat(sat).toFixed(2)
    }
    if (row.sprintDays === null){
      row.sprintDays = 0
    }
    row.teamPeople = parseFloat(row.teamPeople).toFixed(1)
    jiraApi.editSprintEstimateReport(row.id, row).then(
      // eslint-disable-next-line no-unused-vars
      res => {
        this.getSprintEstimate()
      }
    )
  },
    // changeMark(sprId, textarea) {
    //   let ctx = {"mark": textarea, "edited": true}
    //   jiraApi.editSprintTotalEstimate(sprId, ctx).then()
    // },
    synReport() {
      jiraApi.synReport({sprintId: this.sprintId}).then(
        // eslint-disable-next-line no-unused-vars
        res => {
          this.getSprintEstimate()
          this.getBugPoint()
          this.getDevQaAndBug()
      }
      )
    }
  },



}
</script>

<style scoped lang="scss">
.title_big {
  font-size: 20px;
  font-weight: 700;
  margin-left: 5px;
  line-height: 35px;
  text-align: left;
}
.title {
  font-size: 16px;
  font-weight: 700;
  margin-left: 5px;
  line-height: 35px;
  text-align: left;
  color: #909399;
}
.title-right {
  width: 150px;
  float: right;
  margin-right: 15px;
  color: #909399;
  font-size: 14px;
  font-weight: 600
}
.title_top{
  margin-top: 20px;
  color: #909399;
  font-size: 16px;
  font-weight: 600;
  float: left;
}

</style>
