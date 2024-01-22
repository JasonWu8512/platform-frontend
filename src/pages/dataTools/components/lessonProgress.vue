<template>
  <el-card>
    <div>
      <el-form ref="lessonForm" :rules="lessonRules" :model="lessonForm" label-width="100px" style="width: 100%; margin: 20px auto">
        <el-form-item label="课程ID:" prop="lessonId">
          <el-input v-model="lessonForm.lessonId" style="width: 50%" placeholder="请输入lessonId"></el-input>
        </el-form-item>
        <el-form-item label="宝贝ID:" prop="bid">
          <el-input v-model="lessonForm.bid" style="width: 50%" placeholder="请输入bid"></el-input>
        </el-form-item>
        <el-form-item label="首次完课:" prop="isFirst">
          <el-select v-model="lessonForm.isFirst">
            <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成时间:" prop="finishTime">
          <el-date-picker
            v-model="lessonForm.finishTime"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" @click="lessonSubmit('lessonForm')">完课</el-button>
          <el-button @click="resetForm('lessonForm')">重置</el-button>
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
import {dataToolApi} from "@/api"

export default {
  name: "lessonProgress",
  data() {
    return {
      lessonForm: {
        lessonId: '',
        bid: '',
        isFirst: '',
        finishTime: ''
      },
      lessonRules: {
        lessonId: [{required: true, message: "请输入课程Id", trigger: "blur"}],
        bid: [{required: true, message: "请输入宝贝id", trigger: "blur"}],
        isFirst: [{required: true, message: "请输入是否首次完课", trigger: "blur"}],
        finishTime: [{required: true, message: "请输入完课时间", trigger: "blur"}],
      },
      result: '',
      options: [
        {label: '是',
        value: 1},
        {label: '否',
          value: 0}
      ]
    }
  },
  methods: {
    lessonSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          console.log(this.lessonForm)
          // eslint-disable-next-line no-undef
          let lesson_params = _.cloneDeep(this.lessonForm)
          dataToolApi.lessonProgress(lesson_params).then(res => {
            this.result = res.data
          })
        }
        else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
