import {caseTypeEnum, executionEnum, priorityEnum, stepStatusEnum} from "@/constant/TestCase"

export type typeCaseStep = {
  stepNumber: number,
  /**
   * 步骤
   */
  actions: string,
  /**
   * 期望结果
   */
  expectedresults: string,
  /**
   * 实际结果
   */
  actualResult?: string,
  /**
   * 步骤执行结果
   */
  actualStatus?: stepStatusEnum,
}

export type typeCaseForm = {
  /**
   * 用例标题
   */
  name?: string,
  /**
   * 用例所属模块
   */
  module?: string,
  /**
   * 用例维护人
   */
  maintainer?: string,
  /**
   * 用例类型
   */
  caseType?: caseTypeEnum,
  /**
   * 测试方式1手动2自动
   */
  method?: executionEnum,
  /**
   * 前置条件
   */
  prerequisite?: string,
  /**
   * 其他用例ID
   */
  testId?: string,
  /**
   * 其他用例名称
   */
  otherTestName?: string,
  /**
   * 优先级int 1，2，3
   */
  priority?: priorityEnum,
  /**
   * 步骤
   */
  steps?: typeCaseStep[],
  /**
   * 备注
   */
  description?: string,
  /**
   * 更新时间
   */
  updatedAt?: string,
}

export type typeCaseData = {
  /**
   * 模块树所属节点id
   */
  treeId: string,
  /**
   * 用例名称
   */
  name: string,
  /**
   * 备注
   */
  description: string,
  /**
   * 前置条件
   */
  preconditions: string,
  /**
   * 测试方式1手动2自动
   */
  executionType: executionEnum,
  /**
   * 优先级int 1，2，3
   */
  importance: priorityEnum,
  /**
   * 用例类型
   */
  caseType: caseTypeEnum,
  /**
   * 步骤
   */
  steps: typeCaseStep[],
  /**
   * 维护人
   */
  qa: string,
  /**
   * 关联用例ID
   */
  testId: string,
}

export type typeNode = {
  id: string,
  name: string,
  children: typeNode[],
  level: number,
  parent: any,
  data: any,
}

export type typeNodeData = {
  id: string,
  name: string,
  children: typeNodeData[],
}

export type typeModuleOption = {
  id: string,
  path: string,
}

