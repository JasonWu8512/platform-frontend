<template>
  <div>
    <allure-report :history-id="historyId"></allure-report>
  </div>
</template>

<script lang="ts">
import {autoApi} from "@/api"
import AllureReport from "@/pages/track/plan/view/comonents/report/components/AllureReport.vue"
export default {
  name: "AutoReport",
  components: {AllureReport},
  data() {
    return {
      detail: {}
    }
  },
  computed: {
    historyId() {
      return this.$route.params.historyId ? this.$route.params.historyId : ''
    }
  },
  mounted() {

  },
  methods: {
    getCaseRunDetail(caseUid: string){
      autoApi.getAllureDetail(caseUid).then(res => {
        this.detail = res.data.detail
      })
    }
  }
}
</script>

<style scoped>

</style>
