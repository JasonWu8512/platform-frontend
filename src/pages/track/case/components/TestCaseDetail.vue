<template>
  <test-case-form ref="caseForm" :condition="condition" :read-only="readOnly"/>
</template>

<script lang="ts">
import TestCaseForm from "@/pages/track/case/components/TestCaseForm.vue"

export default {
  name: "TestCaseDetail",
  components: {TestCaseForm},
  props: {
    readOnly: {
      type: Boolean,
      default: true
    },
    condition: Object,
    form: Object,
  },
  mounted() {
    this.form.module = this.form.treeId
    this.form.maintainer = this.form.qa
    this.form.priority = this.form.importance
    this.form.method = this.form.executionType
    this.form.prerequisite = this.form.preconditions
    this.$refs.caseForm.initForm(this.form)
  },
}
</script>

<style lang="scss" scoped>

</style>
