<template>
  <div>
    <el-row class="table-title">
      <slot name="title">{{ title }}</slot>
    </el-row>
    <el-row>
      <div class="operate-button">
        <span class="operate-button">
          <el-button v-if="showCreate" :icon="iconCreate" size="mini" @click="create">
            {{ createTip }}
          </el-button>
          <el-button v-if="showRun" :icon="iconRun" size="mini" @click="runTest">
          {{ runTip }}
          </el-button>
          <el-button v-if="showThird" :icon="iconThird" size="mini" @click="thirdClick">
            {{ thirdTip }}
          </el-button>
          <slot name="button"/>
        </span>
        <span v-if="showSearch">
          <table-search-input-bar :placeholder="placeholder" @search="handleSearch"/>
          <table-adv-search-bar v-if="isCombine" :condition="condition" @search="handleSearch"/>
      </span>
      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
import TableAdvSearchBar from "@/common/components/search/TableAdvSearchBar.vue"
import TableSearchInputBar from "@/common/components/search/TableSearchInputBar.vue"

export default {
  name: "TableHeader",
  components: {TableAdvSearchBar, TableSearchInputBar},
  props: {
    title: String,
    showCreate: {
      type: Boolean,
      default: true
    },
    showRun: {
      type: Boolean,
      default: false
    },
    showThird: {
      type: Boolean,
      default: false
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    createTip: {
      type: String,
      default: '新建'
    },
    runTip: {
      type: String,
    },
    thirdTip: {
      type: String,
    },
    iconCreate: {
      type: String,
      default: 'el-icon-circle-plus-outline'
    },
    iconRun: {
      type: String,
      default: 'el-icon-video-play'
    },
    iconThird: {
      type: String
    },
    isTesterPermission: {
      type: Boolean,
      default: false
    },
    placeholder: {
      String,
      default: '根据名称搜索'
    },
    condition: Object,
  },
  methods: {
    handleSearch(value: string) {
      this.$emit('search', value)
    },
    create() {
      this.$emit('create')
    },
    runTest() {
      this.$emit('runTest')
    },
    thirdClick() {
      this.$emit('thirdClick')
    }
  },
  computed: {
    isCombine() {
      return this.condition.components !== undefined && this.condition.components.length > 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";
@import "src/assets/css/font";

.table-title {
  @extend %font-title;
  @extend %flex-left-top-row;
}

.operate-button {
  @extend %flex-between-center-row;
}

</style>
