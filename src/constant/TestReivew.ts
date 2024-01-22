export enum reviewStatusEnum {
  INIT = 'init',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  REJECT = 'reject',
}

export const reviewStatusType = {
  [reviewStatusEnum.INIT]: '未开始',
  [reviewStatusEnum.IN_PROGRESS]: '进行中',
  [reviewStatusEnum.DONE]: '已完成',
  [reviewStatusEnum.REJECT]: '驳回',
}

export enum reviewCaseStatusEnum {
  INIT = 'init',
  REJECT = 'reject',
  PASS = 'pass',
}

export const reviewCaseStatusType = {
  [reviewCaseStatusEnum.INIT]: '未开始',
  [reviewCaseStatusEnum.REJECT]: '未通过',
  [reviewCaseStatusEnum.PASS]: '通过',
}

export enum caseBatchReviewEnum {
  STATUS = 'status',
}

export const caseBatchReviewType = {
  [caseBatchReviewEnum.STATUS]: '评审状态',
}
