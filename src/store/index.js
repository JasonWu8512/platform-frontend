import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import login from './modules/login'
import jira from './modules/jira'
import sidebar from "./modules/sidebar";
import users from "./modules/users";
import coverage from "./modules/coverage";
// import module from './modules/module'
// import project from './modules/project'
// import admin from './modules/admin'
// import testing from './modules/testing'
// import autotest from './modules/autotest'
// import mail from './modules/mail'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state: {
    devHosts: [{'dev': 'https://dev.jiliguala.com', 'fat': 'https://fat.jiliguala.com'}],
    loading: false
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    login,
    jira,
    sidebar,
    users,
    coverage,
    // module,
    // project,
    // admin,
    // testing,
    // autotest,
    // mail
  },
  plugins: debug ? [createLogger()] : []
})
