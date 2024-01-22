<!--<template>-->
<!--  <div id="c1"></div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--name: "myBar",-->
<!--  props: {-->

<!--  },-->
<!--  data() {-->
<!--  return {-->
<!--    chart: null,-->
<!--    data: [-->
<!--      { genre: "Sports", sold: 275 },-->
<!--      { genre: "Strategy", sold: 115 },-->
<!--      { genre: "Action", sold: 120 },-->
<!--      { genre: "Shooter", sold: 350 },-->
<!--      { genre: "Other", sold: 150 }-->
<!--    ]-->
<!--  }-->
<!--  },-->
<!--  methods: {-->
<!--    initComponent() {-->
<!--      // 此函数为个人习惯,喜欢创建一个初始化的函数-->
<!--      this.msg = "vue-cli案例";-->
<!--      const chart = new G2.Chart({-->
<!--        container: "c1",-->
<!--        autoFit: true,-->
<!--        height: 300-->
<!--      })-->
<!--      chart.source(this.data);-->
<!--      chart-->
<!--          .interval()-->
<!--          .position("genre*sold")-->
<!--          .color("genre");-->
<!--      this.chart = chart-->
<!--      this.chart.render()-->
<!--    }-->
<!--  },-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->