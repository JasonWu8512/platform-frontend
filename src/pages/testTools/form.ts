
export const prMergedNotifyForm = {
  project: undefined,
  sourceBranch: undefined,
  targetBranch: undefined,
  chatId: [],
}

export const prMergedPRForm = {
  project: undefined,
  isJiraActive: undefined,
}

export const prMergedNotifyRules = {
  project: [{required: true, message: '请输入项目路径', trigger: 'blur'}],
  targetBranch: [{required: true, message: '请输入合并目标分支', trigger: 'blur'}],
  chatId: [{required: true, message: '请选择结果通知群', trigger: 'blur'}],
  isJiraActive: [{required: true, message: '请选择是否激活jira联动PR', trigger: 'blur'}]
}

export const approvalNotifyForm = {
  project: undefined,
  chatId: [],
}

export const approvalNotifyRules = {
  project: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
  chatId: [{required: true, message: '请选择结果通知群', trigger: 'blur'}],
}

