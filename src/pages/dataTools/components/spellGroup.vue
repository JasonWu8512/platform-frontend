<template>
  <div>
    <el-card>
      <div>
        <el-form ref="groupForm" :rules="groupRules" :model="groupForm" label-width="100px" style="width: 100%; margin: 20px auto">
          <el-form-item label="团长:" prop="captain">
            <el-input v-model="groupForm.captain" style="width: 50%" placeholder="团长手机号"></el-input>
          </el-form-item>
          <el-form-item label="团ID:" prop="groupId">
            <el-input v-model="groupForm.groupId" style="width: 50%" placeholder="团Id"></el-input>
          </el-form-item>
          <el-form-item label="团员:" prop="crew">
            <el-input v-model="groupForm.crew" style="width: 50%" placeholder="若有多名团员,请用英文逗号分隔" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button type="primary" @click="groupSubmit('groupForm')">参团</el-button>
            <el-button @click="resetForm('groupForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 50px; margin-left: 28px">
        <span style="font-size: 14px; float: left; color: #606266">响应数据：</span>
        <el-input type="textarea" :rows="15" style="margin-top: 10px" v-model="result"></el-input>
      </div>
    </el-card>
  </div>

</template>

<script>
import {dataToolApi} from "@/api";

export default {
  name: "spellGroup",
  data() {
    return {
      groupForm: {
        captain: '',
        crew: '',
        groupId: ''
      },
      groupRules: {
        captain: [{required: true, message: '请输入团长手机号', trigger: 'blur'}],
        groupId: [{required: true, message: '请输入团ID', trigger: 'blur'}],
      },
      result: ''
    }
  },
  methods: {
    groupSubmit(forName) {
      this.$refs[forName].validate((valid) => {
        if(valid) {
          console.log(this.groupForm)
          // eslint-disable-next-line no-undef
          let group_params = _.cloneDeep(this.groupForm)
          dataToolApi.createInviterOrder(group_params).then(res => {
            this.result = res.data
          })
        }
        else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>

</style>
