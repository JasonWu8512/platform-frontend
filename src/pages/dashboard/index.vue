<template>
  <div>
    <el-header class="dashboard-header" height="40px">
      <el-row>
        <el-col class="dashboard-header-col">
          <el-dropdown placement="" @command="change_projid">
          <span class="el-dropdown-link">
        {{ activeDrop }}
            <i class="el-icon-arrow-down el-icon--right"/>
            <el-dropdown-menu>
              <el-dropdown-item command="-1">全部项目</el-dropdown-item>
              <el-dropdown-item
                  v-for="(item,index) in projects"
                  :key="index"
                  :command="index"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
      </span>
          </el-dropdown>
          <el-date-picker
              v-model="value"
              :default-time="['00:00:00', '23:59:59']"
              align="right"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              style="margin-left: 20px"
              type="daterange"
              unlink-panels
              value-format="yyyy-MM-dd"
              @change="getBugSummary">
          </el-date-picker>
        </el-col>
      </el-row>
    </el-header>
    <div style="margin: 20px 0">
      <el-card shadow="never" style="padding: 16px; border: none">
        <el-row>
          <el-col v-for="(data, index) in bug_summary" :key="index" :span="8">
            <div class="col-title-style">
              <span>{{ data.name }}</span>
            </div>
            <div class="col-data-style">
              <span>{{ data.data }}</span>
            </div>
            <div v-if="index > 0" class="yBar"></div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>


</template>

<script>
import jiraApi from '@/api/jira'

export default {
  name: "dashboard",
  data() {
    return {
      value: [],
      projId: '',
      activeDrop: '全部项目',
      bug_summary: []
    }
  },
  computed: {
    projects() {
      return this.$store.state.jira.projects
    },
    timeDefault() {
      let time1 = new Date()
      time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
      let Y1 = time1.getFullYear()
      let M1 = ((time1.getMonth() + 1) > 9 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
      let D1 = (time1.getDate() > 9 ? time1.getDate() : '0' + time1.getDate())
      let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
      let time2 = new Date()
      // 往前30天
      time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * 30))
      let Y2 = time2.getFullYear()
      let M2 = ((time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
      let D2 = (time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate())
      let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
      // console.log(timer1, timer2)
      return [timer2, timer1]
    }

  },
  methods: {
    change_projid(command) {
      if (command < 0) {
        this.projId = '';
        this.activeDrop = '全部项目';
      } else {
        this.projId = this.projects[command].id;
        this.activeDrop = this.projects[command].name;
      }
      this.getBugSummary()
    },
    getBugSummary() {
      // console.log('daterange', this.value)
      // console.log('projs', this.projects)
      jiraApi.getBugSummary({start_date: this.value[0], end_date: this.value[1], projId: this.projId}).then(res => {
        this.bug_summary = res.data
      })
    }
  },
  mounted() {
    // console.log('projs', this.$store.state.jira.projects)
    this.value = this.timeDefault
    this.getBugSummary()
  }
}
</script>


<style lang="scss" scoped>
.dashboard-header {
  height: 40px;
  margin: 0 auto;

  background-color: #fff;
  text-align: left;
  padding: 5px;
}

.dashboard-header-col {
  margin-left: 20px;
}

.el-dropdown-menu {
  overflow: scroll;
  max-height: 390px;
  overflow-x: hidden;
}

.el-dropdown-link {
  line-height: 30px;
  color: #409EFF;
  cursor: pointer;
  font-size: 12px;
  font-family: "Microsoft Yahei";
}

.col-title-style {
  font-size: 18px;
  font-weight: 400;
  margin: 0px 0px 18px;
}

.col-data-style {
  font-size: 24px;
  font-weight: bolder;
}

.yBar {
  position: absolute;
  bottom: 0;
  width: 2px;
  height: 100%;
  background-color: #d9d9d9;
  border-radius: 1px;
  opacity: .8;
}

</style>
