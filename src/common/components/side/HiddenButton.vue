<template>
  <div :style="{'left': this.width}" class="hiddenButton" @click="handleClick">
    <i v-if="hidden" class="el-icon-arrow-right"/>
    <i v-else class="el-icon-arrow-left"/>
  </div>
</template>

<script lang="ts">

import variables from "@/assets/css/utils.scss"

export default {
  name: "HiddenButton",
  data() {
    return {
      hidden: false
    }
  },
  computed: {
    width() {
      return this.hidden ? this.asideWidth : this.unfoldWidth
    },
    asideWidth() {
      return this.$store.state.sidebar.asideWidth
    },
    unfoldWidth() {
      if (this.asideWidth === variables['asideWidth']) return variables['unfoldButtonPosition']
      else return variables['hiddenButtonPosition']
    }
  },
  methods: {
    handleClick() {
      this.hidden = !this.hidden
      this.$emit('click', this.hidden)
    }
  }
}
</script>

<style lang="scss" scoped>
.hiddenButton {
  width: 8px;
  height: 50px;
  top: calc((100vh - 80px) / 3);
  line-height: 50px;
  border-radius: 0 15px 15px 0;
  background-color: #acb7c1;
  display: inline-block;
  position: absolute;
  cursor: pointer;
  opacity: 0.2;
  font-size: 2px;

  i {
    margin-left: -2px;
  }

  &:hover {
    opacity: 0.8;
    width: 12px;

    i {
      margin-left: 0;
      color: white;
    }
  }
}

</style>
