<template>
  <el-container>
    <el-header>
      <div>
        <el-row class="table-title">
          <slot name="title">{{ title }}</slot>
        </el-row>
        <el-row>
          <div class="operate-button">

            <!--        操作环境-->
            <span>
          <el-select v-model="envValueSelect" filterable placeholder="请选择环境" @change="changeSelectEnv">
            <el-option
              v-for="item in envList"

              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>

            <!--        项目选择下拉框-->
            <span>
          <el-select v-model="projValueSelect" filterable placeholder="请选择项目" @change="changeProj">
            <el-option
              v-for="item in projectList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>

            <!--状态-->
            <span>
            <el-select
              v-model="statusValueSelect"
              multiple
              collapse-tags
              style="margin-left: 20px;"
              placeholder="请选择事件状态">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </span>


            <!--        版本数据-->
            <span>
          <el-select v-model="startValueSelect" filterable clearable placeholder="请选择事件起始版本">
            <el-option
              v-for="item in startVersion"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
            <span>
          <el-select v-model="endValueSelect" filterable clearable placeholder="请选择事件结束版本">
            <el-option
              v-for="item in endVersion"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
            <span>
              <el-input
                placeholder="请输入ID或名称查询"
                size="mini"
                v-model="searchValueText"
                clearable>
          </el-input>
            </span>


            <!--        <span class="operate-button">-->
            <!--          <el-button v-if="showCreate" :icon="iconCreate" size="mini" @click="create">-->
            <!--            {{ createTip }}-->
            <!--          </el-button>-->
            <!--          <el-button v-if="showRun" :icon="iconRun" size="mini" @click="runTest">-->
            <!--          {{ runTip }}-->
            <!--          </el-button>-->
            <!--          <el-button v-if="showThird" :icon="iconThird" size="mini" @click="thirdClick">-->
            <!--            {{ thirdTip }}-->
            <!--          </el-button>-->
            <!--          <slot name="button"/>-->
            <!--        </span>-->

            <el-button plain @click="selectEvent($event)">查询事件</el-button>


          </div>
        </el-row>


      </div>

    </el-header>

  </el-container>
</template>

<script lang="ts">
// import EventSelect from "@/pages/track/buried/components/EventSelect"

export default {
  name: "TableHeader",

  components: {},
  data() {
    return {

      projValueSelect: this.projDefaultSelect,
      envValueSelect: this.envSelect,
      statusValueSelect: this.statusSelect,
      startValueSelect: this.startVersionSelect,
      endValueSelect: this.endVersionSelect,
      inputValueText: this.inputText,
      searchValueText: this.search_text,
    }
  },

  props: {
    envList: Array,
    envSelect: String,

    projDefaultSelect: String,
    projectList: Array,

    statusSelect: String,
    status: Array,

    startVersionSelect: String,
    startVersion: Array,

    endVersionSelect: String,
    endVersion: Array,

    getProjectList: {
      type: Function,
      default: null
    },
    getEnumVersionList: {
      type: Function,
      default: null
    },


    checkEvent: {
      type: Function,
      default: null
    },

    title: String,

    showSearch: {
      type: Boolean,
      default: true
    },
    inputText: String,
    search_text: String,
    // isTesterPermission: {
    //   type: Boolean,
    //   default: false
    // },
    placeholder: {
      String,
      default: ''
    },
    condition: Object,

  },
  methods: {
    // getSelectProjApiKey(){
    //   console.log('getSelectProjId', this.projDefaultSelect,)
    //   for (let env of this.projectList){
    //
    //     if (env.value == this.projDefaultSelect){
    //       return env.apiKey
    //     }
    //   }
    // },

    getSelectProjname(){
      for (let env of this.projectList){
        if (env.value == this.projDefaultSelect){
          return env.label
        }
      }
    },

    changeSelectEnv(env: Object) {
      console.log(env)
      this.getProjectList(env)
    },
    changeProj(proj: String) {
      // this.getEnumVersionList()
      // this.getEventList(proj, this.envSelect, [])
      this.$emit('updateSelectProjValue', proj)
      // this.getEnumVersionList()
    },
    selectEvent(){
      // console.log('selectEvent-func()', this.startValueSelect, this.inputValueText, typeof(this.startValueSelect))

      this.$emit('getEventListValue',
        [this.envValueSelect,
          this.statusValueSelect,
          this.startValueSelect,
          this.endValueSelect, this.searchValueText]
      )
      // this.getEventListValue()
      // console.log('this.getSelectProjId(this.valueSelect)', this.projDefaultSelect)
    },

    // operateEvent(){
    //   this.$emit('checkEvent',
    //     this.envValueSelect, this.getSelectProjApiKey(this.projValueSelect), this.inputValueText)
    // }


  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/display";
@import "src/assets/css/font";

.table-title {
  @extend %font-title;
  @extend %flex-left-top-row;
}

.operate-button {
  @extend %flex-between-center-row;
}

</style>
