import instance from "@/api/index";

const apolloUrlPrefix = '/v1/dataTool/apollo/config'
const apolloIntlUrlPrefix = '/v1/dataTool/apolloIntl/config'
const apolloNotifyPrefix = '/v1/dataTool/apollo/notify'
const apolloIntlNotifyPrefix = '/v1/dataTool/apolloIntl/notify'
const userToolUrlPrefix = '/v1/dataTool/userConfig'
const spuToolUrlPrefix = '/v1/dataTool/spuConfig'
const orderToolUrlPrefix = '/v1/dataTool/orderConfig'
const lessonToolUrlPrefix = '/v1/dataTool/lessonConfig'

export default {
  // 阿波罗配置接口
  getApolloApps(params) {
    return instance({
      method: 'get',
      url: `${apolloUrlPrefix}/apps`,
      params: params
    })
  },
  // 获取阿波罗应用的配置项
  getApolloAppItems(appId) {
    return instance({
      method: 'get',
      url: `${apolloUrlPrefix}/app/${appId}/items`,
    })
  },
  // 编辑阿波罗配置
  updateApolloAppItem(params, appId) {
    return instance({
      method: 'put',
      url: `${apolloUrlPrefix}/app/${appId}/item/update`,
      data: params
    })
  },
  //发布阿波罗配置
  releaseApolloAppItem(params, appId) {
    return instance({
      method: 'post',
      url: `${apolloUrlPrefix}/app/${appId}/item/release`,
      data: params
    })
  },
  // 新建阿波罗群聊通知配置
  createApolloAppChat(params) {
    return instance({
      method: 'post',
      url: `${apolloNotifyPrefix}`,
      data: params
    })
  },
  // 更新阿波罗群聊通知
  updateApolloAppChat(params, id) {
    return instance({
      method: 'put',
      url: `${apolloNotifyPrefix}/${id}`,
      data: params
    })
  },
  // 删除阿波罗群聊通知
  deleteApolloAppChat(id) {
    return instance({
      method: 'delete',
      url: `${apolloNotifyPrefix}/${id}`,
    })
  },
  // 获取阿波罗群聊通知
  getApolloAppChat(params) {
    return instance({
      method: 'get',
      url: `${apolloNotifyPrefix}`,
      params: params
    })
  },
  // 阿波罗配置接口
  getApolloIntlApps(params) {
    return instance({
      method: 'get',
      url: `${apolloIntlUrlPrefix}/apps`,
      params: params
    })
  },
  // 获取阿波罗应用的配置项
  getApolloIntlAppItems(appId) {
    return instance({
      method: 'get',
      url: `${apolloIntlUrlPrefix}/app/${appId}/items`,
    })
  },
  // 编辑阿波罗配置
  updateApolloIntlAppItem(params, appId) {
    return instance({
      method: 'put',
      url: `${apolloIntlUrlPrefix}/app/${appId}/item/update`,
      data: params
    })
  },
  //发布阿波罗配置
  releaseApolloIntlAppItem(params, appId) {
    return instance({
      method: 'post',
      url: `${apolloIntlUrlPrefix}/app/${appId}/item/release`,
      data: params
    })
  },
  // 新建阿波罗群聊通知配置
  createApolloIntlAppChat(params) {
    return instance({
      method: 'post',
      url: `${apolloIntlNotifyPrefix}`,
      data: params
    })
  },
  // 更新阿波罗群聊通知
  updateApolloIntlAppChat(params, id) {
    return instance({
      method: 'put',
      url: `${apolloIntlNotifyPrefix}/${id}`,
      data: params
    })
  },
  // 删除阿波罗群聊通知
  deleteApolloIntlAppChat(id) {
    return instance({
      method: 'delete',
      url: `${apolloIntlNotifyPrefix}/${id}`,
    })
  },
  // 获取阿波罗群聊通知
  getApolloIntlAppChat(params) {
    return instance({
      method: 'get',
      url: `${apolloIntlNotifyPrefix}`,
      params: params
    })
  },

  // 查询spu下的所有sp2xuids信息
  getSpuDetailData(params) {
    return instance({
      method: 'post',
      url: `${spuToolUrlPrefix}/spu/detail`,
      data: params
    })
  },
  // 创建各渠道的9.9订单
  createSampleOrder(params) {
    return instance({
      method: 'post',
      url: `${orderToolUrlPrefix}/sample/order`,
      data: params
    })
  },
  // 课程完课
  lessonProgress(params) {
    return instance({
      method: 'post',
      url: `${lessonToolUrlPrefix}/lesson_progress`,
      data: params
    })
  },
  // 一键查询用户拥有课程
  getUserClass(params) {
    return instance({
      method: 'post',
      url: `${userToolUrlPrefix}/class`,
      data: params
    })
  },
  // 创建转推关系
  xshareRelationshipData(params) {
    return instance({
      method: 'post',
      url: `${userToolUrlPrefix}/xshare/relationship`,
      data: params
    })
  },
  //生成课程/账号/数据类型用户
  createAccountTypeUser(params) {
    return instance({
      method: 'post',
      url: `${userToolUrlPrefix}/create/sample/user`,
      data: params
    })
  },
  // 一键删除用户拥有的课程
  deleteUserAllClass(params) {
    return instance({
      method: 'post',
      url: `${userToolUrlPrefix}/delete/class`,
      data: params
    })
  },
  // 修改推广人状态
  updatePromoterState(params) {
    return instance({
      method: 'post',
      url: `${userToolUrlPrefix}/promoter/state`,
      data: params
    })
  },
  // 一键强制退款
  orderRefund(params) {
    return instance({
      method: 'post',
      url: `${userToolUrlPrefix}/refund`,
      data: params
    })
  },
  // 开关审核模式
  updateGlobal(params) {
    return instance({
      method: 'post',
      url: `${userToolUrlPrefix}/handle/update_global_ios_ver`,
      data: params
    })
  },
  // 重置打卡天数
  resetUserCheckinDays(params) {
    return instance({
      method: 'post',
      url: `${userToolUrlPrefix}/handle/reset_user_checkin_days`,
      data: params
    })
  },
  // 一键拼团
  createInviterOrder(params) {
    return instance({
      method: 'post',
      url: `${userToolUrlPrefix}/create/inviter_order`,
      data: params
    })
  },
  // 一键注销用户
  deleteAccount(params) {
    return instance({
      method: 'delete',
      url: `${userToolUrlPrefix}/handle/delete_user`,
      data: params
    })
  },
  // 删除用户体验课
  deleteUserSampleClass(params) {
    return instance({
      method: 'delete',
      url: `${userToolUrlPrefix}/handle/delete_user_order`,
      data: params
    })
  },
}
