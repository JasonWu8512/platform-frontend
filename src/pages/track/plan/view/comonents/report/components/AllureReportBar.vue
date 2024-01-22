<template>
  <div>
    <div slot="bar" style="display: flex; border-radius: 4px; overflow: hidden;" v-if="showBar">
      <div v-if="statistic.failed" :style="barStyle(statistic.failed)" class="case-failed">
        {{ statistic.failed }}
      </div>
      <div v-if="statistic.broken" :style="barStyle(statistic.broken)" class="case-broken">
        {{ statistic.broken }}
      </div>
      <div v-if="statistic.passed" :style="barStyle(statistic.passed)" class="case-passed">
        {{ statistic.passed }}
      </div>
      <div v-if="statistic.skipped" :style="barStyle(statistic.skipped)" class="case-skipped">
        {{ statistic.skipped }}
      </div>
      <div v-if="statistic.unknown" :style="barStyle(statistic.unknown)" class="case-unknown">
        {{ statistic.unknown }}
      </div>
    </div>
    <div v-if="showTag" style="display: flex; align-items: center;">
      <el-tag class="case-failed case-status" size="mini" v-if="statistic.failed">{{ statistic.failed }}</el-tag>
      <el-tag class="case-broken case-status" size="mini" v-if="statistic.broken">{{ statistic.broken }}</el-tag>
      <el-tag class="case-passed case-status" size="mini" v-if="statistic.passed">{{ statistic.passed }}</el-tag>
      <el-tag class="case-skipped case-status" size="mini" v-if="statistic.skipped">{{ statistic.skipped }}</el-tag>
      <el-tag class="case-unknown case-status" size="mini" v-if="statistic.unknown">{{ statistic.unknown }}</el-tag>
    </div>
  </div>

</template>

<script>
export default {
  name: "AllureReportBar",
  props: {
    statistic: Object,
    showTag: {type: Boolean, default: false},
    showBar: {type: Boolean, default: true}
  },
  computed: {
    barStyle() {
      return function (grow) {
        return `flex-grow: ${grow}; text-align: center; color: white;`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/color";

.case-failed {
  background-color: $color-status-failed;
}

.case-broken {
  background-color: $color-status-broken;
}

.case-passed {
  background-color: $color-status-passed;
}

.case-skipped {
  background-color: $color-status-skipped;
}
.case-status {
  color: white;
  border: none;
  border-radius: 3px;
  margin: 0 3px;
  font-size: 12px;
  font-weight: 600;
  height: 18px;
  //display: flex;
  //align-items: center;
}
.case-unknown {
  background-color: $color-status-unknown;
}
</style>
