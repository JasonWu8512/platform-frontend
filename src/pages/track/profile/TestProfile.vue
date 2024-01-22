<template>
  <el-container v-loading="loading">

    <el-aside v-if="!asideHidden">
      <div>
        <el-input v-model="uid" placeholder="UID(未登录时不用填写)" size="small" @change="getEventListByUser">
          <el-button slot="append" icon="el-icon-search" @click="getEventListByUser"></el-button>
        </el-input>
      </div>
      <div>

        <el-timeline >
          <el-timeline-item
            @click.native="getPropertiesByEvent(activity)"
            v-for="activity in activities"

            :key="activity.row"
            :color="activity.color"
            :timestamp="activity.event_datetime">
            {{ activity.event_key }}
          </el-timeline-item>
        </el-timeline>

      </div>


    </el-aside>
    <el-main >
      <el-card>
        <div slot="header" class="clearfix" >
          <p align="left" style="font-size: medium;font-weight: bolder">事件属性
<!--            <button type="button" @click="doCopy('add me!')" >Copy!</button>-->
          </p>
        </div>
        <div>
          <div v-if="JSON.stringify(eventProperties)==='{}'" style="font-size: 14px; color: #909399; text-align: center;">
            <span>暂无数据</span>
          </div>
          <div v-for="(key, index) in eventProperties" :key="index" align="left">
              <span style="font-weight: bold;font-size: medium">{{ index }}  </span>
              <span style="font-size: medium">: {{ key }}</span>
              <p></p>

            <!--          <json-viewer :value="prop" :expand-depth="5" copyable sort></json-viewer>-->

          </div>

<!--          <div v-for="prop in eventProperties" :key="prop" align="left">-->
<!--            <div v-for="(key, index) in prop" :key="key">-->
<!--              <span style="font-weight: bold;font-size: medium">{{ index }}  </span>-->
<!--              <span style="font-size: medium">: {{ key }}</span>-->
<!--              <p></p>-->
<!--            </div>-->
<!--            &lt;!&ndash;          <json-viewer :value="prop" :expand-depth="5" copyable sort></json-viewer>&ndash;&gt;-->

<!--          </div>-->
        </div>

      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <p align="left" style="font-size: medium;font-weight: bolder">用户属性</p>
        </div>
        <div v-if="JSON.stringify(userProperties)==='{}'" style="font-size: 14px; color: #909399; text-align: center;">
          <span>暂无数据</span>
        </div>
        <div v-for="(key, index) in userProperties" :key="index" align="left">
            <span style="font-weight: bold;font-size: medium">{{ index }}  </span>
            <span style="font-size: medium">: {{ key }}</span>
          <p></p>
        </div>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix" >
          <p align="left" style="font-size: medium;font-weight: bolder">公共属性</p>
        </div>
        <div>
          <div v-if="JSON.stringify(commonProperties)==='{}'" style="font-size: 14px; color: #909399; text-align: center;">
            <span>暂无数据</span>
          </div>
          <div v-for="prop in commonProperties" :key="prop" align="left">
            <div v-for="(key, index) in prop" :key="index">
              <span style="font-weight: bold;font-size: medium">{{ index }}  </span>
              <span style="font-size: medium">: {{ key }}</span>
              <p></p>
            </div>
            <!--          <json-viewer :value="prop" :expand-depth="5" copyable sort></json-viewer>-->

          </div>
        </div>

      </el-card>
    </el-main>

  </el-container>
</template>

<script lang="ts">

import apiBuriedAmp from "@/api/testBuriedAmp"
// import TablePagination from "@/common/components/pagination/TablePagination.vue"


// import {PAGINATION_SIZE} from "@/constant"

// import TableHeader from "@/pages/track/buried/components/TableHeader.vue"

export default {
  name: "TestBuried",
  components: {

  },
  data() {
    return {
      loading: false,
      asideHidden: false,
      uid: '',
      selectEvent: '',
      eventProperties: {},
      userProperties: {},
      commonProperties: {},
      activities: []
    }
  },
  computed: {

  },
  mounted() {
    this.initPageParams()
    // this.getEventListByUser()
  },
  methods: {
    initPageParams(){
      this.getEventListByUser()
    },
    getEventListByUser() {
      this.loading = true
      console.log('getEventListByUser', this.uid)
      apiBuriedAmp.GetEventByUser({uid: this.uid, eventKeys: this.selectEvent}).then(res => {

        this.activities = []
        for (let event of res.data.data){
          this.activities.push(
            {event_key: event.eventKey, uuid:event.uuid, row:event.row,
            user_properties: event.userProperties, event_datetime: event.eventDatetime,
          event_properties: event.eventProperties})
        }
        this.loading = false
        if (this.activities.length > 0) { // 初始化页面
          // this.selectEvent = this.activities[0].uuid
          this.eventProperties = this.activities[0].event_properties
          this.userProperties = this.activities[0].user_properties
          this.activities[0].color = '#0bbd87'
        }

        console.log('this.activities', this.activities, res)
      }).catch(res =>{
        console.log(res)
        this.loading = false
      })
    },

    getPropertiesByEvent(activity: any) {
      console.log('getPropertiesByEvent', this.uid, activity)
      this.eventProperties = {}
      this.userProperties = {}
      this.commonProperties = {}
      console.log('getPropertiesByEvent', this.eventProperties, activity)
      // console.log(JSON.stringify(activity.event_properties))
      // let tmp_event = JSON.stringify(activity.event_properties)
      // let tmp_user = JSON.stringify(activity.user_properties)
      // console.log(JSON.parse(tmp_event), 'JSON.parse(tmp)', typeof (JSON.parse(JSON.parse(tmp_event))))
      // this.eventProperties.push(JSON.parse(JSON.parse(tmp_event)))
      if (activity && activity.event_properties){
        this.eventProperties = activity.event_properties
      }

      if (activity && activity.user_properties){
        this.userProperties = activity.user_properties
      }

      // this.userProperties.push(JSON.parse(JSON.parse(tmp_user)))
      this.changeColor(activity)
    },
    changeColor(activity: any){
      // 更新选中状态
      for (let act of this.activities){
        if (activity.uuid == act.uuid){
          act.color = '#0bbd87'
        }else{
          act.color = '#909399'
        }
      }
    }

  }
}
</script>

<style lang="css">

.clearfix:before
</style>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.el-card {
  margin-top: 20px;
}
.el-timeline {
  margin-top: 10px;
  margin-left: 10px;
  padding: 20px;
}


.el-table .warning-row {
  background-color: #8f1e45;
}
//.bg-purple-dark {
//  background: #99a9bf;
//}
//.bg-purple {
//  background: #d3dce6;
//}
//.bg-purple-light {
//  background: #e5e9f2;
//}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 5px 0;
  background-color: #f9fafc;
  margin-right: 0;
}
.tableBox {
  th{
    height: 30px;
  }
  td {
    height: 30px;
  }
}



</style>

