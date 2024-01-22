<template>
  <div>
  <div id="planReport">
        <el-row class="head-bar">
            <div class="title">
              <el-tooltip effect="dark" content="点击标题发送测试报告" placement="top-start">
                <span @click="getReportImg">{{baseInfo.name}}测试报告</span>
              </el-tooltip>
            </div>
        </el-row>

        <div class="container" ref="resume" id="app">
<!--          <el-main id="planReport">-->
            <base-info :base-info="baseInfo" :plan-id="planId" @fatherMethod="getReport"/>
            <ticket-list :data="ticketList" v-if="baseInfo.stage !== planStageEnum.SMOKE"/>
            <smoke-pass-rate v-if="smokePassRate.length > 0" :data="smokePassRate"/>
            <execute-result :data="executeResult"/>
            <module-execute-result :data="moduleExecuteResult"/>
<!--            <bug-level-chart v-if="baseInfo.stage !== planStageEnum.SMOKE" :data="bugLevelCharts"/>-->
            <bug-owner-chart v-if="baseInfo.stage !== planStageEnum.SMOKE" :bug-owner-data="bugOwnerCharts" :bug-level-data="bugLevelCharts"/>
            <bug-list v-if="baseInfo.stage !== planStageEnum.SMOKE" :data="bugList"/>
            <sonar-result v-if="baseInfo.stage === planStageEnum.SMOKE" :pipelineIds="baseInfo.pipelineIds"/>
            <allure-report v-if="baseInfo.stage !== planStageEnum.SMOKE" :history-id="baseInfo.historyId" :show-test-suites="false" class="allure"></allure-report>
<!--          </el-main>-->
        </div>

<!--      </template>-->
<!--    </el-drawer>-->
<!--      <div class="container" ref="resume" id="app">-->
<!--&lt;!&ndash;        <el-main>&ndash;&gt;-->
<!--          <div>-->
<!--            <base-info :base-info="baseInfo" :plan-id="planId"/>-->
<!--            <ticket-list :data="ticketList"/>-->
<!--            <execute-result :data="executeResult"/>-->
<!--            <module-execute-result :data="moduleExecuteResult"/>-->
<!--            <smoke-pass-rate v-if="smokePassRate.length > 0" :data="smokePassRate"/>-->
<!--            <bug-level-chart :data="bugLevelCharts"/>-->
<!--            <bug-owner-chart :data="bugOwnerCharts"/>-->
<!--            <bug-list :data="bugList"/>-->
<!--          </div>-->
<!--&lt;!&ndash;        </el-main>&ndash;&gt;-->
<!--      </div>-->
  </div>
    <el-dialog :visible.sync="reportDialog"
               class="dialog-title"
               title="发送报告"
    id="receiverSelect">
      <el-select v-model="receivers" multiple filterable placeholder="请选择收件人" style="width: 80%">
        <el-option
          v-for="item in userOptions"
          :key="item.value"
          :value="item.email"
          :label="item.email"></el-option>
      </el-select>
      <template slot="footer">
        <dialog-footer @cancel="cancleEdit" @confirm="sendReport"/>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {testPlanApi} from "@/api"
import DialogFooter from "@/common/components/DialogFooter"
import {planStageEnum} from "@/constant/TestPlan"
import AllureReport from "@/pages/track/plan/view/comonents/report/components/AllureReport"
import BaseInfo from "@/pages/track/plan/view/comonents/report/components/BaseInfo"
// import BugLevelChart from "@/pages/track/plan/view/comonents/report/components/BugLevelChart"
import BugList from "@/pages/track/plan/view/comonents/report/components/BugList"
import BugOwnerChart from "@/pages/track/plan/view/comonents/report/components/BugOwnerChart"
import ExecuteResult from "@/pages/track/plan/view/comonents/report/components/ExecuteResult"
import ModuleExecuteResult from "@/pages/track/plan/view/comonents/report/components/ModuleExecuteResult"
import SmokePassRate from "@/pages/track/plan/view/comonents/report/components/SmokePassRate"
import SonarResult from "@/pages/track/plan/view/comonents/report/components/SonarResult"
import TicketList from "@/pages/track/plan/view/comonents/report/components/TicketList"
import {Message} from "element-ui"
import html2canvas from "html2canvas"

