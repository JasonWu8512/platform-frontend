<template>
  <div class="contain">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<script lang="ts">
export default {
  name: "TestTrack",
  computed: {
    projects() {
      return this.$store.state.jira.projects
    },
    users() {
      return this.$store.state.users.users
    },
  },
  provide() {
    return {
      projects: this.projects,
      users: this.users,
    }
  },
}
</script>

<style lang="scss" scoped>
.contain {
  height: 100%;
}
</style>

<style>
.el-container {
  height: 100%;
}
</style>
