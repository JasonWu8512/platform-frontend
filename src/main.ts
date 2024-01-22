// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from '@/App.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
// @ts-ignore
import ElementUI from 'element-ui'
// @ts-ignore
// import iView from 'iview';
import 'lodash'
// @ts-ignore
import VeBar from 'v-charts/lib/bar.common'
// @ts-ignore
import VeLine from 'v-charts/lib/line.common'
// @ts-ignore
import Vue from 'vue'
// @ts-ignore
import EventBus from 'vue-breif-event-bus'
// import ant from 'ant-design-vue'
// import G2 from '@antv/g2'
// @ts-ignore
import ECharts from 'vue-echarts'
import 'zrender/lib/svg/svg'
import router from './router'
import store from './store'

import JsonViewer from 'vue-json-viewer'

// import IconFont from '@/components/IconFont.vue'
import '@/assets/iconfont/iconfont'
// @ts-ignore
// import {Progress, Steps, Table, Tag, Timeline} from 'ant-design-vue'
import './assets/css/common.scss'
// Vue.http.options.emulateJSON = true
// // //css
import './assets/css/font.css'
import './assets/iconcss/iconfont.css'


// =======antd========
// import 'ant-design-vue/lib/pagination/style/index.less'
// import 'ant-design-vue/lib/progress/style/index.less'
// import 'ant-design-vue/lib/spin/style/index.less'
// import 'ant-design-vue/lib/steps/style/index.less'
// import 'ant-design-vue/lib/style/core/iconfont.less';
// import 'ant-design-vue/lib/style/core/motion.less';
// import 'ant-design-vue/lib/style/mixins/index.less';
// import 'ant-design-vue/lib/table/style/index.less'
// import 'ant-design-vue/lib/tag/style/index.less'
// import 'ant-design-vue/lib/timeline/style/index.less'
import {PathName} from "@/constant/routeData";
import 'element-ui/lib/theme-chalk/index.css'
// import 'iview/dist/styles/iview.css';
// @ts-ignore
import histogram from 'v-charts/lib/histogram.common'
// import axios from './utils/axiosConfig'
// import VueClipboard from 'vue-clipboard2'
// @ts-ignore
import pie from 'v-charts/lib/pie.common'
// @ts-ignore
import ring from 'v-charts/lib/ring.common'
// @ts-ignore
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import './assets/icon/iconfont.css'
// import './assets/styles/entirety.css'
import base from './utils/base'

// Vue.component('icon-font', IconFont)
// Vue.use(Steps)
// Vue.use(Timeline)
// Vue.use(Table)
// Vue.use(Tag)
// Vue.use(Progress)

Vue.use(JsonViewer)

Vue.config.productionTip = false


// import api from './utils/api'


// app.all('*',function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//
//   if (req.method == 'OPTIONS') {
//     res.send(200); /让options请求快速返回/
//   }
//   else {
//     next();
//   }
// });

Vue.config.productionTip = false;

// Vue.prototype.$api = api;
// Vue.prototype.$axios = axios;
Vue.component('chart', ECharts)
Vue.component(pie.name, pie);
Vue.component(histogram.name, histogram);
Vue.component(ring.name, ring);
// Vue.component('codemirror', VueCodeMirror.codemirror);
// Vue.component('codemirror', codemirror);

// Vue.use(VueCodeMirror)
Vue.use(contentmenu);
// Vue.use(VueResource);
// Vue.use(VueClipboard);
// ================
Vue.use(base);
Vue.use(ElementUI, {size: 'mini'})
// Vue.use(iView)
Vue.use(EventBus)
// Vue.use(ant)
// Vue.use(G2)
Vue.component(VeLine.name, VeLine)
Vue.component(VeBar.name, VeBar)

// Vue.use(VuePhoenix)
//回到顶部
router.beforeEach(async (to, _from, next) => {
  store.commit('FLASH_TOKEN')
  // 公用vuex数据
  const socketInfo = Object.assign(
    {},
    // @ts-ignore
    store.state.jira.socketInfo,
    // @ts-ignore
    store.state.users.socketInfo,
    // @ts-ignore
    store.state.coverage.socketInfo,
  )
  try {
    // 异步任务列表
    const task = []
    /**
     * 检查前去的页面需要的公用数据是否加载
     */
    // @ts-ignore
    if (to.meta.isUsingSocketInfo && !socketInfo.projectsUpdate) {
      task.push(store.dispatch('GET_PROJECT'))
    }
    // @ts-ignore
    if (to.meta.isUsingSocketInfo && !socketInfo.usersUpdate) {
      task.push(store.dispatch('GET_USER'))
    }
    // @ts-ignore
    if (to.meta.isUsingSocketInfo && !socketInfo.projectsSprintUpdate) {
      task.push(store.dispatch('GET_PROJECT_CLOSED_SPRINT'))
    }
    // @ts-ignore
    if (to.meta.isUsingSocketInfo && !socketInfo.gitprojectUpdate) {
      task.push(store.dispatch('GET_GITPROJECT'))
    }
    // @ts-ignore
    if (to.meta.isUsingSocketInfo && !socketInfo.larkChatsUpdate) {
      task.push(store.dispatch('GET_LARKCHATS'))
    }

    // 异步同时执行请求任务
    await Promise.all(task)
  } catch (error) {
    ElementUI.Message.error(error)
    next(false)
  }
  /**
   * 参考：https://juejin.cn/post/6844904166758809608
   */

  // 用户信息检测
  console.log("检测登录状态", store.getters.isLogin)
  // if (store.getters.isLogin || to.fullPath === '/login' || to.name === PathName.TestTrackCasePlanReport) {
    if (store.getters.isLogin || to.name === PathName.Login ||to.name === PathName.SslLogin || to.name === PathName.TestTrackCasePlanReport) {
    document.body.scrollTop = 0;
    next()
      // next('/ssoLogin')
  } else {
      next('/ssoLogin')
    // next('/login')
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>',
  render: h => h(App)
})

let EventBusManager = Vue.prototype.$eventBus.noConflict()
Vue.mixin({
  computed: {
    $eventBus() {
      return EventBusManager(this)
    }
  }
})
