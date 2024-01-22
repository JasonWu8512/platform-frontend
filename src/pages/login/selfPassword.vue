<template>
  <el-card>
    <div>
      <i class="q-icon fa fa-user"></i>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="addForm" :model="editData" :rules="rules" class="addForm" label-width="100px">
      <el-form-item label=" ">
        <p style="color:#999;">（ 这里的修改只针对本平台有效！）</p>
      </el-form-item>
      <el-form-item label="旧密码：" prop="oldpassword">
        <el-input v-model="editData.oldpassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newpassword">
        <el-input v-model="editData.newpassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="newpassword2">
        <el-input v-model="editData.newpassword2" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancelFun">取消</el-button>
        <el-button type="primary" @click="sureFun">确定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import userApi from "@/api/user"

export default {
  data: function () {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'));
      } else if (value !== this.editData.newpassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      editData: {
        oldpassword: "",
        newpassword: "",
        newpassword2: "",
      },
      rules: {
        oldpassword: [
          {required: true, message: "请填写旧密码", trigger: "blur"}
        ],
        newpassword: [
          {required: true, message: "请填写新密码", trigger: "blur"}
        ],
        newpassword2: [
          {required: true, validator: validatePass2, trigger: "blur"}
        ]
      }
    };
  },
  computed: {
    userId() {
      return this.$store.state.login.userid;
    },
    userName() {
      return this.$store.state.login.username;
    }
  },
  created() {
    // 进入页面，隐藏侧边栏
    this.$store.commit('SET_ASIDEHIDDEN', true)
  },
  methods: {
    cancelFun() {
      this.$store.commit('SET_ASIDEHIDDEN', false)
      this.$router.go(-1); //返回上一层
    },
    sureFun() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let params = {
            oldpassword: this.editData.oldpassword,
            newpassword: this.editData.newpassword
          };
          userApi.resetPassword(this.userId, params).then(
              // eslint-disable-next-line no-unused-vars
              res => {
                this.$message.success({
                  message: "密码修改成功！",
                  type: "success"
                });
                this.$store.commit('SET_ASIDEHIDDEN', false)
                this.$router.go(-1); //返回上一层
              },
          );
        }
      });
    },
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
.addForm {
  width: 500px;
}
</style>
