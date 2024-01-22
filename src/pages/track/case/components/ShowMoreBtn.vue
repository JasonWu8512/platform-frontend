<template>
  <el-dropdown
    :class="isDisabled? 'disabled': ''"
    placement="bottom"
    size="medium"
    trigger="click"
  >
    <div class="show-more-btn" @click.stop>
      <i class="el-icon-more ms-icon-more"/>
    </div>
    <el-dropdown-menu slot="dropdown" class="dropdown-menu-class">
      <div class="show-more-btn-title">{{ `批量处理 (选中${size}项)` }}</div>
      <el-dropdown-item
        v-for="(btn, index) in buttons"
        :key="index"
        @click.native.stop="click(btn)"
      >
        {{ btn.name }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
export default {
  name: "ShowMoreBtn",
  props: {
    isDisabled: {
      type: Boolean,
      default: true
    },
    buttons: Array,
    row: Object,
    size: Number
  },
  methods: {
    click(btn: any) {
      if (btn.handleClick instanceof Function) {
        btn.handleClick()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.ms-icon-more {
  transform: rotate(90deg);
}

.show-more-btn {
  width: 20px;
  height: 25px;
  line-height: 25px;
}

.show-more-btn-title {
  color: #696969;
  background-color: #e2e2e2;
  padding: 5px;
}

.dropdown-menu-class {
  padding: 1px 0;
  text-align: center;
}

.disabled {
  pointer-events: none;
  color: #d9d9d9;
}

</style>
