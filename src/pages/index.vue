<template>
  <el-container>
    <el-header>
      <home-header></home-header>
    </el-header>
    <el-container v-if="isShow" style="height: calc(100vh - 50px)">
      <home-side></home-side>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HomeHeader from '@/common/components/head/HomeHeader'
import HomeSide from '@/common/components/side/HomeSide'

export default {
  name: "index",
  data() {
    return {
      width: '',
      isShow: true,
    }
  },
  components: {HomeHeader, HomeSide},
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/utils";

.el-container {
  height: 100%;
}

.el-header {
  height: 50px !important;
  padding: 0;
}

.el-main {
  padding: $main-padding;
  background-color: #f3f4f6;
}
</style>
<style lang="scss">

//::-webkit-scrollbar {
//  width: 0 !important;
//}
//::-webkit-scrollbar {
//  width: 0 !important;height: 0;
//}
</style>
