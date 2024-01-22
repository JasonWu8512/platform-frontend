<template>
  <div>
    <test-case-review-list ref="caseReviewList" :condition.sync="condition"/>

    <test-case-review-edit ref="caseReviewEditDialog" :condition="condition" @refresh="refresh"/>
  </div>
</template>

<script lang="ts">
import {typeReviewForm} from "@/api/types/testReviewType"
import TestCaseReviewEdit from "@/pages/track/review/components/TestCaseReviewEdit.vue"
import TestCaseReviewList from "@/pages/track/review/components/TestCaseReviewList.vue"

export default {
  name: "TestCaseReview",
  components: {
    TestCaseReviewList,
    TestCaseReviewEdit
  },
  data() {
    return {
      condition: {}
    }
  },
  methods: {
    editCaseReview(condition: any, data: typeReviewForm) {
      this.$refs.caseReviewEditDialog.open(condition, data)
    },
    refresh() {
      this.$nextTick(() => {
        this.$refs.caseReviewList.initTableData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
