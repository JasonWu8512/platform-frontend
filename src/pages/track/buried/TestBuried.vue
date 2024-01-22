<template>
  <el-card>
    <template slot="header">
      <table-header :condition="condition"
                    ref="headerTable"
                    placeholder="请输入行为用户UID"
                    :inputText="inputText"
                    :search_text="search_text"
                    :showCreate="false"
                    :showSearch="configId === ''"
                    :projDefaultSelect="projDefaultSelect"
                    :endVersion="endVersion"
                    :endVersionSelect="endVersionSelect"
                    :startVersion="startVersion"
                    :startVersionSelect="startVersionSelect"
                    :projectList="projectList"
                    :status="status"
                    :statusSelect="statusSelect"
                    :getProjectList="getProjectList"
                    :getEnumVersionList="getEnumVersionList"
                    :envSelect="envSelect"
                    :envList="envList"
                    :checkEvent="checkEvent"
                    v-on:updateSelectProjValue="updateSelectProjValue($event)"
                    v-on:getEventListValue="getEventListValue($event)"
                    v-on:checkEvent="checkEvent($event)"
      >


        <template slot="title">
          <div>数据埋点</div>
        </template>
      </table-header>
      <!--      <event-select></event-select>-->
    </template>

    <el-header>
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="4">
          <el-input
            placeholder="请输入行为用户的UID"
            size="mini"
            v-model="inputText"
            clearable>
          </el-input>

        </el-col>
        <el-col :span="2">
          <el-button plain @click="operateEvent($event)">批量操作</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-table :data="tableData" size="medium" @selection-change="handleSelectionChange" >
      <el-table-column
        type="selection"
        v-model="multipleSelection"
        :default-sort="{prop: 'id', order: 'descending'}"
        width="50">
      </el-table-column>
      <!--        <el-table-column prop="id" label="事件自增ID"/>-->
      <el-table-column prop="eventKey" label="事件ID"></el-table-column>
      <el-table-column prop="status" label="事件状态" :formatter="statusFormat"></el-table-column>
      <el-table-column prop="createUser" label="事件创建人"	></el-table-column>

      <el-table-column prop="createdTime" label="事件创建时间" :formatter="dateFormat"></el-table-column>
      <el-table-column prop="startVersion" label="起始版本"></el-table-column>
      <el-table-column prop="endversion" label="结束版本"></el-table-column>


    </el-table>


    <el-dialog title="数据埋点检查(3min)" :visible.sync="diaglogVisibel" width="60%">
      <el-table
        :data="checkData"
        size="medium"
        stripe
        class="tableBox"
        row-class-name="warning-row"
        :default-sort="{prop: 'eventKey', order: 'descending'}"
        border="true"
      >
        <!--        <el-table-column prop="id" label="事件自增ID" sortable />-->
        <el-table-column prop="eventKey" label="事件ID" sortable width="100"/>
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="eventDesc" label="事件备注" show-overflow-tooltip/>
        <el-table-column prop="priority" label="级别"/>
        <el-table-column prop="eventEventProper" label="事件属性Key" width="200"/>
        <el-table-column prop="eventEventProperValue" label="埋点属性值"/>
        <el-table-column prop="eventTime" label="埋点触发时间" width="100"/>
        <el-table-column prop="result" label="事件是否埋点" sortable />
        <el-table-column
          prop="eventEventProperResult" label="属性是否关联"
          sortable />
        <el-table-column prop="eventUserAllPropsCK" width="100" label="用户属性记录" resizable/>
        <el-table-column prop="eventEventAllPropsCK" width="500" label="事件属性记录" resizable/>

      </el-table>

    </el-dialog>
    <table-pagination
      :change="getPageEventListValue"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="total"
    />
  </el-card>
</template>

<script lang="ts">

import apiBuried from "@/api/testBuried"
import TablePagination from "@/common/components/pagination/TablePagination.vue"


import {PAGINATION_SIZE} from "@/constant"

import TableHeader from "@/pages/track/buried/components/TableHeader.vue"

