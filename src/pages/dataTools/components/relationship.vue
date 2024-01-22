<template>
  <el-card>
    <div>
      <el-form ref="shipForm" status-icon :rules="shipRules" :model="shipForm" label-width="100px" style="width: 100%; margin: 20px auto">
        <el-form-item label="渠道类型:" prop="channel">
          <el-radio-group v-model="shipForm.channel">
            <el-radio
            v-for="item in ChannelTypes"
            :key="item.label"
            :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="科目类型:" prop="subject">
          <el-radio-group v-model="shipForm.subject">
            <el-radio
            v-for="item in SubTypes"
            :key="item.label"
            :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="锁粉类型:" prop="fanType">
          <el-radio-group v-model="shipForm.fanType">
            <el-radio
            v-for="item in Fantypes"
            :key="item.label"
            :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input v-model="shipForm.mobile" style="width: auto" placeholder="请输入用户手机号"></el-input>
        </el-form-item>
        <el-form-item label="粉丝手机号:" prop="fanMobile">
          <el-input v-model="shipForm.fanMobile" style="width: auto" placeholder="请输入粉丝手机号"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" @click="onSubmit('shipForm')">确认</el-button>
          <el-button @click="resetForm('shipForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="createRelation" center title="提示" width="30%">
        <span>确认要创建锁粉关系吗？</span>
        <span slot="footer">
          <el-button @click="createRelation = false">取 消</el-button>
          <el-button type="primary" @click="shipSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-card>

</template>

<script>
import {dataToolApi} from "@/api";
import {ChannelType, SubType, FanType} from '@/constant/dataTool'

const ChannelTypes = Object.entries(ChannelType).map(([value, label]) => {
  return {label: label, value: value}
})

const SubTypes = Object.entries(SubType).map(([value, label]) => {
  return {label: label, value: value}
})

const FanTypes = Object.entries(FanType).map(([value, label]) => {
  return {label: label, value: value}
})

export default {
  name: "relationship",
  data() {
    return {
      createRelation: false,
      ChannelTypes: ChannelTypes,
      SubTypes: SubTypes,
      Fantypes: FanTypes,
      shipForm: {
        channel: '',
        subject: '',
        fanType: '',
        mobile: '',
        fanMobile: '',
      },
      shipRules: {
        channel: [{required: true, message: '请选择渠道', trigger: 'blur'}],
        subject: [{required: true, message: '请选择科目', trigger: 'blur'}],
        fanType: [{required: true, message: '请选择锁粉类型', trigger: 'blur'}],
        mobile: [{required: true, message: '请输入手机号', trigger: 'blur'}],
        fanMobile: [{required: true, message: '请输入粉丝手机号', trigger: 'blur'}],
      },
    }

  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.createRelation = true;
        }
        else {
          return false
        }
      });
    },
    shipSubmit() {
      console.log(this.shipForm)
      // eslint-disable-next-line no-undef
      let ship_params = _.cloneDeep(this.shipForm);
      dataToolApi.xshareRelationshipData(ship_params).then()
      this.createRelation = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style scoped>

</style>
