import {PublicResourceList} from "@/api/types/publicResource"

export interface RequestGetApprovalChatConfigList extends PublicResourceList {
  /**
   * 项目路径
   */
  project?: string,
  /**
   * 群聊id
   */
  chatId?: string,
  /**
   * 激活状态
   */
  isActive?: number,

}

export interface RequestCreateApprovalChatConfig {
  /**
   * 项目路径
   */
  project: string,
  /**
   * 群聊id
   */
  chatId: string,
}

export interface RequestUpdateApprovalChatConfig {
  /**
   * 群聊id
   */
  chatId?: string,
  /**
   * 激活状态
   */
  isActive?: number,

}

/**
 * 审批流创建/更新表单
 */
export type typeApprovalChatForm = {
  /**
   * 项目路径
   */
  project: string,
  /**
   * 群聊id
   */
  chatId: string,
}

/**
 * 审批流通知配置使用字段
 */
export type typeApprovalChatData = {
  /**
   * id
   */
  id: string,
  /**
   * 项目路径
   */
  project: string,
  /**
   * 群聊id
   */
  chatId: string,
  /**
   * 群聊名称
   */
  chatName: string,
  /**
   * 激活状态
   */
  isActive: number,
}
