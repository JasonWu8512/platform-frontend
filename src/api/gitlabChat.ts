import instance from "@/api/index"
import {
  RequestCreateGitlabChatConfig,
  RequestGetGitlabChatConfigList,
  RequestUpdateGitlabChatConfig
} from "@/api/types/gitlab"
import Qs from "qs"

export default {
  // 新增测试计划
  createGitlabChatConfig(body: RequestCreateGitlabChatConfig) {
    return instance({
      method: 'post',
      url: `v1/ace/gitlab/chat_config`,
      data: body,
    })
  },
  // 修改测试计划
  updateGitlabChatConfig(configId: string, body: RequestUpdateGitlabChatConfig) {
    return instance({
      method: 'patch',
      url: `v1/ace/gitlab/chat_config/${configId}`,
      data: body,
    })
  },
  // 删除配置
  deleteGitlabChatConfig(configId: string) {
    return instance({
      method: 'delete',
      url: `v1/ace/gitlab/chat_config/${configId}`,
    })
  },
  // 获取Pr合并配置列表
  getGitlabChatConfigList(params: RequestGetGitlabChatConfigList) {
    return instance({
      method: 'get',
      url: 'v1/ace/gitlab/chat_config',
      params: params,
      paramsSerializer(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  },
  // 获取Gitlab的项目
  getAllGitlabProjects() {
    return instance({
      method: 'get',
      url: 'v1/ace/gitlab/project',
    })
  },
  // 获取jira联动Pr合并配置列表
  getGitlabPRConfigList(params: RequestGetGitlabChatConfigList) {
    return instance({
      method: 'get',
      url: 'v1/ace/gitlab/pr_config',
      params: params,
      paramsSerializer(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  },
  // 新增jira联动Pr合并配置
  createGitlabPRConfig(body: RequestCreateGitlabChatConfig) {
    return instance({
      method: 'post',
      url: `v1/ace/gitlab/pr_config`,
      data: body,
    })
  },
  // 修改jira联动Pr合并配置
  updateGitlabPRConfig(configId: string, body: RequestUpdateGitlabChatConfig) {
    return instance({
      method: 'patch',
      url: `v1/ace/gitlab/pr_config/${configId}`,
      data: body,
    })
  },
  // 删除jira联动Pr合并配置
  deleteGitlabPRConfig(configId: string) {
    return instance({
      method: 'delete',
      url: `v1/ace/gitlab/pr_config/${configId}`,
    })
  },

}
