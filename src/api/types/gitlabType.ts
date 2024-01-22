/**
 * 测试计划创建/更新表单
 */
export type typeGitlabChatForm = {
  /**
   * 项目路径
   */
  project: string,
  /**
   * 源分支
   */
  sourceBranch: string,
  /**
   * 目标分支
   */
  targetBranch: string,
  /**
   * 群聊id
   */
  chatId: string,
}

/**
 * PR合并通知配置使用字段
 */
/** @ */
export type typeGitlabChatData = {
  /**
   * id
   */
  id: string,
  /**
   * 项目路径
   */
  project: string,
  /**
   * 源分支
   */
  sourceBranch: string,
  /**
   * 目标分支
   */
  targetBranch: string,
  /**
   * 群聊id
   */
  chatId: string,
  /**
   * 群聊名称
   */
  chatName: string,
  /**
   * 飞书群聊id
   */
  chatLarkId: string,
  /**
   * 激活状态
   */
  isJiraActive: number,
  /**
   * 激活状态
   */
  status: string,

}
