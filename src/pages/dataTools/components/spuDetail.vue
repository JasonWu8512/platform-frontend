<template>
  <el-card>
    <div>
      <el-form ref="spuForm" :rules="spuRules" :model="spuForm" label-width="100px" style="width: 100%; margin: 20px auto">
        <el-form-item label="spuNo:" prop="spuNo">
          <el-input v-model="spuForm.spuNo" style="width: auto" placeholder="请输入spuNo"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" @click="onSubmit('spuForm')">查询</el-button>
          <el-button @click="resetForm('spuForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-top: 50px; margin-left: 28px">
      <span style="font-size: 14px; float: left; color: #606266">响应数据：</span>
      <el-input type="textarea" :rows="15" style="margin-top: 10px" v-model="result"></el-input>
    </div>
  </el-card>

</template>

<script>
import {dataToolApi} from "@/api";

export default {
  name: "spuDetail",
  data() {
    return {
      spuForm: {
        spuNo: '',
      },
      spuRules: {
        spuNo: [{required: true, message: '请输入spuNo', trigger: 'blur'}],
      },
      result: '',
    }

  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-undef
          let spu_params = _.cloneDeep(this.spuForm);
          dataToolApi.getSpuDetailData(spu_params).then(res => {
            this.result = res.data
          })
        } else {
          return false
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style scoped>

</style>
