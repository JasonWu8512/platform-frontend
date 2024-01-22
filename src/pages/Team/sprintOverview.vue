<template>
  <div>
    <gstc :config="config" @state="onState" @loaded="onLoaded" v-loading="loading"/>
  </div>
</template>

<script>
import {jiraApi} from "@/api"
import {PathName} from "@/constant/routeData"
import router from "../../router"
import GSTCComponent, { GSTC } from './components/GSTC.vue'


let subs = [];
// eslint-disable-next-line no-unused-vars
const GSTCID = GSTC.api.GSTCID;
const ganttKey = process.env.VUE_APP_GANTT_KEY;
// const gstcDate = GSTC.api.date;
export default {
  name: 'SprintOverview',
  components: {
    gstc: GSTCComponent,
  },
  data() {
    return {
      config: {
        licenseKey:
        ganttKey,
        innerHeight: window.innerHeight - 160,
        locale: {
          name: "zh",
          Now: "Now",
          weekdays:["周日","周一","周二","周三","周四","周五","周六"],
          months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        },
        actions: {
          'chart-timeline-items-row-item': [this.clickAction],
          'list-column-row': [this.sprintClickAction],
        },
        list: {
          columns: {
            data: {
              sprintName: {
                id: 'sprintName',
                data: 'sprintName',
                width: 200,
                // sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)),
                header: {
                  content: '迭代',
                },
              },
              master: {
                id: 'master',
                data: 'master',
                // sortable: 'label',
                isHTML: false,
                width: 100,
                header: {
                  content: 'scrumMaster',
                },
              },
            },
          },
          rows: { '1': {
            sprintName: '',
              master:'',
            }
          },
        },
        chart: {
          items: {},
          time: {
            zoom: 22,
            // from: gstcDate('2021-09-01').valueOf(),
            // to: gstcDate('2021-09-01').endOf('month').valueOf(),
            // calculatedZoomMode: true,
          }
        },
      }
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    }
  },
  mounted() {
    this.getSprintOverView()
    // console.log('ganttkey', ganttKey, process.env)
    window.onresize = () => {
      return (() => {
        this.config.innerHeight = window.innerHeight - 160
      })();
    };
  },
  methods: {
    getSprintOverView() {
      jiraApi.getSprintOverview().then(res => {
        res.data.rows.forEach((item, index) => {
          this.config.list.rows[String(index + 1)] = item
        })
        res.data.items.forEach(item => {
          function statusStyle(status) {
            if (status === 'normal') {
              return {
                style: { // 每个块的样式
                  background: '#7bcb7d',
                  'border-radius': '1px',
                },
              }
            }else if (status === 'delay') {
              return {
                style: { // 每个块的样式
                  background: '#fbcc3e',
                  'border-radius': '1px',
                },
              }
            }else if (status === 'today') {
              return {
                style: { // 每个块的样式
                  background: '#2286f7',
                  'border-radius': '1px',
                },
              }
            }else {
              return {
                style: { // 每个块的样式
                  background: '#99b5df',
                  'border-radius': '1px',
                },
              }
            }
          }
          this.config.chart.items[item['id']] = Object.assign({}, item, statusStyle(item.status))
        })
      })
    },
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
    // eslint-disable-next-line no-unused-vars
    clickAction(element, data) {
      // eslint-disable-next-line no-unused-vars
      function onClick(event) {
        router.push({name: PathName.SprintDetail, query: {projId: data.item.projId, sprintId: data.item.sprintId}})
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
    // eslint-disable-next-line no-unused-vars
    sprintClickAction(element, data) {
      // eslint-disable-next-line no-unused-vars
      function onClick(event) {
        console.log(data);
        router.push({name: PathName.SprintDetail, query: {projId: data.row.projId, sprintId: data.row.sprintId}})
      }
      element.addEventListener('click', onClick);

      return {
        update(element, newData) {
          data = newData;
        },
        // eslint-disable-next-line no-unused-vars
        destroy(element, data) {
          element.removeEventListener('click', onClick);
        },
      };
    }
  },
  beforeUnmount() {
    subs.forEach((unsub) => unsub());
  },
};
</script>

<style scoped lang="scss">
.card-margin-top {
  border: 2px;
  border-color: #2b2b2b;
}


</style>
