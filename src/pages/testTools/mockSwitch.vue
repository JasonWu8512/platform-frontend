<template>
  <el-card
      v-loading="loading"
      class="form-card"
      element-loading-spinner="el-icon-loading"
      element-loading-text="拼命加载中"
  >
    <div slot="header" class="card-title">
      <span>mock设置</span>

    </div>
    <el-form label-position="right" label-width="150px">
      <el-form-item label="环境 :">
        <!--          <el-switch v-model="env"></el-switch>-->
        <el-radio-group v-model="env" @change="getDomainStatus">
          <el-radio label="dev"></el-radio>
          <el-radio label="fat"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
          v-for="item in domains"
          :key="item"
          :label="`${item.domain}:`"
      >
        <el-row align="middle">
          <el-col :span="5">
            <el-switch v-model="item.status"></el-switch>
          </el-col>
          <el-col :span="15">
            <el-checkbox-group v-model="serverList" size="medium"><el-checkbox label="payatom"></el-checkbox><el-checkbox label="交易中台"></el-checkbox></el-checkbox-group>
          </el-col>
        </el-row>

        <div v-for="(item2, index) in item.details" :key="index">
          <span style="color: #909399"> {{item2.server}}:{{item2.status}}</span>
        </div>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: center;padding-top: 15px">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>

</template>

<script>
import {Message} from "element-ui"
import mock from "../../api/tool"

export default {
  name: "mockSwitch",
  data() {
    return {
      loading: false,
      serverList: [],
      domains: [{'domain': 'api.pingxx.com', 'status': false, 'details': []}],
      env: 'dev',
    }
  },
  computed: {
    host() {
      return this.$store.state.devHosts[this.env]
    },
    email() {
      return this.$store.state.login.email
    }
  },
  created() {
    this.getDomainStatus();
  },
  methods: {
    getDomainStatus() {
      mock.getAllDomainStatus({env: this.env}).then(res => {
        var result = res.data
        // var domain_keys = Object.keys(result)
        this.domains = result.map(item => {
          return {
            domain: item.domain,
            status: item.status,
            details: item.details
          }
        })
        this.loading = false;
      })
    },
    onSubmit() {
      this.loading = true;
      var domains = {};
      this.domains.forEach(item => {
        domains[item.domain] = item.status
      })
      mock.updateMock({env: this.env, domains: domains, user_email: this.email, server_list: this.serverList}).then(
          () => {
            this.getDomainStatus();
            this.loading = false
            Message({
              message: "正在重启支付服务，请耐心等待30秒后尝试",
              type: "info",
              duration: 3000,
              showClose: true
            })
          }
      ).catch(() => {
        this.loading = false
      });
    }
  }
}
</script>

<style lang="scss">
.el-form-item{
  text-align: left;
}
.form-card {
  width: 500px;
}

.card-title {
  font-size: 18px;
  font-weight: 500;
  text-align: left;
}

</style>
