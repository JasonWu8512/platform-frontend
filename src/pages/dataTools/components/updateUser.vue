<template>
  <div>
    <el-card style="margin-top: 20px">
      <div>
        <el-form ref="updateForm" :model="updateForm" label-width="100px" style="width: 100%; margin: 20px auto">
          <el-form-item label="手机号:" prop="mobile">
            <el-input v-model="updateForm.mobile" style="width: 200px" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="状态:" prop="state">
            <el-select v-model="updateForm.state" style="width: 200px">
              <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.value"></el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" content="若场景为修改推广人状态，此字段必填" placement="top">
              <i class="el-icon-question" style="margin-left: 5px"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button type="primary" @click="queryClass">查询用户所有课程</el-button>
            <el-button type="primary" @click="deleteAllClass">删除用户所有课程</el-button>
            <el-button type="primary" @click="deleteUser">注销</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="deleteUserSample">删除用户体验课</el-button>
            <el-button type="primary" @click="updatepromoter">修改推广人状态</el-button>
            <el-button @click="resetForm('updateForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 50px; margin-left: 28px">
        <span style="font-size: 14px; float: left; color: #606266">响应数据：</span>
        <el-input type="textarea" :rows="15" style="margin-top: 10px" v-model="result"></el-input>
      </div>
      <div>
        <el-dialog :visible.sync="deleteClass" center title="提示" width="30%">
          <span>是否要删除用户下已拥有的所有课程？</span>
          <span slot="footer">
          <el-button @click="deleteClass = false">取 消</el-button>
          <el-button type="primary" @click="deleteSubmit">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog :visible.sync="cancelUser" center title="提示" width="30%">
          <span>是否要注销用户？</span>
          <span slot="footer">
          <el-button @click="cancelUser = false">取 消</el-button>
          <el-button type="primary" @click="deleteUserSubmit">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog :visible.sync="deleteSample" center title="提示" width="30%">
          <span>是否要删除用户下体验课？</span>
          <span slot="footer">
          <el-button @click="deleteSample = false">取 消</el-button>
          <el-button type="primary" @click="deleteSampleSubmit">确 定</el-button>
        </span>
        </el-dialog>
      </div>
    </el-card>
  </div>

</template>

<script>
import {dataToolApi} from "@/api";

export default {
  name: "updateUser",
  data() {
    return {
      updateForm: {
        mobile: '',
        state: '',
        date: '',
      },
      options: [{
        label: '激活',
        value: 'active',
      },
        {
          label: '冻结',
          value: 'frozen',
        },
        {
          label: '封号',
          value: 'forbidden',
        },{
          label: '未激活',
          value: 'inactive',
        },
        {
          label: '已失效',
          value: 'invalid',
        }],
      result: '',
      deleteClass: false,
      cancelUser: false,
      deleteSample: false
    }
  },
  methods: {
    queryClass() {
      console.log(this.updateForm)
      // eslint-disable-next-line no-undef
      let query_params = _.cloneDeep(this.updateForm);
      dataToolApi.getUserClass(query_params).then(res => {
        console.log(res.data)
        this.result = res.data
      })
    },
    deleteAllClass() {
      this.deleteClass = true
    },
    deleteUser() {
      this.cancelUser = true
    },
    deleteUserSample() {
      this.deleteSample = true
    },
    deleteSubmit() {
      // eslint-disable-next-line no-undef
      let delete_params = _.cloneDeep(this.updateForm);
      dataToolApi.deleteUserAllClass(delete_params).then()
    },
    deleteUserSubmit() {
      // eslint-disable-next-line no-undef
      let delete_user_params = _.cloneDeep(this.updateForm)
      dataToolApi.deleteAccount(delete_user_params).then()
      this.cancelUser = false
    },
    deleteSampleSubmit() {
      // eslint-disable-next-line no-undef
      let delete_sample_params = _.cloneDeep(this.updateForm)
      dataToolApi.deleteUserSampleClass(delete_sample_params).then()
      this.deleteSample = false
    },
    updatepromoter() {
      // eslint-disable-next-line no-undef
      let promoter_params = _.cloneDeep(this.updateForm);
      dataToolApi.updatePromoterState(promoter_params).then()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style scoped lang="scss">
.title_top{
  margin-top: 20px;
  color: #909399;
  font-size: 16px;
  font-weight: 600;
  float: left;
}
</style>
