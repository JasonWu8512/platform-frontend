<template>
  <el-card>
    <div>
      <el-form ref="orderForm" status-icon :rules="orderRules" :model="orderForm" label-width="100px" style="width: 100%; margin: 20px auto">
        <el-form-item label="科目类型:" prop="subject">
          <el-radio-group v-model="orderForm.subject">
            <el-radio
            v-for="item in SubjectTypes"
            :key="item.label"
            :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="渠道:" prop="source">
          <el-input v-model="orderForm.source" style="width: auto" placeholder="请输入渠道来源"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input v-model="orderForm.mobile" style="width: auto" placeholder="请输入用户手机号"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" @click="onSubmit('orderForm')">确认</el-button>
          <el-button @click="resetForm('orderForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="createOrder" center title="提示" width="30%">
        <span>是否要创建相关订单，请确认fat环境mock已打开</span>
        <span slot="footer">
          <el-button @click="createOrder = false">取 消</el-button>
          <el-button type="primary" @click="orderSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
        <div style="margin-top: 50px; margin-left: 28px">
          <span style="font-size: 14px; float: left; color: #606266">响应数据：</span>
          <el-input type="textarea" :rows="10" style="margin-top: 10px"></el-input>
        </div>
  </el-card>

</template>

<script>
import {dataToolApi} from "@/api";
import {SubjectType} from "@/constant/dataTool"

const SubjectTypes = Object.entries(SubjectType).map(([value, label]) => {
  return {label: label, value: value}
})

export default {
  name: "sampleOrder",
  data() {
    return {
      createOrder: false,
      SubjectTypes: SubjectTypes,
      orderForm: {
        subject: [],
        source: '',
        mobile: '',
      },
      orderRules: {
        subject: [{required: true, message: '请选择科目', trigger: 'blur'}],
        source: [{required: true, message: '请输入相关渠道', trigger: 'blur'}],
        mobile: [{required: true, message: '请输入手机号', trigger: 'blur'}],
      },
      result: '',
    }

  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.createOrder = true;
        }
        else {
          return false
        }
      });
    },
    orderSubmit() {
      console.log(this.orderForm)
      // eslint-disable-next-line no-undef
      let order_params = _.cloneDeep(this.orderForm);
      dataToolApi.createSampleOrder(order_params).then(res => {
        this.result = res.data
      })
      this.createOrder = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style scoped>

</style>
