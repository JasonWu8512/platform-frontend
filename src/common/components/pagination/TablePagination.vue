<template>
  <el-row>
    <div class="table-page">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </el-row>
</template>

<script lang="ts">
import {PAGINATION_SIZE} from "@/constant"

export default {
  name: "TablePagination",
  props: {
    page: Object,
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: PAGINATION_SIZE.LARGE
    },
    pageSizes: {
      type: Array,
      default() {
        return Object.values(PAGINATION_SIZE)
      }
    },
    total: {
      type: Number,
      default: 0
    },
    change: Function
  },
  methods: {
    handleSizeChange(size: typeof PAGINATION_SIZE) {
      this.$emit('update:pageSize', size)
      this.change()
    },
    handleCurrentChange(current: number) {
      this.$emit('update:currentPage', current)
      this.change()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";

.el-row {
  @extend %flex-end-stretch-row
}

.table-page {
  padding-top: 20px;
}
</style>
