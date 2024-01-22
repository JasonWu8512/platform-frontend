<template>
  <span class="adv-search-bar">
    <el-button type="text" @click="open">高级搜索</el-button>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      custom-class="adv-dialog"
      title="组合查询"
      @close="visible = false"
    >
      <div class="search-items">
        <component
          :is="component.name"
          v-for="(component, index) in config.components"
          :key="index"
          :component="component"
          class="search-item"
        />
        </div>
      <template slot="footer">
        <div class="dialog-footer">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
      </template>
    </el-dialog>
  </span>
</template>

<script lang="ts">
import components from "@/common/components/search/search-components"
import {cloneDeep} from "lodash"

export default {
  name: "TableAdvSearchBar",
  components: {...components},
  props: {
    condition: Object,
  },
  data() {
    return {
      visible: false,
      config: this.init()
    }
  },
  methods: {
    init() {
      let config = cloneDeep(this.condition);
      config.components.forEach((component: any) => {
        let operator = component.operator.value;
        component.operator.value = operator === undefined ? component.operator.options[0].value : operator;
      })
      return config;
    },
    search() {
      let condition: any = {}
      this.config.components.forEach((component: any) => {
        let operator = component.operator.value;
        let value = component.value;
        if (Array.isArray(value)) {
          if (value.length > 0) {
            condition[component.key] = {
              operator: operator,
              value: value
            }
          }
        } else {
          if (value !== undefined && value !== null && value !== "") {
            condition[component.key] = {
              operator: operator,
              value: value
            }
          }
        }
      });

      // 清除name
      if (this.condition.name) this.condition.name = undefined;
      // 添加组合条件
      this.condition.combine = condition;
      this.$emit('update:condition', this.condition);
      this.$emit('search', condition);
      this.visible = false;
    },
    reset() {
      let source = this.condition.components;
      this.config.components.forEach((component: any, index: any) => {
        if (component.operator.value !== undefined) {
          let operator = source[index].operator.value;
          component.operator.value = operator === undefined ? component.operator.options[0].value : operator;
        }
        if (component.value !== undefined) {
          component.value = source[index].value;
        }
      })
      this.condition.combine = undefined;
      this.$emit('update:condition', this.condition);
      this.$emit('search');
    },
    open() {
      this.visible = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.adv-search-bar {
  margin-left: 5px;
}

.dialog-footer {
  text-align: center;
}

.search-items {
  width: 100%;
}

@media only screen and (max-width: 1469px) {
  .search-item {
    width: 100%;
  }
}

@media only screen and (min-width: 1470px) {
  .search-item {
    width: 50%;
  }
}

.search-item {
  display: inline-block;
  margin-top: 10px;
}
</style>
