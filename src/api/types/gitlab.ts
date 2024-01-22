import {PublicResourceList} from "@/api/types/publicResource";

export interface RequestGetGitlabChatConfigList extends PublicResourceList {
  /**
   * 项目路径
   */
  project?: string,
  /**
   * 源分支
   */
  sourceBranch?: string,
  /**
   * 目标分支
   */
  targetBranch?: string,
  /**
   * 群聊id
   */
  chatId?: string,
  /**
   * 激活状态
   */
  isJiraActive?: number,

}

export interface RequestCreateGitlabChatConfig {
  /**
   * 项目路径
   */
  project: string,
  /**
   * 源分支
   */
  sourceBranch?: string,
  /**
   * 目标分支
   */
  targetBranch: string,
  /**
   * 群聊id
   */
  chatId: string,
  /**
   * 激活状态
   */
  isJiraActive?: number,

}

export interface RequestUpdateGitlabChatConfig {
  /**
   * 源分支
   */
  sourceBranch?: string,
  /**
   * 目标分支
   */
  targetBranch?: string,
  /**
   * 群聊id
   */
  chatId?: string,
  /**
   * 激活状态
   */
  isJiraActive?: number,

}
