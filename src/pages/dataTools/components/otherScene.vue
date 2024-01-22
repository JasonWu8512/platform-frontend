<template>
  <div>
    <el-row>
      <el-col :span="8" style="padding: 10px">
        <el-card style="height: 260px">
          <span style="color: #909399; font-size: 18px;">一键退款</span>
          <div>
            <el-form ref="refundForm" :model="refundForm" style="width: 100%;" label-width="80px">
              <el-form-item label="手机号:" prop="mobile">
                <el-input v-model="refundForm.mobile" style="width: 85%;" placeholder="请输入用户手机号"></el-input>
              </el-form-item>
              <el-form-item label="订单号:" prop="orderNo">
                <el-input v-model="refundForm.orderNo" style="width: 85%;" placeholder="请输入订单Id"></el-input>
              </el-form-item>
            </el-form>
            <div style="margin-top: 30px">
              <el-button type="primary" @click="refundSubmit">退款</el-button>
              <el-button @click="resetForm('refundForm')">重置</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" style="padding: 10px">
        <el-card style="height: 260px">
          <span style="color: #909399; font-size: 18px;">开关审核模式</span>
          <div>
            <el-form ref="iosForm" :model="iosForm"  style="width: 100%;" label-width="80px">
              <el-form-item label="IOS版本:" prop="version">
                <el-input v-model="iosForm.version" style="width: 85%;" placeholder="请输入IOS版本号"></el-input>
              </el-form-item>
            </el-form>
            <div style="margin-top: 40px">
              <el-button type="primary" @click="updateGlobal">操作</el-button>
              <el-button @click="resetForm('iosForm')">重置</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" style="padding: 10px">
        <el-card style="height: 260px">
          <span style="color: #909399; font-size: 18px;">重置用户打卡数据</span>
          <div>
            <el-form ref="clockForm" :rules="clockRules" :model="clockForm" style="width: 100%;" label-width="90px">
              <el-form-item label="guaid/uid:" prop="id">
                <el-input v-model="clockForm.id" style="width: 85%;" placeholder="请输入guaid或uid"></el-input>
              </el-form-item>
              <el-form-item label="打卡天数:" prop="days">
                <el-input-number v-model="clockForm.days" :min="0" style="width: 85%" placeholder="请输入打卡天数"></el-input-number>
              </el-form-item>
              <el-form-item label="活动Id:" prop="task">
                <el-select v-model="clockForm.task">
                  <el-option
                    v-for="item in options"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div>
              <el-button type="primary" @click="punchCard('clockForm')">操作</el-button>
              <el-button @click="resetForm('clockForm')">重置</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import {dataToolApi} from "@/api";

export default {
  name: "otherScene",
  data() {
    return {
      refundForm: {
        mobile: '',
        orderNo: '',
      },
      iosForm: {
        version: '',
        status: '',
      },
      clockForm: {
        id: '',
        task: '',
        days: 0,
      },
      options: [{
        label: 'i1',
      },
        {
          label: 'i2',
        },
        {
          label: 'i3',
        },
        {
          label: 'i4',
        },
        {
          label: 'i5',
        },
        {
          label: 'i6',
        }],
      clockRules: {
        id: [{required: true, message: "请输入guaid或uid", trigger: "blur"}],
        task: [{required: true, message: "请输入活动Id", trigger: "blur"}],
        days: [{required: true, message: "请输入打卡天数", trigger: "blur"}],
      },
      result: '',
    }
  },
  methods: {
    punchCard(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          // eslint-disable-next-line no-undef
          let clock_params = _.cloneDeep(this.clockForm);
          dataToolApi.resetUserCheckinDays(clock_params).then()
        }
        else {
          return false
        }
      });
    },
    updateGlobal() {
      this.$alert('确认开关审核模式', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action) => {
          if (action === 'confirm') {
            // eslint-disable-next-line no-undef
            let global_params = _.cloneDeep(this.iosForm);
            dataToolApi.updateGlobal(global_params).then()
          }
        }
      })
    },
    refundSubmit() {
      this.$alert('确认退款', '', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        callback: (action) => {
          if (action === 'confirm') {
            // eslint-disable-next-line no-undef
            let refund_params = _.cloneDeep(this.refundForm);
            dataToolApi.orderRefund(refund_params).then()
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style scoped>

</style>
