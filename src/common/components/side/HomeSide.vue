<template>
  <el-aside id="aside" :width="asideWidth">
    <el-menu
      :class="menuClass"
      :collapse="asideHidden"
      :default-active="$route.name"
      router
      @select="handleChangeRouter"
    >
      <template v-for="(parentItem, index) of sideMenu">
        <!--   有子目录   -->
        <el-submenu v-if="parentItem.sub_menu" :key="index" :index="parentItem.route.name" :hidden="parentItem.hidden">
          <template slot="title">
            <i v-if="parentItem.icon" :class="parentItem.icon"/>
            <img v-else :src="parentItem.img" alt="" style="margin: 0 5px"/>
            <span slot="title">{{ parentItem.text }}</span>
          </template>
          <el-menu-item
            v-for="(item, childIndex) in parentItem.sub_menu"
            :key="childIndex"
            :index="`${item.route.name}`"
            :route="item.route"
            :hidden="item.hidden"
          >
            <i :class="item.icon"/>
            <span slot="title">{{ item.text }}</span>
          </el-menu-item>
        </el-submenu>
        <!--   没有子目录   -->
        <el-menu-item
          v-else
          :key="index"
          :index="`${parentItem.route.name}`"
          :route="parentItem.route"
          :hidden="parentItem.hidden"
        >
          <i v-if="parentItem.icon" :class="parentItem.icon"/>
          <img v-else :src="parentItem.img" alt="" style="margin: 0 5px"/>
          <span slot="title">{{ parentItem.text }}</span>
        </el-menu-item>
      </template>
    </el-menu>
    <div class="pop" @click="asideHidden = !asideHidden"/>
  </el-aside>
</template>

<script lang="ts">
import variables from '@/assets/css/utils.scss'
import {PathName} from "@/constant/routeData"
import {menuPermissionEnum} from "@/constant/User";

