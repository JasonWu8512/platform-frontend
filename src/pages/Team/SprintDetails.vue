<template>
  <div>
    <div class="head-bar">
      <div style="float: right;">
        <el-popover
          placement="left-end"
          title="sprint 异常信息"
          width="800"
          trigger="click"
          >
          <div style="height: 600px; overflow-y: scroll; line-height: 24px">
            <p v-for="(item, index) of exceptions" :key="index" style="white-space: pre;">{{ item }}</p>
          </div>
          <img src="../../assets/img/sprintWarningIcon.svg" alt slot="reference" style="cursor:pointer;padding-right: 15px; display: inline;vertical-align: middle;" v-show="exceptions.length > 0">
        </el-popover>
        <el-cascader v-model="spValues" :options="projectSprints" :props="optionProps" placeholder="请选择项目->迭代"
                     size="mini" style="width: 400px;"></el-cascader>
      </div>
    </div>
    <div class="container" ref="resume" id="app">
      <el-main>
        <sprint-test-plan :sprint-id="sprintId"></sprint-test-plan>
        <sprint-test-status :sprint-id="sprintId" style="margin-top: 15px"></sprint-test-status>
        <sub-task-progress :sprint-id="sprintId" style="margin-top: 15px"></sub-task-progress>
      </el-main>

    </div>


  </div>
</template>

<script>
import jiraApi from "@/api/jira"
import {sprintExceptions} from "@/constant/Jira"
import {PathName} from "@/constant/routeData"
import SprintTestPlan from "@/pages/Team/components/SprintTestPlan"
import SprintTestStatus from "@/pages/Team/components/SprintTestStatus"
import SubTaskProgress from "@/pages/Team/components/SubTaskProgress"

export default {
name: "SprintDetails",
  components: {SprintTestPlan, SprintTestStatus, SubTaskProgress},
  data() {
    return{
      spValues: [],
      exceptions: [],
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'sprints'
      },
    }
  },
  watch: {
    sprintId() {
      this.$router.push({name: PathName.SprintDetail, query:{projId: this.spValues[0], sprintId: this.sprintId}})
      this.getSprintWarning()
    }
  },
  computed: {
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
  methods: {
  getSprintWarning() {
    this.exceptions = []
    jiraApi.getSprintExceptionsWarning({sprint_id: this.sprintId}).then(res => {
      console.log('warnings', res.data)
      let exceptions_types = Object.entries(res.data).map(([key, value]) => {
        return {type: key, value: value}
      })
      exceptions_types.forEach(item => {
        this.exceptions.push('\n')
        this.exceptions.push(sprintExceptions[item.type.toUpperCase()] + ':')
        item.value.forEach(content => {
          this.exceptions.push('     ' + content)
        })
      })
    })
  }
  }
}
</script>

<style scoped lang="scss">
.card-title {
  font-size: 16px;
  font-weight: 700;
  text-align: left;
}
.head-bar {
  background: white;
  height: 45px;
  line-height: 45px;
  padding: 0 10px;
  border: 1px solid #EBEEF5;
  box-shadow: 0 0 2px 0 rgba(31, 31, 31, 0.15), 0 1px 2px 0 rgba(31, 31, 31, 0.15);
}
.container {
  height: 100vh;
  background: #F5F5F5;
}
.el-main {
  height: calc(100vh - 130px);
  width: 100%;
}
.warning-icon {
  width: 15px;
  height: 15px;
  background: url('data:image/svg+xml;utf8,<svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1 0 0 1 -1024 -116 )"><path d="M 9.05567928730512 13.4471153846154  C 9.11210096510765 13.3862179487179  9.14031180400891 13.3108974358974  9.14031180400891 13.2211538461538  L 9.14031180400891 11.3942307692308  C 9.14031180400891 11.3044871794872  9.11210096510765 11.2291666666667  9.05567928730512 11.1682692307692  C 8.9992576095026 11.1073717948718  8.93244246473645 11.0769230769231  8.85523385300668 11.0769230769231  L 7.14476614699332 11.0769230769231  C 7.06755753526355 11.0769230769231  7.0007423904974 11.1073717948718  6.94432071269488 11.1682692307692  C 6.88789903489235 11.2291666666667  6.85968819599109 11.3044871794872  6.85968819599109 11.3942307692308  L 6.85968819599109 13.2211538461538  C 6.85968819599109 13.3108974358974  6.88789903489235 13.3862179487179  6.94432071269488 13.4471153846154  C 7.0007423904974 13.5080128205128  7.06755753526355 13.5384615384615  7.14476614699332 13.5384615384615  L 8.85523385300668 13.5384615384615  C 8.93244246473645 13.5384615384615  8.9992576095026 13.5080128205128  9.05567928730512 13.4471153846154  Z M 9.02895322939866 9.78365384615385  C 9.08537490720119 9.74198717948718  9.11655530809206 9.68910256410256  9.12249443207127 9.625  L 9.28285077951002 5.21153846153846  C 9.28285077951002 5.13461538461539  9.25315515961396 5.07371794871795  9.19376391982183 5.02884615384615  C 9.11655530809206 4.95833333333333  9.0452858203415 4.92307692307692  8.97995545657016 4.92307692307692  L 7.02004454342984 4.92307692307692  C 6.9547141796585 4.92307692307692  6.88344469190794 4.95833333333333  6.80623608017817 5.02884615384615  C 6.74684484038604 5.07371794871795  6.71714922048998 5.14102564102564  6.71714922048998 5.23076923076923  L 6.86859688195991 9.625  C 6.86859688195991 9.68910256410256  6.89829250185598 9.74198717948718  6.95768374164811 9.78365384615385  C 7.01707498144024 9.82532051282051  7.08834446919079 9.84615384615385  7.17149220489978 9.84615384615385  L 8.8195991091314 9.84615384615385  C 8.90274684484039 9.84615384615385  8.97253155159614 9.82532051282051  9.02895322939866 9.78365384615385  Z M 8.57906458797327 0.173076923076923  C 8.75723830734967 0.288461538461538  8.89680772086117 0.445512820512819  8.9977728285078 0.64423076923077  L 15.8396436525612 14.1826923076923  C 16.0475129918337 14.5865384615385  16.0415738678545 14.9903846153846  15.8218262806236 15.3942307692308  C 15.720861172977 15.5801282051282  15.5827765404603 15.7275641025641  15.4075723830735 15.8365384615385  C 15.2323682256867 15.9455128205128  15.0438010393467 16  14.8418708240535 16  L 1.15812917594655 16  C 0.956198960653304 16  0.767631774313289 15.9455128205128  0.592427616926503 15.8365384615385  C 0.417223459539718 15.7275641025641  0.279138827023014 15.5801282051282  0.178173719376392 15.3942307692308  C -0.0415738678544915 14.9903846153846  -0.0475129918337045 14.5865384615385  0.160356347438753 14.1826923076923  L 7.0022271714922 0.64423076923077  C 7.10319227913883 0.445512820512819  7.24276169265034 0.288461538461538  7.42093541202673 0.173076923076923  C 7.59910913140312 0.0576923076923084  7.79213066072754 0  8 0  C 8.20786933927246 0  8.40089086859688 0.0576923076923084  8.57906458797327 0.173076923076923  Z " fill-rule="nonzero" fill="#d9001b" stroke="none" transform="matrix(1 0 0 1 1024 116 )" /></g></svg>') no-repeat center;
  background-size: 100%;

}
</style>
