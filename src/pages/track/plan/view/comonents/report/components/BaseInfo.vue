<template>

  <common-component title="基础信息">

    <template class="text">

      <el-row justify="space-between" type="flex">
        <el-col :span="12" style="text-align: left">
          <span>所属项目：</span>
          <span v-for="proj in baseInfo.projNames" :key="proj" class="item-value">{{ proj }}</span>
        </el-col>
        <el-col :span="12" style="text-align: left">
          <span>负责人：</span>
          <span class="item-value">{{ baseInfo.owner }}</span>
        </el-col>
      </el-row>

      <el-row class="select-time" justify="space-between" type="flex">
        <el-col :span="12" style="text-align: left">
          <span>开始时间：</span>
          <el-date-picker
            v-model="baseInfo.start"
            format="yyyy 年 MM 月 dd 日"
            placeholder="请选择开始时间"
            type="date"
            value-format="yyyy-MM-dd"
            @change="startTimeChange"
          />
        </el-col>
        <el-col :span="12" style="text-align: left">
          <span>结束时间：</span>
          <el-date-picker
            v-model="baseInfo.end"
            format="yyyy 年 MM 月 dd 日"
            placeholder="请选择结束时间"
            type="date"
            value-format="yyyy-MM-dd"
            @change="endTimeChange"
          />
        </el-col>
      </el-row>

      <el-row justify="space-between" type="flex" class="baseInfo">
        <el-col :span="12" style="text-align: left">
          <span>执行人：</span>
          <span v-for="item in baseInfo.executors" :key="item">{{ item }}</span>
        </el-col>
        <el-col :span="12" style="text-align: left" v-if="baseInfo.stage !== planStageEnum.SMOKE">
          <span>自动化构建号：</span>
          <el-input v-model="cloneBaseInfo.historyId" style="width: 180px" @change="editHistoryId">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
          </el-input>
        </el-col>
      </el-row>
      <el-row justify="space-between" type="flex" v-if="baseInfo.stage !== planStageEnum.SMOKE">
        <el-col :span="12" style="text-align: left">
          <span>缺陷筛选器：</span>
          <el-button type="text" @click="dialogVisible = true">点击此处查看/更新jql</el-button>
        </el-col>
      </el-row>
      <el-row justify="space-between" type="flex">
        <el-col :span="12" style="text-align: left">
          <span style="color: red">备注：</span>
          <span> {{cloneBaseInfo.description}} </span>
          <el-button @click="ifEdit = true" class="el-icon-edit" type="text" v-if="!ifEdit"></el-button>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialogVisible"
        class="dialog-title"
        title="缺陷筛选jql">
        <el-input v-model="cloneBaseInfo.jql" placeholder="请输入jql"></el-input>
        <template slot="footer">
          <dialog-footer @cancel="cancleEdit" @confirm="submit"/>
        </template>
      </el-dialog>
      <el-dialog
        :visible.sync="ifEdit"
        class="dialog-title"
        title="备注">
        <el-input v-model="cloneBaseInfo.description" placeholder="请输入备注说明"></el-input>
        <template slot="footer">
          <dialog-footer @cancel="cancleEdit" @confirm="editPlanDescription"/>
        </template>
      </el-dialog>

    </template>

  </common-component>

</template>

<script>
import {testPlanApi} from "@/api"
import DialogFooter from "@/common/components/DialogFooter.vue"
import {planStageEnum} from "@/constant/TestPlan"
import {cloneDeep} from "lodash"
import CommonComponent from "./CommonComponent"

export default {
  name: "BaseInfoComponent",
  components: {CommonComponent, DialogFooter},
  props: {
    baseInfo: {
      type: Object,
    },
    planId: {
      type: String
    }
  },
  data() {
    return {
      planStageEnum: planStageEnum,
      dialogVisible: false,
      ifEdit: false,
      cloneBaseInfo: cloneDeep(this.baseInfo),
    }
  },
  watch: {
    baseInfo() {
      this.cloneBaseInfo =  cloneDeep(this.baseInfo)
    }
  },
  methods: {
    startTimeChange() {
      if (!!this.baseInfo.end && this.baseInfo.end - this.baseInfo.start < 0) {
        this.baseInfo.start = undefined;
        this.$message.warning('开始日期不能大于结束日期');
      } else {
        testPlanApi.updateTestCasePlan(this.planId, {actualStart: this.baseInfo.start})
      }
    },
    endTimeChange() {
      if (!!this.baseInfo.start && this.baseInfo.end - this.baseInfo.start < 0) {
        this.baseInfo.end = undefined;
        this.$message.warning('开始日期不能大于结束日期');
      } else {
        testPlanApi.updateTestCasePlan(this.planId, {actualEnd: this.baseInfo.end})
      }
    },
    submit() {
      testPlanApi.updateTestCasePlan(this.planId, {issueJql: this.cloneBaseInfo.jql}).then(
        // eslint-disable-next-line no-unused-vars
        res => {
          this.dialogVisible = false;
          this.$emit("fatherMethod")
        }
      )
    },
    editHistoryId() {
      testPlanApi.updateTestCasePlan(this.planId, {historyId: this.cloneBaseInfo.historyId}).then(
        () => {
          this.$emit("fatherMethod")
        }
      )
    },
    editPlanDescription() {
      testPlanApi.updateTestCasePlan(this.planId, {description: this.cloneBaseInfo.description}).then(
        // eslint-disable-next-line no-unused-vars
        res => {
          this.ifEdit = false
          this.$emit("fatherMethod")
        }
      )
    },
    cancleEdit(){
      this.ifEdit = false
      this.dialogVisible = false
      this.cloneBaseInfo = cloneDeep(this.baseInfo)
    }
  }
}
</script>
<style lang="scss">
.baseInfo .el-input__inner {
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  border-radius: 0;
  /*outline: medium;*/
}
</style>

<style lang="scss" scoped>
@import "src/assets/css/font";
@import "src/assets/css/utils";

.dialog-title {
  @extend %dialog-title
}

.text {
  @extend %font-14
}

span {
  margin-right: 5px;
  display: inline-block;
}

.el-col span:first-child {
  font-weight: bold;
  width: 100px;
}

.el-row {
  height: 60px;
}

.select-time span {
  display: inline-block;
}


//.el-date-editor {
//  width: 220px;
//}

</style>
