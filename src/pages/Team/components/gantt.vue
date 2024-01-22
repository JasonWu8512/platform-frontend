<template>
  <div class="app-container">
    <gstc :config="config" @state="onState" @loaded="onLoaded" v-show="show"/>
    <div v-if="!show" style="font-size: 14px; color: #909399; text-align: center; margin-top: 30px">
      <span>暂无数据</span>
    </div>
  </div>
</template>

<script>
import GSTCComponent, { GSTC } from './GSTC.vue';

let subs = [];
// eslint-disable-next-line no-unused-vars
const GSTCID = GSTC.api.GSTCID;
const ganttKey = process.env.VUE_APP_GANTT_KEY

export default {
name: "gantt",
  props: {
    items: {type: Object},
  },
  components: {
    gstc: GSTCComponent,
  },
  watch: {
    items() {
      this.getTaskGantt()
    }
  },
  data() {
    return {
      show:false,
      config: {
        licenseKey:
        ganttKey,
        innerHeight: window.innerHeight - 260,
        locale: {
          name: "zh",
          Now: "Now",
          weekdays:["周日","周一","周二","周三","周四","周五","周六"],
          months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        },
        actions: {
          'chart-timeline-items-row-item': [this.clickAction],
        },
        list: {
          columns: {
            data: {
              assignee: {
                id: 'assignee',
                data: 'assignee',
                width: 200,
                // sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)),
                header: {
                  content: '成员',
                },
              },
            },
          },
          rows: { '1': {
              assignee: '',
            }
          },
        },
        chart: {
          items: {},
          time: {from: 0, to: 0}
        },
      }
    }
  },
  methods: {
    onState(state) {
      this.state = state;
      subs.push(
        state.subscribe(`config.chart.items.a1}`, (item) => {
          console.log('item 1 changed', item);
        })
      );
      subs.push(
        state.subscribe(`config.list.rows.a1`, (row) => {
          console.log('row 1 changed', row);
        })
      );
    },
    onLoaded(gstc) {
      console.log('gstc loaded!', gstc);
      window.gstc = gstc; // you can console it out
    },
    getTaskGantt() {
      this.config.chart.time = this.items.time
      this.config.list.rows = this.items.rows
      this.config.chart.items = this.items.tasks
      if (this.config.chart.items) {
        this.show = true
      }
    },
    clickAction(element, data) {
      // eslint-disable-next-line no-unused-vars
      function onClick(event) {
        window.open(data.item.key)
      }
      element.addEventListener('click', onClick);
      return {
        update(element, newData) {
          data = newData; // data from parent scope updated
        },

        // eslint-disable-next-line no-unused-vars
        destroy(element, data) {
          element.removeEventListener('click', onClick);
        },
      };
    },

  },
  mounted() {
    // this.initData()

  }
}
</script>
<style lang="scss">
.app-container {
  overflow: auto;
}
.gantt_task_content{
  // font-weight: bold;
  font-size: 12px;
}
.firstLevelTask {
  border: none;
  .gantt_task_content{
    // font-weight: bold;
    font-size: 13px;
  }
}

.secondLevelTask {
  border: none;
}

.thirdLevelTask {
  border: 2px solid #da645d;
  color: #da645d;
  background: #da645d;
}

.milestone-default {
  border: none;
  background: rgba(0, 0, 0, 0.45);
}

.milestone-unfinished {
  border: none;
  background: #5692f0;
}

.milestone-finished {
  border: none;
  background: #84bd54;
}

.milestone-canceled {
  border: none;
  background: #da645d;
}

html, body {
  margin: 0px;
  padding: 0px;
  height: 100%;
  overflow: auto;
}

//.container {
//  height: 900px;
//  .left-container {
//    height: 100%;
//  }
//}
//
.left-container {
  height: 600px;
  margin-top: 30px;
}

.gantt_scale_line {
  border-top: 0;
}

.weekend {
  background:#f4f7f4!important;
}

.gantt_selected .weekend {
  background: #f7eb91 !important;;
}

.gantt_task_content {
  text-align: left;
  padding-left: 5px;
  font-size: 10px;
}

//上面任务条样式
//.gantt_task_scale {
//  height: 45px !important;
//}

.gantt_task .gantt_task_scale .gantt_scale_cell {
  font-size: 12px !important
  //line-height: 30px !important;
  //height: 28px !important;
}

</style>
