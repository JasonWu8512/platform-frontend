<template>
  <div>
    <test-review-case-list
      ref="testReviewCaseList"
      :currentReview="currentReview"
      :projects="projects"
      @refresh="refresh"
    />
    <test-review-case-edit ref="testCaseEditDialog" :read-only="readOnly" @refresh="refresh"/>
  </div>
</template>

<script lang="ts">
import {testReviewApi} from "@/api"
import {operationEnum} from "@/constant/TestCase"
import TestReviewCaseEdit from "@/pages/track/review/view/components/TestReviewTestCaseEdit.vue"
import TestReviewCaseList from "@/pages/track/review/view/components/TestReviewTestCaseList.vue"


export default {
  name: "TestCase",
  components: {
    TestReviewCaseEdit,
    TestReviewCaseList,
  },
  comments: {},
  data() {
    return {
      operationEnum: operationEnum,
      projects: this.projects,
      currentReview: {},
      readOnly: false,
    }
  },
  created() {
    const reviewId = this.$route.params.reviewId

    if (reviewId) {
      this.getReviewDetail(reviewId)
    }
  },
  inject: ['projects'],
  methods: {
    refresh() {
      this.$refs.testReviewCaseList.initTableData()
    },
    getReviewDetail(reviewId: string) {
      testReviewApi.getTestCaseReviewDetail(reviewId)
        .then((data) => {
          this.currentReview = data
        })
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
