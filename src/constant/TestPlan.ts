export enum planResultEnum {
  INIT = 'init',
  PASS = 'pass',
  FAIL = 'fail',
  BLOCK = 'block',
  SKIP = 'skip',
}

export const planResultType = {
  [planResultEnum.INIT]: '未开始',
  [planResultEnum.PASS]: '成功',
  [planResultEnum.FAIL]: '失败',
  [planResultEnum.BLOCK]: '阻塞',
  [planResultEnum.SKIP]: '跳过',
}

export enum planStageEnum {
  SMOKE = 'smoke',
  REGRESSION = 'regression',
  SYSTEM = 'system',
}

export const planStageType = {
  [planStageEnum.SMOKE]: '冒烟测试',
  [planStageEnum.REGRESSION]: '回归测试',
  [planStageEnum.SYSTEM]: '功能测试',
}

export enum planReportEnum {
  BASE_INFO = 1,
  MODULE_EXECUTE_RESULT = 2,
  EXECUTE_RESULT = 3,
  BUG_LEVEL_CHARTS = 4,
  BUG_OWNER_CHARTS = 5,
  TICKETS = 6,
  ISSUES = 7,
}

export const planReportType = {
  [planReportEnum.BASE_INFO]: '冒烟测试',
  [planReportEnum.MODULE_EXECUTE_RESULT]: '回归测试',
  [planReportEnum.EXECUTE_RESULT]: '功能测试',
  [planReportEnum.BUG_LEVEL_CHARTS]: '功能测试',
  [planReportEnum.BUG_OWNER_CHARTS]: '功能测试',
  [planReportEnum.TICKETS]: '功能测试',
  [planReportEnum.ISSUES]: '功能测试',
}

export enum planOperationEnum {
  ADD = 'add',
  REMOVE = 'remove',
}

export enum planStatusEnum {
  INIT = 'init',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  REJECT = 'reject',
}

export const planStatusType = {
  [planStatusEnum.INIT]: '未开始',
  [planStatusEnum.IN_PROGRESS]: '进行中',
  [planStatusEnum.DONE]: '已完成',
  [planStatusEnum.REJECT]: '驳回',
}

export enum caseBatchEditEnum {
  RESULT = 'result',
  EXECUTOR = 'executor',
}

export const caseBatchEditType = {
  [caseBatchEditEnum.RESULT]: '执行结果',
  [caseBatchEditEnum.EXECUTOR]: '执行人',
}

export enum planInstanceStatusEnum {
  INIT = "INIT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}

export const planInstanceStatusType = {
  [planInstanceStatusEnum.INIT]: '未提交',
  [planInstanceStatusEnum.PENDING]: '进行中',
  [planInstanceStatusEnum.APPROVED]: '已通过',
  [planInstanceStatusEnum.REJECTED]: '已拒绝',
  [planInstanceStatusEnum.CANCELED]: '已撤回',
}