export default {
  name: "TestReportView",
  components: {
    SonarResult,
    AllureReport,
    BaseInfo, ExecuteResult, ModuleExecuteResult,
    TicketList, BugList,
    BugOwnerChart, SmokePassRate, DialogFooter
  },
  data() {
    return {
      reportDialog: false,
      imgBase64: '',
      receivers: [],
      userOptions: [],
      planStageEnum: planStageEnum,
      baseInfo: {},
      executeResult: {},
      moduleExecuteResult: [],
      ticketList: [],
      bugList: [],
      bugOwnerCharts: [],
      bugLevelCharts: [],
      smokePassRate: [],
    }
  },
  computed: {
    planId() {
      return this.$route.params.planId.toString()
    },
  },
  mounted() {
    this.userOptions = this.$store.state.users.users
    this.getReport()
  },
  methods: {
    getReport() {
      testPlanApi.getTestCasePlanReport(this.planId).then(res => {
        this.baseInfo = res.data.baseInfo;
        this.moduleExecuteResult = res.data.moduleExecuteResult;
        this.executeResult = res.data.executeResult;
        // this.bugLevelCharts = Object.entries(res.data.bugLevelCharts).map(([key, value]) => {
        //   console.log('datatatata', key, value)
        //   // return {name: key, value: value}
        //   return {name: key, value: value}
        // });
        res.data.bugLevelCharts.forEach(item => {this.bugLevelCharts.push({name: item[0], value: item[1]})})
        // this.bugOwnerCharts = Object.entries(res.data.bugOwnerCharts).map(([key, value]) => {
        //   return {name: key, value: value}
        // });
        res.data.bugOwnerCharts.forEach(item => {this.bugOwnerCharts.push({name: item[0], value: item[1]})})
        console.log('buglevel', this.bugLevelCharts)
        this.ticketList = res.data.ticketList;
        this.bugList = res.data.bugList;
      });

      testPlanApi.getTestPlanSmokePassRate(this.planId).then(res => {
        this.smokePassRate = res.data
      })
    },
    getReportImg() {
      Message.info("正在生成报告截图，请稍等！")
      const targetDom = document.getElementById("planReport")
      html2canvas(
        targetDom,{
          // backgroundColor:null,
          scrollY: 0,
          useCORS: true,
          height: targetDom.clientHeight,
          allowTaint: true
      }
      ).then(canvas => {
        //截图用img元素承装，显示在页面的上
        let img = new Image();
        img.src = canvas.toDataURL('image/jpeg');// toDataURL :图片格式转成 base64
        // document.body.appendChild(img)
        this.imgBase64 = img.src
        this.reportDialog = true
      })
    },
    cancleEdit(){
      this.reportDialog = false
      this.receivers = []
    },
    sendReport(){
      if (this.imgBase64 !== '') {
        if (this.receivers !== '' && this.receivers.length > 0) {
          testPlanApi.sendReportEmail(this.planId, {img: this.imgBase64, receivers: this.receivers}).finally(this.reportDialog = false, this.receivers=[], this.imgBase64='')
        }
        else {
          Message.error("您还未选择收件人")
        }

      }else {
        Message({
          message: "未保存报告截图，请将报错信息报告给开发者",
          type: "warning",
          duration: 5000,
          showClose: true
        })
      }

    }
  }
}
</script>
<style lang="scss">
#receiverSelect .el-select__input{
  font-size: 13px !important
}
</style>

<style scoped lang="scss">

.title {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  cursor:pointer;
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

.el-card {
  width: 75%;
  margin: 5px auto;
}
.allure{
  width: 75%;
  margin: 5px auto;
}
.head-right {
  text-align: right;
}

</style>
