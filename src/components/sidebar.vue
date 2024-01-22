<template>
  <div :style="{'height':winHeight+'px'}">
    <el-aside
        :style="{'margin-left': !asideHidden ? 0 : '-' + width}"
        :width="width"
        class="ms-aside-container"
    >
      <div v-for="(item, index) of sidebar" :key="index">
        <el-menu
            :default-active="$route.path"
            class="setting"
            router
        >
          <el-menu-item
              v-if="!item.hasChild"
              :key="item.index"
              :index="item.index"
              :route="item.route"
              :hidden="item.hidden">
            <template slot="title">
              <i class="el-icon-s-home"/>
              <span>首页</span>
            </template>
          </el-menu-item>
          <el-submenu
              v-if="item.hasChild"
              :key="item.index"
              :index="item.index"
              :route="item.route"
              :hidden="item.hidden">
            <template slot="title">
              <i :class="item.icon"/>
              <span>{{ item.text }}</span>
            </template>
            <el-menu-item
                v-for="(child, childIndex) in item.child"
                v-show="child"
                :key="childIndex"
                :index="child.index"
                :hidden="item.hidden"
                :route="child.route" class="setting-item"
            >
              <span slot="title">{{ child.text }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div v-if="enableAsideHidden" :style="{'left': asideHidden ? 0 : width}" class="hiddenBottom"
           @click="asideHidden = !asideHidden">
        <i v-if="!asideHidden" class="el-icon-arrow-left"/>
        <i v-if="asideHidden" class="el-icon-arrow-right"/>
      </div>
    </el-aside>


  </div>
</template>
<style>

.el-submenu__title {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Arial, sans-serif;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 300px;
  min-height: 400px;
  text-align: left;
  /*padding: 0px 20px;*/
}
</style>
<style scoped>
/*.el-submenu__title:hover {*/
/*  background-color: #ecf5ff !important;*/
/*  color: #409eff;*/

/*}*/
/*.el-menu-item:hover {*/
/*  background-color: #ecf5ff !important;*/
/*}*/
/*.el-menu-item.is-active {*/
/*  background-color: #ecf5ff !important;*/
/*}*/
.ms-aside-container {
  border: 1px solid #E6E6E6;
  padding: 20px;
  border-radius: 2px;
  box-sizing: border-box;
  background-color: #FFF;
  height: calc(100vh - 50px);
}

.setting {
  text-align: left;
  border-right: 0;
}

.setting .setting-item {
  height: 50px;
  line-height: 50px;
}

.hiddenBottom {
  width: 8px;
  height: 50px;
  top: calc((100vh - 80px) / 3);
  line-height: 50px;
  border-radius: 0 15px 15px 0;
  background-color: #acb7c1;
  display: inline-block;
  position: absolute;
  cursor: pointer;
  opacity: 0.2;
  font-size: 2px;
  margin-left: 1px;
}

.hiddenBottom i {
  margin-left: -2px;
}

.hiddenBottom:hover {
  opacity: 0.8;
  width: 12px;
}

.hiddenBottom:hover i {
  margin-left: 0;
  color: white;
}

</style>
<script>
//  需要配合sidebaritem组件一起使用，配合vue-route一起使用，在route中配置sidebar属性
import {PathName} from "@/constant/routeData.ts";

export default {
  name: 'SideBar',
  components: {},
  props: {
    width: {
      type: String,
      default: '300px'
    },
    enableAsideHidden: {
      type: Boolean,
      default: true
    },
    sidebar: {
      type: Array,
      default() {
        return  [
          {
            text: '首页',
            route: {name: PathName.Dashboard},
            icon: 'el-icon-s-home'
          },
          {
            text: '测试跟踪',
            icon: 'el-icon-coin',
            route: {name: PathName.TestTrack},
            sub_menu: [
              // {text: '项目', route: {name: PathName.TestTrackProject}},
              {text: '测试用例',route:{name: PathName.TestTrackTestcaseProject}},
              {text: '用例评审', route: {name: PathName.TestTrackCaseReview}},
              {text: '测试计划', route: {name: PathName.TestTrackCasePlan}},
              {text: '数据埋点', route: {name: PathName.TestTrackBuriedDataReview}},
              {text: '个人画像', route: {name: PathName.TestTrackProfileReview}},
            ]
          },
          {
            text: '质量数据',
            icon: 'el-icon-s-data',
            route: {name: PathName.QualityReport},
            sub_menu: [
              {text: '版本报告', route: {name: PathName.VersionReport}},
              {text: '月度报告', route: {name: PathName.MonthReport}},
              {text: '项目报告', route: {name: PathName.ProjectTolerance}, hidden: ['tengfei_lu', 'keith'].indexOf(this.$store.state.username) < 0}
            ]
          },
          {
            text: '测试工具',
            icon: 'el-icon-s-tools',
            route: {name: PathName.TestTool},
            sub_menu: [
              {text: '辅助工具', route: {name: PathName.TestTool}},
              {text: 'flower', route: {name: PathName.Flower}}
            ]
          },
        ]
      }
    },
    collapse: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      asideHidden: false,
      winHeight: window.innerHeight - 50
    }
  },
  computed: {
    // openedsOnRoutes () {
    //   return [this.$route.meta.openeds]
    // }
  },
  watch: {
    asideHidden() {
      this.$store.commit('SET_ASIDEHIDDEN', this.asideHidden)
    },
    $route: function () {    //监视$route的变化
      //设置导航菜单高亮的路径为前两段路径

      console.log(this.$route.path)
      // this.activePath = this.$route.matched[1].path;    //看你的情况而定！！！
    }
  },
  methods: {

  },
  mounted() {
    let _this = this
    window.addEventListener('resize', function () {
      _this.winHeight = window.innerHeight - 50
    }, true)
  },
  beforeDestroy() {
    window.removeEventListener('resize', function () {
    })
  }
}
</script>
