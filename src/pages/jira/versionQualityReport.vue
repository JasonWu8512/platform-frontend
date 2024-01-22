<template>
  <div>
    <div
        v-for="(version, index) in versions"
        :key="index"
        :index="index"
        :version="version"
        style="margin: 20px auto;width: 80%;"
    >
      <el-card ref="companyStyle"
               :body-style="{ padding: '0px' }"
               element-loading-spinner="el-icon-loading"
               element-loading-text="拼命加载中">
        <div
            style="font-size: 16px; font-weight: 600; height: 40px; color: #fff;background-color:#2c2a48;  text-align: left;line-height: 40px; padding-left: 10px">
          <span>{{ version.version }}</span>
        </div>
        <!--        <el-table-->
        <!--            :data="version['details']"-->
        <!--            :row-class-name="tableRowClassName"-->
        <!--            row-key="id"-->
        <!--            :tree-props="{children: 'tasks'}"-->
        <!--        >-->
        <!--          <template v-for="col in columnsParent">-->
        <!--            <el-table-column :key="col.props" :label="col.label" :prop="col.props" :sortable="col.sortable">-->
        <!--              <template slot-scope="scope" style=" vertical-align: text-bottom">-->
        <!--                <img style="width: 12px; height: 12px;" v-if="col.props === 'type'" src="../../assets/img/jira_bug.svg" alt>-->
        <!--                <span>{{scope.row[col.props]}}</span>-->
        <!--              </template>-->
        <!--            </el-table-column>-->
        <!--          </template>-->
        <!--        </el-table>-->
        <no-data :data="version.chartData.rows"></no-data>
        <div v-if="version.chartData.rows.length" class="charts-wrap">
          <ve-histogram
              :colors="options.colors"
              :data="version.chartData"
              :extend="extend"
              :settings="chartSettings"
              :tooltip="options.tooltip"
              :judge-width="true"
              height="400px"
              style="width: 90%; margin: 0 auto"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import noData from "@/common/components/noData.vue"

export default {
  name: "versionQualityReport",

  props: {
    versions: {type: Array},
    activeName: {type: String},
  },
  components: {noData},

  data() {
    this.extend = {
      series: {
        label: {show: true, position: "top"}
      },
      // series(v) {
      //   label: { show: true, position: "top" }
      //   v && v.forEach(i => i.barGap = '0%')
      //   return v
      // }
    }
    return {
      options: {
        colors: ['#171E6D', '#1E3388', '#27539B', '#3073AE', '#3993C2', '#42B3D5', '#75C6D1', '#A9DACC', '#D2EDC8'],
        "colors20": ["#5B8FF9", "#CDDDFD", "#61DDAA", "#CDF3E4", "#65789B", "#CED4DE", "#F6BD16", "#FCEBB9", "#6F5EF9", "#D3CEFD", "#78D3F8", "#D3EEF9", "#9661BC", "#DECFEA", "#F6903D", "#FFE0C7", "#008685", "#BBDEDE", "#F08BB4", "#FFE0ED"],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
      },
      chartSettings: {
        axisSite: {right: ['人天bug率']},
        yAxisType: ['KMB', 'percent'],
      },
      // chartData: {
      //   columns: ['bugOwner', 'bug数', 'bug总分', 'bug率'],
      //   rows: []
      // },
      columnsParent: [{
        label: '指派人',
        props: 'bugOwner',
        sortable: true,
      },
        {
          label: 'bug数',
          props: 'bugCount',
          sortable: true,
        },
        {
          label: 'bug分数',
          props: 'point',
          sortable: true,
        },
        {
          label: '人天bug率',
          props: 'bugRate',
          sortable: true,
        },
        {
          label: '缺陷id',
          props: 'key',
          sortable: false,
        },
        {
          label: '状态',
          props: 'status',
          sortable: false,
        }],
    }
  },
  // computed: {
  //   // eslint-disable-next-line vue/return-in-computed-property
  //   chartWidth() {
  //     this.$nextTick(function () {
  //       console.log("companyStyle", this.$refs.companyStyle)
  //       // return this.$refs.companyStyle. - 80 + 'px';
  //
  //     })
  //   }
  // },

  methods: {
    tableRowClassName(row) {

      if (row.type === 'Bug') {
        return 'bug-row';
      }
      return '';
    },
    // resizeTheChart() {
    //   if (this.$refs.runTimes_creditChart) {
    //     this.$refs.runTimes_creditChart.resize();
    //   }
    //   if (this.$refs.transactions_creditChart) {
    //     this.$refs.transactions_creditChart.resize();
    //   }
    //   if (this.$refs.registers_creditChart) {
    //     this.$refs.registers_creditChart.resize();
    //   }
    // },


  },

  mounted() {
    // this.getVersionsReport();
  }
}
</script>
<style scoped>
.charts-wrap {
  margin: 20px 20px 0 40px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
