<template>
  <div class="header-main">
    <div class="header-left">
      <router-link :to="{name: PathName.Dashboard}" class="logo">
        <img alt="logo" :src="logo">
        <span>测试平台</span>
      </router-link>
    </div>
    <div class="user-info">
      <img v-if="picture" :src="picture" alt>
      <img v-else alt src="@/assets/img/user-icon.png">
      <el-dropdown class="cur-user">
        <span>{{ username }}</span>
        <el-dropdown-menu slot="dropdown" class="user-action">
<!--          <el-dropdown-item>-->
<!--            <div @click="changePassword">-->
<!--              <i class="fa el-icon-edit"></i>修改密码-->
<!--            </div>-->
<!--          </el-dropdown-item>-->
          <el-dropdown-item>
            <div @click="loginOutFun">
              <i class="fa fa-power-off"></i>退出登录
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import {userApi} from "@/api";
import {PathName} from "@/constant/routeData"

export default {
  name: "HomeHeader",
  data() {
    return {
      PathName: PathName,
      logo: "https://spa.jiliguala.com/mirage/static/media/logo.661199a5.svg"
    }
  },
  computed: {
    username() {
      return this.$store.getters.userName;
    },
    uid() {
      return this.$store.getters.uid
    },


    picture() {
      return this.$store.state.login.picture;
    },
  },
  methods: {
    loginOutFun() {
      console.log('uuuuuu', this.uid)
      userApi.ssoLogout({uid: this.uid}).then((res:any) => {
        if (res.code === 0){
          this.$store.commit("CLEAR_TOKEN");
          this.$router.push({name: PathName.SslLogin});
          }
        }
      )
      // this.$store.commit("CLEAR_TOKEN");
      // this.$router.push({name: PathName.Login});
    },

    changePassword() {
      this.$store.commit('UNVISIBLE_SIDE', false)
      this.$router.push({name: PathName.SelfPassword});
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";
@import "src/assets/css/utils";

.header-main {
  padding: 0 20px 0 15px;
  height: $header-height;
  width: 100%;
  background: #2c2a48;
  position: fixed;
  z-index: $header-z-index;
  @extend %flex-between-center-row;

  .header-left {
    @extend %flex-between-center-row;
  }

  .logo {
    img {
      width: 20px;
      height: 20px;
      margin-right: 15px;
      vertical-align: middle;
    }

    span {
      line-height: $header-height;
      color: #fff;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      vertical-align: middle;
    }
  }
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
    margin: 0 8px 0 12px;
    border-radius: 4px;
  }

  .el-dropdown-link {
    outline: none;
  }

  .cur-user {
    color: white;
  }

  em {
    margin-left: 30px;
    position: relative;
    bottom: -3px;
  }
}

.user-action {
  width: 130px;

  .el-dropdown-menu__item {
    font-size: 14px;
    height: 40px;

    i {
      margin: 0 8px 0 10px;
    }
  }

  &.el-dropdown-menu--mini .el-dropdown-menu__item {
    line-height: 40px;
  }
}
</style>
