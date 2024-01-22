import {PathName} from '@/constant/routeData';

const UNVISIBLE_SIDE = 'UNVISIBLE_SIDE'
const SET_ASIDEHIDDEN = 'SET_ASIDEHIDDEN'
const SET_ASIDE_WIDTH = 'SET_ASIDE_WIDTH'
export default {
  state: {
    sidebarVisible: true,
    asideHidden: false,
    asideWidth: '180px',
    side_menu: [
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
          {text: '项目报告', route: {name: PathName.ProjectTolerance}}
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
  },
  getters: {
    isSideBar: state => {
      return state.sidebarVisible
    }
  },
  mutations: {
    [UNVISIBLE_SIDE](state, isvisible) {
      state.sidebarVisible = isvisible
    },
    [SET_ASIDEHIDDEN](state, isvisible) {
      state.asideHidden = isvisible
    },
    [SET_ASIDE_WIDTH](state, width) {
      state.asideWidth = width
    }
  },
  actions: {},
}
