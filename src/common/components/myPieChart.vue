<template>
  <div>
    <div v-if="data.length === 0" style="font-size: 14px; color: #909399; text-align: center;">
      <span>暂无数据</span>
    </div>
    <!--    <ve-ring :data="optiondatas" :settings="chartSettings"></ve-ring>-->
    <div v-if="data.length >0">
      <chart :autoresize="true" :options="options"
             :style="{'width': width, 'height': height, 'margin': '0 auto'}"
             theme="default">
      </chart>
    </div>
  </div>
</template>

<script>

export default {
  name: "myPieChart",
  mounted() {
    this.getDataNamesByData();
  },
  computed: {
    options() {
      return {
        // color: ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42'],
        color: this.color,
        title: {
          text: this.text,
          subtext: this.subtext,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}:{c}({d}%)'
        },
        // legend: {
        //   orient: 'vertical',
        //       left: 20,
        //       data: this.dataNames
        // },
        series: [
          {
            name: this.name,
            type: 'pie',
            radius: this.radius,
            // roseType: 'angle',
            itemStyle: {
              // borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: this.data,
            animation: false,
            label: {
              normal: {
                show: true,
                position: 'outside',
                formatter: '{b}:{c}'
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
          }
        ]
      }
    }
  },
  watch: {
    data() {
      this.getDataNamesByData();
    }
  },
  data() {
    return {

      dataNames: ['示例1', '示例2', '示例3']
    }
  },
  props: {
    width: {
      type: String,
      default: '400px'
    },
    height: {
      type: String,
      default: '300px'
    },
    radius: {
      type: Array,
      default() {
        return ['30%', '60%']
      }
    },
    color: {
      type: Array,
      default() {
        return ['#171e6d', '#1E3388', '#27539B', '#3073AE', '#3993C2', '#42B3D5','#75C6D1', '#A9DACC', '#D2EDC8']
      }
    },
    text: {
      type: String,
      default: '图表名称'
    },
    name: {
      type: String,
      default: '数据名称'
    },
    subtext: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default() {
        return [
          {
            value: 235, name: '示例1',
            itemStyle: {
              color: '#6e7074'
            }
          },
          {
            value: 274, name: '示例2',
            itemStyle: {
              color: '#ca8622'
            }
          },
          {
            value: 274, name: '示例3',
            itemStyle: {
              color: '#bda29a'
            }
          }
        ];
      }
    }
  },
  methods: {
    getDataNamesByData() {
      // console.log('data', this.data)
      let itemNames = [];
      this.data.forEach(item => {
        itemNames.push(item.name);
      });
      this.dataNames = itemNames;
    }
  }
}
</script>

<style scoped>
/*.echarts {*/
/*  width: 400px;*/
/*  height: 300px;*/
/*}*/

</style>
