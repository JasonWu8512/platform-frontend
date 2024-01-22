<template>
  <el-card>
    <div>
      <el-form ref="userForm" :model="userForm" label-width="100px" style="width: 100%; margin: 20px auto">
        <el-form-item label="课程类型:" prop="classType">
          <el-checkbox-group v-model="userForm.classType" :min="0" :max="1" :disabled="userForm.accountType.length > 0 || userForm.dataType.length > 0">
            <el-checkbox
            v-for="item in ClassTypes"
            :key="item.label"
            :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="账号类型:" prop="accountType">
          <el-checkbox-group v-model="userForm.accountType" :min="0" :max="1" :disabled="userForm.classType.length > 0 || userForm.dataType.length > 0">
            <el-checkbox
            v-for="item in AccountTypes"
            :key="item.label"
            :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="数据类型:" prop="dataType">
          <el-checkbox-group v-model="userForm.dataType" :min="0" :max="1" :disabled="userForm.classType.length > 0 || userForm.accountType.length > 0">
            <el-checkbox
            v-for="item in DataTypes"
            :key="item.label"
            :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input v-model="userForm.mobile" style="width: auto" placeholder="请输入用户手机号"></el-input>
        </el-form-item >
        <el-row style="margin-top: 30px">
          <el-col :span="7">
            <el-form-item label="itemId:" prop="itemId">
              <el-input v-model="userForm.itemId" style="width: auto" placeholder="请输入itemid"></el-input>
              <el-tooltip class="item" effect="dark" content="若场景为可复购类型，此字段必填；其他场景，本字段无效" placement="top">
                <i class="el-icon-question" style="margin-left: 5px"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="推荐级别:" prop="level">
              <el-select v-model="userForm.level">
                <el-option
                  v-for="item in options"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <el-tooltip class="item" effect="dark" content="若场景为支持导流到老机转，此字段必填" placement="top">
                <i class="el-icon-question" style="margin-left: 5px"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <div>
              <el-form-item label="宝贝生日:" prop="bd">
                <el-date-picker
                  v-model="userForm.bd"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期">
                </el-date-picker>
                <el-tooltip class="item" effect="dark" content="若场景为宝贝相关，此字段必填" placement="top">
                  <i class="el-icon-question" style="margin-left: 5px"></i>
                </el-tooltip>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" @click="userSubmit">创建用户</el-button>
          <el-button @click="resetForm('userForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="createUser" center title="提示" width="30%">
        <span>是否要创建相关用户吗？若与课程相关，请确保mock已打开</span>
        <span slot="footer">
          <el-button @click="createUser = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div style="margin-top: 50px; margin-left: 28px">
      <span style="font-size: 14px; float: left; color: #606266">响应数据：</span>
      <el-input type="textarea" :rows="10" style="margin-top: 10px" v-model="result"></el-input>
    </div>
  </el-card>



</template>

<script>
import {ClassType, AccountType, DataType} from '@/constant/dataTool'
import {dataToolApi} from "@/api";

const ClassTypes = Object.entries(ClassType).map(([value, label]) => {
  return {label: label, value: value}
})

const AccountTypes = Object.entries(AccountType).map(([value, label]) => {
  return {label: label, value: value}
})

const DataTypes = Object.entries(DataType).map(([value, label]) => {
  return {label: label, value: value}
})
export default {
  name: "generateAccount",
  data() {
    return {
      createUser: false,
      ClassTypes: ClassTypes,
      AccountTypes: AccountTypes,
      DataTypes: DataTypes,
      result: '',
      userForm: {
        classType: [],
        accountType: [],
        dataType: [],
        mobile: '',
        bd: '',
        itemId: '',
        level: '',
      },
      options: [{
        label: 'T1GE',
        value: 'T1GE',
      },
        {
          label: 'K1GE',
          value: 'K1GE',
        },
        {
          label: 'K3GE',
          value: 'K3GE',
        }]
    }
  },
  methods: {
    onSubmit() {
      this.result = ''
      console.log(this.userForm)
      // eslint-disable-next-line no-undef
      let user_params = _.cloneDeep(this.userForm);
      dataToolApi.createAccountTypeUser(user_params).then(res => {
        this.result = res.data
      })
      this.createUser = false
    },
    userSubmit() {
      this.createUser = true
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style scoped>

</style>
