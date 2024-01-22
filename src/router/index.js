import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import {PathName} from "@/constant/routeData";
// 总主页
import index from "@/pages";
// // 登陆页
import login from "@/pages/login";
import ssoLogin from "@/pages/login/ssoLogin";
// // 总主页 -> 修改密码
// // 总主页 -> 测试中心
import homeRouter from "@/router/homeRouter";

// jira报告及数据
import JiraRouter from "@/router/jiraRouter";
// 测试跟踪
import testTrackRouter from "@/router/testTrackRouter";
// 测试工具
import testTools from '@/router/testTools'
// 数据工厂
import dataTool from "@/router/dataTool";
// 403
import Permission from '@/pages/403/403.vue'
// 测试报告
import testReport from "@/pages/track/plan/view/comonents/report/TestReport.vue"
// 组织架构
import organizationRouter from "@/router/organizationRouter.ts";
// 覆盖率
import coverage from "@/router/coverageRouter";
// 自动化用例
import auto from "@/router/autoRouter";

const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}
Vue.use(Router)
//
//
let curRoutes = [
  // 登录
  {
    path: '/login',
    name: PathName.Login,
    component: login,
  },
  {
    path: '/ssoLogin',
    name: PathName.SslLogin,
    component: ssoLogin,
    beforeEnter(){
    window.location.replace(process.env.VUE_APP_SSO_REDIRECT)
  }
  // redirect: 'dev-sso.jiliguala.com/login?redirect=http%3A%2F%2Flocalhost%3A8080'
  },

// 403
  {
    path: '/403',
    name: 'Permission',
    component: Permission
  },
  //测试报告
  {
    path: '/testTrack/testCasePlan/:planId/report',
    name: PathName.TestTrackCasePlanReport,
    component: testReport,
    meta: {isUsingSocketInfo: true},
  },
  // 总主页
  {
    path: '/',
    name: PathName.Home,
    component: index,
    redirect: PathName.Dashboard,
    children: [
      ...homeRouter,
      // 测试跟踪
      ...testTrackRouter,
      // jira
      ...JiraRouter,
      // 测试工具
      ...testTools,
      // 数据工厂
      ...dataTool,
      // 组织架构
      ...organizationRouter,
      // 覆盖率
      ...coverage,
      // 自动化
      ...auto
    ]
  }
]
//
Vue.use(Router)
let router = new Router({
  mode: 'history',
  // 所有的路由配置
  routes: curRoutes
})
router.beforeEach(
  store.commit('FLASH_TOKEN'),
  // store.commit('ENDURING_PROJECT_INFOS') //项目信息
)
//
export default router
