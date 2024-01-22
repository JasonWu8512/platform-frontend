<template>
  <div v-if="data.length === 0" class="card-body-style">
    <img alt src="../../assets/img/nodata2j.png" style="height: 200px; width: 200px">
  </div>
</template>

<script>
export default {
name: "noData",
  props:{
    data: {type: Array}
  }
}
</script>

<style scoped lang="scss">
.card-body-style {
  text-align:center;
  margin: 30px 30px 0px;
  line-height: 200px;
}

</style>
