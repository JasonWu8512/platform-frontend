import instance from "@/api/index"
import {
  RequestCreateApprovalChatConfig,
  RequestGetApprovalChatConfigList,
  RequestUpdateApprovalChatConfig
} from "@/api/types/approval"
import Qs from "qs"

export default {
  // 创建审批流通知配置
  createApprovalChatConfig(body: RequestCreateApprovalChatConfig) {
    return instance({
      method: 'post',
      url: `v1/ace/approval/notify_config`,
      data: body,
    })
  },
  // 修改配置
  updateApprovalChatConfig(configId: string, body: RequestUpdateApprovalChatConfig) {
    return instance({
      method: 'patch',
      url: `v1/ace/approval/notify_config/${configId}`,
      data: body,
    })
  },
  // 删除配置
  deleteApprovalChatConfig(configId: string) {
    return instance({
      method: 'delete',
      url: `v1/ace/approval/notify_config/${configId}`,
    })
  },
  // 获取审批流通知配置
  getApprovalChatConfig(params: RequestGetApprovalChatConfigList) {
    return instance({
      method: 'get',
      url: 'v1/ace/approval/notify_config',
      params: params,
      paramsSerializer(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  }
}
