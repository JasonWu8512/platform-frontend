<template>
  <div>
    <el-dialog
      :destroy-on-close="true"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      class="batch-edit-dialog"
      width="25%"
      @close="handleClose"
    >
      <el-form
        ref="editForm"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="160px"
        size="medium"
      >
        <el-form-item :label="`更新${size}个用例的属性`" prop="type">
          <el-select v-model="form.type" filterable style="width: 80%" @change="changeType">
            <el-option
              v-for="(type, index) in typeArr"
              :key="index"
              :label="type.text"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="更新后属性值为" prop="value">
          <el-select v-model="form.value" filterable style="width: 80%">
            <el-option
              v-for="(option, index) in options"
              :key="index"
              :label="option.text"
              :value="option.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <dialog-footer @cancel="dialogVisible = false" @confirm="submit"/>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import DialogFooter from "@/common/components/DialogFooter.vue"

export default {
  name: "BatchEdit",
  components: {DialogFooter},
  props: {
    typeArr: Array,
    valueArr: Object,
    dialogTitle: {
      type: String,
      default: '批量操作'
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {},
      size: 0,
      rules: {
        type: {required: true, message: '请选择属性', trigger: ['blur', 'change']},
        value: {
          required: true,
          message: '请选择属性对应的值',
          trigger: ['blur', 'change']
        }
      },
      options: [],
    }
  },
  methods: {
    submit() {
      this.$refs.editForm.validate((valid: any) => {
        if (valid) {
          this.$emit("batchEdit", this.form)
          this.dialogVisible = false
        }
      })
    },
    open() {
      this.dialogVisible = true
      this.size = this.$parent.selectRows.size
    },
    handleClose() {
      this.form = {}
      this.options = []
    },
    changeType(val: string) {
      this.$set(this.form, "value", "")
      this.options = this.valueArr[val]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