export default {
  name: 'HomeSide',
  components: {},
  data() {
    return {
      asideHidden: false,
      sideMenu: [
        {
          text: '首页',
          route: {name: PathName.Dashboard},
          icon: 'el-icon-s-home'
        },
        {
          text: '效能大盘',
          icon: 'el-icon-user',
          route: {name: PathName.UserGantt},
          sub_menu: [
            {text: '冲刺总览', route: {name: PathName.SprintOverView}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.SprintOverView) < 0,},
            {text: '冲刺详情', route: {name: PathName.SprintDetail}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.SprintDetail) < 0,},
            {text: '项目报告', route: {name: PathName.EfficiencyData}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ProjectReport) < 0,},
            {text: '资源地图', route: {name: PathName.UserGantt}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.GanttResource) < 0,},
            {text: '月度资源报告', route: {name: PathName.MonthResourceReport}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.MonthResourceReport) < 0,},
            {text: '月度质量报告', route: {name: PathName.MonthReport}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.MonthQualityReport) < 0,},
            {text: '项目趋势报告', route: {name: PathName.ProjectTolerance}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ProjectTrendReport) < 0,}
          ]
        },
        {
          text: '测试跟踪',
          icon: 'el-icon-coin',
          route: {name: PathName.TestTrack}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrack) < 0,
          sub_menu: [
            // {text: '项目', route: {name: PathName.TestTrackProject}},
            {text: '测试用例',route:{name: PathName.TestTrackTestcaseProject}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrackCase) < 0,},
            {text: '用例评审', route: {name: PathName.TestTrackCaseReview}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrackReview) < 0,},
            {text: '冒烟计划', route: {name: PathName.TestTrackCasePlan}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrackSmoke) < 0,},
            {text: '功能计划', route: {name: PathName.TestTrackNotSmokePlan}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrackFunc) < 0,},
            {text: '数据埋点', route: {name: PathName.TestTrackBuriedDataReview}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrackBuriedDataOperate) < 0,},
            {text: '个人画像', route: {name: PathName.TestTrackProfileReview}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrackBuriedProfileOperate) < 0,},
          ]
        },
        {
          text: '自动化',
          icon: 'el-icon-thumb',
          route: {name: PathName.AutoConfig},
          hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.AutoTest) < 0,
          sub_menu: [
            {text: '用例配置', route: {name: PathName.AutoConfig}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.AutoTestConfig) < 0,},
            {text: '构建历史', route: {name: PathName.AutoCaseBuildRecord}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.AutoTestHistory) < 0,},
          ]
        },
        {
          text: 'fat发版',
          icon: 'el-icon-tickets',
          route: {name: PathName.Pipeline},
          hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCd) < 0,
          sub_menu: [
            {text: '流水线', route: {name: PathName.Pipeline}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdPipeline) < 0,},
            {text: '全量覆盖率', route: {name: PathName.PipelineFullCoverageTrend}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdFullCoverageTrend) < 0},
            {text: '分支管理', route: {name: PathName.GitLabProjects}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdBranch) < 0,},
            {text: '服务构建历史', route: {name: PathName.PipelineServerBuildRecord}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdDeployRecord) < 0,},
            {text: '覆盖率构建历史', route: {name: PathName.PipelineBuildRecord}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdCoverageRecord) < 0,},
            {text: 'sonar扫描情况', route: {name: PathName.FullSonar}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdCoverageRecord) < 0,},
          ]
        },
        {
          text: '数据工厂',
          icon: 'el-icon-s-data',
          route: {name: PathName.Apollo},
          hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.DataTool) < 0,
          sub_menu: [
            {text: 'fat-apollo', route: {name: PathName.Apollo}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Apollo) < 0,},
            {text: 'fat-apolloIntl', route: {name: PathName.ApolloIntl}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ApolloIntl) < 0,},
            {text: '用户配置', route: {name: PathName.UserConfig}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Apollo) < 0,},
            {text: '商品配置', route: {name: PathName.SpuConfig}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Apollo) < 0,},
            {text: '订单配置', route: {name: PathName.OrderConfig}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Apollo) < 0,},
            {text: '课程配置', route: {name: PathName.LessonConfig}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Apollo) < 0,},
          ]
        },
        {
          text: '测试工具',
          icon: 'el-icon-s-tools',
          route: {name: PathName.TestTool}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Tool) < 0,
          sub_menu: [
            {text: '辅助工具', route: {name: PathName.TestTool}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ToolMock) < 0,},
            {text: 'flower', route: {name: PathName.Flower}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ToolFlower) < 0,},
            {text: 'PR合并通知', route: {name: PathName.PrMerged}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ToolPrMerge) < 0,},
            {text: 'jira联动PR配置', route: {name: PathName.PrMergeJira}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ToolJiraPrConfig) < 0,},
            {text: '审批流通知配置', route: {name: PathName.ApprovalNotify}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ToolApprovalNotify) < 0,},
            {text: 'apollo通知配置-国内', route: {name: PathName.ApolloNotify}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Tool) < 0,},
            {text: 'apollo通知配置-出海', route: {name: PathName.ApolloIntlNotify}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Tool) < 0,},
          ]
        },
      ]
    }
  },
  computed: {
    asideWidth() {
      return this.asideHidden ? variables['asideCollapseWidth'] : variables['asideWidth']
    },
    menuClass() {
      return this.asideHidden ? 'menu-collapse-container' : 'menu-container'
    },
  },
  watch: {
    asideHidden() {
      this.$store.commit('SET_ASIDE_WIDTH', this.asideWidth)
    },
    '$store.getters.userPers'() {
      this.sideMenu = [
        {
          text: '首页',
          route: {name: PathName.Dashboard},
          icon: 'el-icon-s-home'
        },
        {
          text: '效能大盘',
          icon: 'el-icon-user',
          route: {name: PathName.UserGantt},
          sub_menu: [
            {text: '冲刺总览', route: {name: PathName.SprintOverView}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.SprintOverView) < 0,},
            {text: '冲刺详情', route: {name: PathName.SprintDetail}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.SprintDetail) < 0,},
            {text: '项目报告', route: {name: PathName.EfficiencyData}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ProjectReport) < 0,},
            {text: '资源地图', route: {name: PathName.UserGantt}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.GanttResource) < 0,},
            {text: '月度资源报告', route: {name: PathName.MonthResourceReport}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.MonthResourceReport) < 0,},
            {text: '月度质量报告', route: {name: PathName.MonthReport}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.MonthQualityReport) < 0,},
            {text: '项目趋势报告', route: {name: PathName.ProjectTolerance}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ProjectTrendReport) < 0,}
          ]
        },
        {
          text: '测试跟踪',
          icon: 'el-icon-coin',
          route: {name: PathName.TestTrack}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrack) < 0,
          sub_menu: [
            // {text: '项目', route: {name: PathName.TestTrackProject}},
            {text: '测试用例',route:{name: PathName.TestTrackTestcaseProject}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrackCase) < 0,},
            {text: '用例评审', route: {name: PathName.TestTrackCaseReview}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrackReview) < 0,},
            {text: '冒烟计划', route: {name: PathName.TestTrackCasePlan}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrackSmoke) < 0,},
            {text: '功能计划', route: {name: PathName.TestTrackNotSmokePlan}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.TestTrackFunc) < 0,},
          ]
        },
        {
          text: '自动化',
          icon: 'el-icon-thumb',
          route: {name: PathName.AutoConfig},
          hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.AutoTest) < 0,
          sub_menu: [
            {text: '用例配置', route: {name: PathName.AutoConfig}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.AutoTestConfig) < 0,},
            {text: '构建历史', route: {name: PathName.AutoCaseBuildRecord}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.AutoTestHistory) < 0,},
          ]
        },

        {
          text: 'fat发版',
          icon: 'el-icon-tickets',
          route: {name: PathName.Pipeline},
          hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCd) < 0,
          sub_menu: [
            {text: '流水线', route: {name: PathName.Pipeline}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdPipeline) < 0,},
            {text: '全量覆盖率', route: {name: PathName.PipelineFullCoverageTrend}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdFullCoverageTrend) < 0},
            {text: '分支管理', route: {name: PathName.GitLabProjects}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdBranch) < 0,},
            {text: '服务构建历史', route: {name: PathName.PipelineServerBuildRecord}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdDeployRecord) < 0,},
            {text: '覆盖率构建历史', route: {name: PathName.PipelineBuildRecord}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdCoverageRecord) < 0,},
            {text: 'sonar扫描情况', route: {name: PathName.FullSonar}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.FatCdCoverageRecord) < 0,},
          ]
        },
        {
          text: '数据工厂',
          icon: 'el-icon-s-data',
          route: {name: PathName.Apollo},
          hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.DataTool) < 0,
          sub_menu: [
            {text: 'fat-apollo', route: {name: PathName.Apollo}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Apollo) < 0,},
            {text: 'fat-apolloIntl', route: {name: PathName.ApolloIntl}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ApolloIntl) < 0,},
            {text: '用户配置', route: {name: PathName.UserConfig}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Apollo) < 0,},
            {text: '商品配置', route: {name: PathName.SpuConfig}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Apollo) < 0,},
            {text: '订单配置', route: {name: PathName.OrderConfig}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Apollo) < 0,},
            {text: '课程配置', route: {name: PathName.LessonConfig}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Apollo) < 0,},
          ]
        },
        {
          text: '测试工具',
          icon: 'el-icon-s-tools',
          route: {name: PathName.TestTool}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Tool) < 0,
          sub_menu: [
            {text: '辅助工具', route: {name: PathName.TestTool}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ToolMock) < 0,},
            {text: 'flower', route: {name: PathName.Flower}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ToolFlower) < 0,},
            {text: 'PR合并通知', route: {name: PathName.PrMerged}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ToolPrMerge) < 0,},
            {text: 'jira联动PR配置', route: {name: PathName.PrMergeJira}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ToolJiraPrConfig) < 0,},
            {text: '审批流通知配置', route: {name: PathName.ApprovalNotify}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.ToolApprovalNotify) < 0,},
            {text: 'apollo通知配置-国内', route: {name: PathName.ApolloNotify}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Tool) < 0,},
            {text: 'apollo通知配置-出海', route: {name: PathName.ApolloIntlNotify}, hidden: this.$store.getters.userPers.indexOf(menuPermissionEnum.Tool) < 0,},
          ]
        },
      ]
    }
  },
  created() {
    // 初始化asideHidden
    this.asideHidden = false
  },
  methods: {
    handleChangeRouter(url: PathName) {
      this.$router.push({name: url})
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/utils";

$border: 1px;

.el-aside {
  border: $border solid #E6E6E6;
  border-radius: 2px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.el-menu {
  text-align: left;
}

.menu-container {
  width: $aside-width - $border;
  background-color: #fff;

  .el-menu-item {
    min-width: auto;
    padding-right: 0;
  }
}

.menu-collapse-container {
  @extend .menu-container;
  width: $aside-collapse-width - $border;
}

.pop {
  height: 100%;
}

</style>
