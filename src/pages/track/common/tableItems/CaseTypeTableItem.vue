<template>
  <span>{{ caseTypeType[value] }}</span>
</template>

<script lang="ts">
import {caseTypeType} from "@/constant/TestCase"

export default {
  name: "CaseTypeTableItem",
  props: {
    value: String
  },
  data() {
    return {
      caseTypeType: caseTypeType,
    }
  }
}
</script>

<style scoped>

</style>
