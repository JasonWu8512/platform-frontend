<template>
  <div>
    <common-component title="冲刺预警" v-loading="loading">
      <div>
        <div>
          <div style="width: 180px; float: left; margin-bottom: 10px;align-items: center;display: flex;">
            <span style="height: 20px; font-size: 14px; font-weight: bold;white-space:pre">仅展示延期任务: </span>
            <el-switch v-model="onlyDelay"></el-switch>
          </div>
          <el-row style="margin-left: 180px">
            <el-col :span="1">
              <div style="width: 40px; height: 20px; background-color: #84bd54;"></div>
            </el-col>
            <el-col :span="1">
              <div style="width: 40px; height: 20px; color: #909399; font-size: 14px">正常</div>
            </el-col>
            <el-col :span="1">
              <div style="width: 40px; height: 20px; background-color: #0086b3;"></div>
            </el-col>
            <el-col :span="1">
              <div style="width: 40px; height: 20px; color: #909399; font-size: 14px">今天</div>
            </el-col>
            <el-col :span="1">
              <div style="width: 40px; height: 20px; background-color: #ffd050;"></div>
            </el-col>
            <el-col :span="1">
              <div style="width: 40px; height: 20px; color: #909399; font-size: 14px">延期</div>
            </el-col>
            <el-col :span="1">
              <div style="width: 40px; height: 20px; background-color: #b3d8ff;"></div>
            </el-col>
            <el-col :span="1">
              <div style="width: 50px; height: 20px; color: #909399; font-size: 14px">未开始</div>
            </el-col>
          </el-row>

        </div>


        <gstc :config="config" @state="onState" @loaded="onLoaded" />
      </div>

    </common-component>


  </div>
</template>

<script>
import organizationApi from "@/api/organization"
import CommonComponent from "@/pages/track/plan/view/comonents/report/components/CommonComponent"
import GSTCComponent, { GSTC } from './GSTC.vue'

let subs = [];
const GSTCID = GSTC.api.GSTCID;
const ganttKey = process.env.VUE_APP_GANTT_KEY
export default {
  name: "SubTaskProgress",
  components: {gstc: GSTCComponent,CommonComponent},
  props: {
    sprintId: {type: String},
  },
  data() {
    return {
      loading: false,
      onlyDelay: false,
      delayTasks: {
        items: {},
        rows: {}
      },
      allTasks: {
        items: {},
        rows: {}
      },
      config: {
        licenseKey: ganttKey,
          // '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
        locale: {
          name: "zh",
          Now: "Now",
          weekdays:["周日","周一","周二","周三","周四","周五","周六"],
          months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        },
        // innerHeight: 500,
        actions: {
          'chart-timeline-items-row-item': [this.clickAction],
        },
        list: {
          rows: {
            "1": {
              id: "",
              story: "",
              assigen: "",
              expanded: true
            },
          },
          columns: {
            data: {
              [GSTCID('id')]: {
                id: GSTCID('id'),
                data: ({row}) => GSTC.api.sourceID(row.id),
                width: 80,
                sortable: ({row}) => Number(GSTC.api.sourceID(row.id)),
                header: {
                  content: '序号',
                },
              },
              [GSTCID('story')]: {
                id: GSTCID('story'),
                data: 'story',
                sortable: 'story',
                isHTML: false,
                width: 200,
                expander: true,
                header: {
                  content: '任务',
                },
              },
              [GSTCID('assigen')]: {
                id: GSTCID('assigen'),
                data: 'assigen',
                sortable: 'assigen',
                isHTML: false,
                width: 200,
                header: {
                  content: '经办人',
                },
              },
            },
          },
        },
        chart: {
          time: {
            from: 0,
            to: 0,
            zoom: 21,
          },
          items: {},
        },
      }
    }
  },
  watch: {
    sprintId() {
      this.onlyDelay = false
      this.beforeUnmount();
      this.getSubTaskGantt(this.sprintId)
    },
    onlyDelay() {
      this.beforeUnmount();
      this.setGstcCongigs()
    }
  },
  methods: {
    beforeUnmount() {
      console.log("清除缓存")
      this.config.list.rows = {"1": {
          id: "",
          story: "",
          assigen: "",
          expanded: true
        },}
      this.config.chart.items = {}
    },
    onState(state) {
      this.state = state;
      subs.push(
        state.subscribe(`config.chart.items.${GSTCID('1')}`, (item) => {
          console.log('item 1 changed', item);
        })
      );
      subs.push(
        state.subscribe(`config.list.rows.${GSTCID('1')}`, (row) => {
          console.log('row 1 changed', row);
        })
      );
    },
    onLoaded(gstc) {
      window.gstc = gstc; // you can console it out
    },
    clickAction(element, data) {
      // eslint-disable-next-line no-unused-vars
      function onClick(event) {
        this.url = "https://jira.jiliguala.com/browse/" + data.item.key + "?jql=issuetype = " + data.item.key
        window.open(this.url)
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
    getSubTaskGantt() {
      this.allTasks.rows = {}
      this.allTasks.items = {}
      organizationApi.getSubTaskGantt({sprint_id: this.sprintId}).then(
        res => {
          this.config.chart.time.from = res.data.start
          console.log(res.data.start)
          this.config.chart.time.to = res.data.end
          console.log(res.data.end)
          res.data.rows.forEach(item => {
            this.allTasks.rows[item["id"]] = item
          })
          res.data.items.forEach(item => {
              function statusStyle(status) {
                if (status === 'normal') {
                  return {
                    style: {
                      background: '#84bd54',
                      'border-radius': '1px'
                    }
                  }
                } else if (status === 'today') {
                  return {
                    style: {
                      background: '#0086b3',
                      'border-radius': '1px'
                    }
                  }
                } else if (status === 'inProgress') {
                  return {
                    style: {
                      background: '#b3d8ff',
                      'border-radius': '1px'
                    }
                  }
                } else if (status === 'delay') {
                  return {
                    style: {
                      background: '#ffd050',
                      'border-radius': '1px'
                    }
                  }
                }
              }
              this.allTasks.items[item['id']] = Object.assign({}, item, statusStyle(item['status']))
            },
          )
          this.setGstcCongigs()
        },)
      this.loading = false;
    },
    setGstcCongigs() {
      if (this.onlyDelay) {
        this.delayTasks.items = {}
        this.delayTasks.rows = {}
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars
        let delayRows = Object.entries(this.allTasks.items).filter(([key, value]) => value.status === 'delay').map(([key, value]) => value.rowId)
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars
        Object.entries(this.allTasks.items).filter(([key, value]) => delayRows.indexOf(value.rowId) > -1).map(([key, value]) => {return {id: key, value: value}}).forEach(item => {
          this.delayTasks.items[item.id] = item.value
        })
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars
        Object.entries(this.allTasks.rows).filter(([key, value]) => delayRows.indexOf(value.id) > -1).map(([key, value]) => {return {id: key, value: value}}).forEach(item => {
          this.delayTasks.rows[item.value.parentId] = this.allTasks.rows[item.value.parentId]
          this.delayTasks.rows[item.id] = item.value
        })
        this.config.chart.items = this.delayTasks.items
        this.config.list.rows = this.delayTasks.rows
      }else {
        this.config.chart.items = this.allTasks.items
        this.config.list.rows = this.allTasks.rows
      }
    }
  },
}
</script>

<style lang="scss">

</style>
