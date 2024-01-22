import axios from 'axios'
import Cookies from 'js-cookie'
import axiosCancel from 'axios-cancel'
import {Message} from "element-ui"
import {camelizeKeys, decamelizeKeys} from 'humps'
import store from '@/store'
// 导入API
export {default as jiraApi} from '@/api/jira'
export {default as testCaseApi} from '@/api/testCase'
export {default as userApi} from '@/api/user'
export {default as testReviewApi} from '@/api/testReview'
export {default as testPlanApi} from '@/api/testPlan'
export {default as coverageApi} from '@/api/coverage'
export {default as autoApi} from '@/api/auto'
export {default as organizationApi} from '@/api/organization'
export {default as gitlabChatApi} from '@/api/gitlabChat'
export {default as approvalApi} from '@/api/approval'
export {default as dataToolApi} from '@/api/dataTool'
export {default as sonarApi} from '@/api/sonar'

axiosCancel(axios, {
  debug: false // default
})
let instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
})
instance.cancel = axios.cancel
/* const refresh = () => {
  const COOKIE_SUFFIX = process.env.COOKIE_SUFFIX
  const JWT_TOKEN = `JWT_TOKEN${COOKIE_SUFFIX}`
  let token = Cookies.get(JWT_TOKEN)
  let instance = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {'Content-Type': 'application/json', 'Authorization': token}
  })
  return instance({
    method: 'get',
    url: `/v1/user/renewtoken`
  }).then(res => {
    store.commit('SET_TOKEN', res.data.data.token)
  }).catch(err => {
    console.log(err)
  })
} */
// refactor: 格式化axios参数，request参数驼峰转下划线，response下划线转驼峰
// https://medium.com/javascript-in-plain-english/configuring-a-camelcase-to-snake-case-parser-with-axios-9fa34fd3b16f

instance.interceptors.request.use(
  config => {
    /* let exp = store.state.login.exp || 0
    if (exp > 0) {
      if (0 < moment.unix(exp).diff(moment().utc(), 'days',true) && moment.unix(exp).diff(moment().utc(), 'days',true) < 1 ) {
        refresh()
      }
    } */
    // config.headers['Content-Security-Policy'] = ''
    const COOKIE_SUFFIX = process.env.VUE_APP_COOKIE_SUFFIX
    const JWT_TOKEN = `JWT_TOKEN${COOKIE_SUFFIX}`
    if (Cookies.get(JWT_TOKEN)) {
      config.headers.AUTHORIZATION = Cookies.get(JWT_TOKEN)
    }
    store.state.loading = true
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      return config
    }
    if (config.data) {
      config.data = decamelizeKeys(config.data)
    }
    if (config.params) {
      config.params = decamelizeKeys(config.params)
    }
    return config
  },
  error => {
    store.state.loading = false
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    store.state.loading = false
    if (
      response.data &&
      response.headers['content-type'] === 'application/json'
    ) {
      response.data = camelizeKeys(response.data)
    }
    if (response.config.method !== 'get') {
      Message({
        message: "操作成功",
        type: "success",
        duration: 3000,
        showClose: true
      })
    }

    return response.data
  },
  error => {
    store.state.loading = false
    let status = error.response.status
    let message = error.response.data.msg || error.response.data.message ||error.response.data || '参数错误'
    if (status === 400) {
      Message({
        message: message,
        type: "warning",
        duration: 5000,
        showClose: true
      })
    } else if (status === 401) {
      Message({
        message: error.response.data.msg,
        type: "warning",
        duration: 2000,
        showClose: true
      })
      window.location.href = window.origin + '/ssoLogin'
    } else if (status === 403) {
      // window.location.href = window.origin + '/403'
      Message({
        message: '您没有权限做此操作哦',
        type: "error",
        duration: 6000,
        showClose: true
      })
    } else if (error.response.status === 404) {
      Message({
        message: "接口不存在",
        type: "warning",
        duration: 5000,
        showClose: true
      })
    } else {
      Message({
        message: error.response.data.msg || error.response.data.message || "服务器内部错误",
        type: "error",
        duration: 5000,
        showClose: true
      })
    }
    return Promise.reject(error)
  }
)

export default instance
