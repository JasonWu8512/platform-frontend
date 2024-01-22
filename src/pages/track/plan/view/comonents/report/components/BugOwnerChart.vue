<template>

  <common-component title="Bug分布图">

    <template>
      <div v-if="bugOwnerData.length === 0" style="font-size: 14px; color: #909399; text-align: center;">
        <span>暂无数据</span>
      </div>
      <div v-else>
        <div v-if="isShow">
          <chart  style="width: 100%; height: 400px" :options="options" :autoresize="true">
          </chart>
        </div>

      </div>
    </template>

  </common-component>

</template>

<script>
// import myPieChart from "@/common/components/myPieChart";
import CommonComponent from "./CommonComponent";

export default {
  name: "BugOwnerChart",
  components: {CommonComponent},
  data() {
    return {
      isShow: true,
      // chartData: [],

      radius: ['40%', '70%'],
      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: ['#c4d29b', '#9dbadb', '#dfa39b', '#f8dea7', '#aba1b9', '#f5c6d4', '#c7c7c7', '#a79b91', '#edbb92', '#e7a7af', '#aacfe9'],
        series: [{
          name: 'Bug等级',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],
          label: {
            formatter: '{b}:{c}',
            position: 'inner',
            fontSize: 12,
          },
          labelLine: {
            show: false
          },
          data: this.bugLevelData
        },
          {
            name: 'BugOwner',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
              length: 30,
            },
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,

              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
            data: this.bugOwnerData
          }
        ]
      }
    }
  },
  props: {
    bugOwnerData: {
      type: Array,
    },
    bugLevelData: {
      type: Array,
    },
  },
  watch: {
    bugOwnerData() {
      this.reload()
    }
  },
  mounted() {
    this.reload()
  },
  // computed: {
  //   levelChartData() {
  //     return this.getLevelData()
  //   },
  //   ownerChartData() {
  //     return this.getOwnerData()
  //   }
  // },
  // created() {
  //   this.reload();
  // },
  methods: {
    reload() {
      this.isShow = false;
      this.$nextTick(function () {
        this.isShow = true;
      })
    }
  }
}
</script>

<style scoped>

</style>