export default {
  name: "TestBuried",
  components: {
    TablePagination,
    TableHeader,

  },
  data() {
    return {
      //
      inputText: '',
      search_text: '',
      //结果弹窗
      diaglogVisibel: false,
      multipleSelection: [],
      checkData: [],
      // 环境
      envList: [
        // {value: "fat", label: "fat"},
        {value: "prod", label: "prod"},
      ],
      envSelect: "prod",

      condition: {},
      // 项目
      projectList: [],
      project_id: 1,
      projDefaultSelect: "",
      total: 0,
      pageSize: PAGINATION_SIZE.LARGE,
      currentPage: 1,
      tableData: [],
      userPipelineId: true,
      //版本
      endVersion: [],
      startVersion: [],
      endVersionSelect: "",
      startVersionSelect: "",
      //状态
      statusSelect: "",
      status: [
        {value: "online", label: "已上线",},
        {value: "offline", label: "已下线"},
        {value: "init", label: "创建中",},
        {value: "test", label: "测试中",},
        {value: "dev", label: "开发中",},
        {value: "pre", label: "待上线",},
      ],
    }
  },
  computed: {
    configId() {
      return this.$route.params.configId ? this.$route.params.configId : ''
    }
  },
  mounted() {
    this.initPageParams()

  },
  methods: {
    checkEvent(msg:any){
      var env = msg[0]
      var project_id = msg[1]
      var uid = msg[2]
      console.log(this.multipleSelection)
      if (this.multipleSelection.length === 0){
        this.$message({
          message: '请至少选择一项',
          type: 'warning'
        })
      }else{

        var sendparams = {
          env: env,
          uid: uid,
          project_id: project_id,
          event_keys: this.multipleSelection,
          // platform: platform,
        }

        apiBuried.getTestBuriedCheckList(sendparams).then(res => {
          console.log(res.data)
          this.diaglogVisibel = true
          this.checkData = res.data
        })
      }
    },

    handleSelectionChange(val:any){ this.multipleSelection = val },
    dateFormat(row: any){
      // return new Date(row.createTime).format('yyyy-MM-dd hh:mm:ss')
      var dateFormat = function(timestamp: string){
        var add0 = function(m: number){
          return m < 10 ? '0' + m: m
        }
        var time = new Date(timestamp)    //先将时间戳转为Date对象，然后才能使用Date的方法
        var year = time.getFullYear(),
          month = time.getMonth() + 1 ,  //月份是从0开始的
          day = time.getDate(),
          hour = time.getHours(),
          minute = time.getMinutes(),
          second = time.getSeconds()
        //add0()方法在后面定义
        return  year+'-'+ add0(month)+'-'+ add0(day)+' '+ add0(hour)+':'+ add0(minute)+':'+ add0(second)
      }
      return dateFormat(row.createTime)
    },
    statusFormat(row:any){
      for (let sta of this.status){
        if (sta.value == row.status){
          return sta.label
        }
      }
    },

    initPageParams(){
      this.getProjectList(this.envSelect)
    },
    getProjectList(params: String){
      // 获取项目数据并填充
      console.log(params)
      var body = {
        "env": params
      }
      this.projectList = []
      apiBuried.getTestBuriedProjList(body).then(res =>{
        var respdata = res.data.data

        for (let item of respdata){
          // temp = {"value": item.name, "label": item.apiKey}
          this.projectList.push({"value": item.id, "label": item.name, "apiKey": item.apiKey, "platform": item.platform})
          // console.log({"value": item.apiKey, "label": item.name})
        }

      })

    },
    getPageEventListValue(){
      let params = this.$refs.headerTable.projValueSelect
      console.log('getPageEventListValue', params)
      this.getEventListValue([this.envSelect, this.$refs.headerTable.statusValueSelect,
        this.startVersionSelect, this.endVersionSelect])
    },
    // getEventListValue([env,status,start, end, search_text]){
    getEventListValue(msg: any){
      const env = msg[0];
      const status = msg[1];
      const start = msg[2];
      const end = msg[3];
      const search_text = msg[4];

      // getEventListValue(status: Array, start: String, end: String, uid: String){
      //   console.log("getEventListValue-func()")

      var tagfilters = {"status": status, "filter": null, "start_version": null, "end_version": null,
        "version": {"start_version": null, "end_version": null}
      }
      if (search_text){
        tagfilters['filter'] = search_text
      }
      if (start.length > 0){
        tagfilters['start_version'] = start
        tagfilters['version']['start_version'] = start

      }
      if (end.toString().length > 0){
        tagfilters['end_version'] = end
        tagfilters['version']['end_version'] = end
        // if (tagfilters['version']){
        //   tagfilters['version']['end_version'] = end
        // }else{
        //   tagfilters['version'] = {'end_version': end}
        // }
      }

      var sendparams = {
        "page_size": this.pageSize,
        "project_id": this.mappingProjDevProd(this.projDefaultSelect),
        "filter": null,
        "current_page": this.currentPage,
        "tag_filter": tagfilters,
        "env": env,
        // "uid": uid
      }
      apiBuried.getTestBuriedEventList(sendparams).then(res => {
        this.tableData = res.data.data.list
        this.total = res.data.data.totalCounts
        console.log("this.projDefaultSelect", this.projDefaultSelect)
      })

    },
    mappingProjDevProd(project_id: number){
      //  把项目的ID映射到线上的项目ID用来查询事件
      const split_str = '^_^';
      console.log(project_id, split_str)
      for (let item of this.projectList){
        if (project_id == item['value']){
          let platform_split = item['label'].split(split_str)[0]
          for (let plat of this.projectList){
            if (platform_split == plat['label']){
              console.log("映射后的项目ID",plat['value'], plat['platform'])
              return plat['value']
            }
          }
        }
        console.log(item, 'Web^_^dev'.split(split_str), 'Web'.split(split_str))

      }
    },
    updateSelectProjValue(params: any){
      // var tempprojDefaultSelect = params
      this.projDefaultSelect = params.toString()
      console.log('updateSelectProjValue', params, this.projDefaultSelect)
      this.getEnumVersionList()
      this.getEventListValue([this.envSelect, this.$refs.headerTable.statusValueSelect,
        this.startVersionSelect, this.endVersionSelect])
    },
    getEnumVersionList(){
      // 请求起始版本和结束版本数据//默认查询项目下的所有事件
      var enumParams = {
        env: this.envSelect,
        project_id: this.mappingProjDevProd(this.projDefaultSelect),
        columns: ["startVersion","endVersion","status"]
      }
      // console.log('enumParams', enumParams)
      this.startVersion = []
      this.endVersion = []
      this.$refs.headerTable.startValueSelect = ''
      this.$refs.headerTable.endValueSelect = ''
      apiBuried.getTestBuriedEnumList(enumParams).then(res => {
        let endVersionEnum = []
        let startVersionEnum = []
        let resp_data = res.data.data

        if (Object.prototype.hasOwnProperty.call(resp_data, 'endVersion')){
          endVersionEnum = resp_data.endVersion
        }
        if (Object.prototype.hasOwnProperty.call(resp_data, 'startVersion')){
          startVersionEnum = resp_data.startVersion
        }

        for (let enums of endVersionEnum){
          this.endVersion.push({"value": enums, "label": enums})
        }
        for (let enums of startVersionEnum){
          this.startVersion.push({"value": enums, "label": enums})
        }
      })

    },
    getSelectProjApiKey(){
      console.log('getSelectProjId', this.projDefaultSelect,)
      for (let env of this.projectList){

        if (env.value == this.projDefaultSelect){
          return env.apiKey
        }
      }
    },
    operateEvent(){
      this.checkEvent(
        [this.$refs.headerTable.envValueSelect,
          this.getSelectProjApiKey(this.$refs.headerTable.projValueSelect),
          // this.$refs.headerTable.getSelectProjname(this.$refs.headerTable.projValueSelect),
          this.inputText]
      )
    },
    filterTag(value:any, row:any) {
      return row.eventProperResult === value;
    },

    // tableRowClassName(row:any) {
    //   if (row.eventProperResult == 'false' || row.result == 'false' || row.id=='false') {
    //     return 'warning-row';
    //   }
    //   return '';
    // }
  }
}
</script>

<style lang="css">
.el-tooltip__popper{
  max-width:800px
}
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

