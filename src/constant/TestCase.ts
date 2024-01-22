// 用例树操作属性
export enum operationEnum {
  ADD = 'add',
  EDIT = 'edit',
  VIEW = 'view',
}

export const operationType = {
  [operationEnum.ADD]: '新建用例',
  [operationEnum.EDIT]: '编辑用例',
  [operationEnum.VIEW]: '查看用例',
}

export enum caseTypeEnum {
  FUNCTIONAL = 'functional',
  PERFORMANCE = 'performance',
  API = 'api',
}

export const caseTypeType = {
  [caseTypeEnum.FUNCTIONAL]: '功能测试',
  [caseTypeEnum.PERFORMANCE]: '性能测试',
  [caseTypeEnum.API]: '接口测试',
}

export enum executionEnum {
  MANUAL = 1,
  AUTO = 2,
}

export const executionType = {
  [executionEnum.MANUAL]: '手动',
  [executionEnum.AUTO]: '自动',
}

export enum priorityEnum {
  P1 = 1,
  P2 = 2,
  P3 = 3,
}

export const priorityType = {
  [priorityEnum.P1]: 'P1',
  [priorityEnum.P2]: 'P2',
  [priorityEnum.P3]: 'P3',
}

export enum caseUpdateTypeEnum {
  DELETE = 'delete',
  UPDATE_CASE = 'update_case',
  UPDATE_PLAN_STATUS = 'update_plan_status',
  UPDATE_PLAN_EXECUTOR = 'update_plan_executor',
  UPDATE_REVIEW_STATUS = 'update_review_status',
  UPDATE_PLAN_SMOKE_CHECK = 'update_plan_smoke_check',
}

export enum caseBatchEditEnum {
  PRIORITY = 'priority',
  CASE_TYPE = 'caseType',
  METHOD = 'method',
  MAINTAINER = 'maintainer',
}

export const caseBatchEditType = {
  [caseBatchEditEnum.PRIORITY]: '用例等级',
  // [caseBatchEditEnum.CASE_TYPE]: '类型',
  // [caseBatchEditEnum.METHOD]: '测试方式',
  [caseBatchEditEnum.MAINTAINER]: '维护人',
}

export enum stepStatusEnum {
  PASS = 'pass',
  FAIL = 'fail',
  BLOCK = 'block',
  SKIP = 'skip',
}

export const stepStatusType = {
  [stepStatusEnum.PASS]: '通过',
  [stepStatusEnum.FAIL]: '失败',
  [stepStatusEnum.BLOCK]: '阻塞',
  [stepStatusEnum.SKIP]: '跳过',
}
