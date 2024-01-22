<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
    <el-backtop :visibility-height="100" target="#app"></el-backtop>
  </div>
</template>

<script>
import {userApi} from "@/api";
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      projectsSprints: [],
      isRouterAlive: true
    }
  },
  computed: {
    userId() {
      return this.$store.state.login.userid
    },
  },

  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true))
    },
    getDefaultMonth() {
      let time1 = new Date()
      let Y1 = time1.getFullYear()
      let M1 = ((time1.getMonth() + 1) > 9 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
      this.$store.commit('SET_MONTH', Y1 + '-' + M1)
    },
    setUserPermissions() {
      console.log('userId', this.userId)
      if (this.userId !== 0) {
        userApi.getUserPermissions({userId: this.userId}).then(res => {
          this.$store.commit('SET_ROLE', res.permissions)
        })
      }

    }
  },
  created() {
    // this.getProjects()
    this.getDefaultMonth()
    this.setUserPermissions()
  },
  mounted() {
    //不同标签的用户变化监测刷新
    let _this = this
    window.addEventListener("storage", function () {
      _this.$store.commit('FLASH_TOKEN')
    }, false);
  }
}
</script>

<style>
html, body {
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: auto;
}
::-webkit-scrollbar
{
  width: 5px;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
  border-radius: 10px;
  background: #f3f4f6;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.4);
  background-color: rgba(0,0,0,.4);
}
</style>
