import {PublicResourceList} from "@/api/types/publicResource"
import {typePackagingTestForm} from "@/api/types/testPlanType"
import {priorityEnum} from "@/constant/TestCase"
import {
  planInstanceStatusEnum,
  planOperationEnum,
  planStageEnum,
  planStatusEnum
} from "@/constant/TestPlan"

export interface RequestCreateTestCasePlan {
  /**
   * 计划名称
   */
  name: string,
  /**
   * 测试阶段
   */
  stage: planStageEnum,
  /**
   * 项目IDs
   */
  projIds: string[],
  /**
   * 计划所有者
   */
  owner: string,
  /**
   * 评审开始时间
   */
  targetStart?: string,
  /**
   * 评审结束时间
   */
  targetEnd?: string,
  /**
   * 项目描述
   */
  description?: string,
  /**
   * Epic ids
   */
  storyIds: string[],
  /**
   * pipelineIds,以获取sonar结果
   */
  pipelineIds: string[],
  /**
   * 迭代id
   */
  sprintId: string,
  /**
   * 绑定的父类测试计划
   * @desc 测试计划类型是冒烟时选填，从属于哪个主测试计划，用于统计冒烟通过率
   */
  parent?: number,
}

export interface RequestGetTestCasePlanList extends PublicResourceList {
  /**
   * 计划名称
   */
  name?: string,
  /**
   * 项目名称
   */
  projNames?: string[],
  /**
   * 负责人
   */
  owner?: string,
  /**
   * 测试阶段
   */
  stage?: planStageEnum,
  /**
   * 状态
   */
  status?: planStatusEnum,
  /**
   * 是否筛选驳回记录
   */
  isReject?: boolean,
}

export interface RequestUpdateTestCasePlan {
  /**
   * 计划名称
   */
  name?: string,
  /**
   * 测试阶段
   */
  stage?: planStageEnum,
  /**
   * 项目IDs
   */
  projIds?: string[],
  /**
   * 项目ID names
   */
  projNames?: string[],
  /**
   * 计划所有者
   */
  owner?: string,
  /**
   * 预计开始时间
   */
  targetStart?: string,
  /**
   * 预计结束时间
   */
  targetEnd?: string,
  /**
   * 实际开始时间
   */
  actualStart?: string,
  /**
   * 实际结束时间
   */
  actualEnd?: string,
  /**
   * 项目描述
   */
  description?: string,
  /**
   * 发布版本id
   */
  versionId?: string,
  /**
   * 绑定的父类测试计划
   * @desc 测试计划类型是冒烟时选填，从属于哪个主测试计划，用于统计冒烟通过率
   */
  parent?: number,
  /**
   * 报告
   * @desc 例1,2,3,4,5,6,7；
   * @Enum planReportEnum
   */
  reportComponents?: string,
  /**
   * 计划状态
   */
  status: planStatusEnum,
}

export interface RequestGetTestCasePlanCaseList extends PublicResourceList {
  /**
   * 名称
   */
  name?: string,
  /**
   * 优先级
   */
  importance?: priorityEnum,
  /**
   * 模块id
   * @desc 如果tree_id是根节点，则传在proj_id字段
   */
  treeId?: string,
  /**
   *
   */
  projId?: string,
  /**
   * 执行人
   */
  executor?: string,
}

export interface RequestUpdateTestCasePlanCaseList {
  /**
   * 更新用例关联
   */
  operation: planOperationEnum,
  /**
   * 模块id
   */
  treeId?: string,
  /**
   * @desc 如果是remove操作，且tree_id是根节点，则把tree_id传在proj_id字段
   */
  projId?: boolean,
  /**
   * 关联用例ID
   * @desc 取消全部关联时传空list
   */
  caseIds: string[],
}

export interface RequestGetTestCasePlanUnRelateCaseList extends PublicResourceList {
  /**
   * 优先级
   */
  importance?: priorityEnum,
  /**
   * 模块id
   */
  treeId?: string,
  /**
   * 所属项目id
   */
  projId?: string,
  /**
   * 执行人
   */
  executor?: string,
  /**
   * 名称
   */
  name?: string,
}

export interface RequestGetPackagingTestApproval {
  /**
   * 审批流详情
   */
  instanceCode: string,
}

export interface RequestCreatePackagingTestApproval extends typePackagingTestForm {
  /**
   * 用户邮箱
   */
  userEmail: string,
  /**
   * 负责人邮箱
   */
  ownerEmail: string,
  /**
   * 项目
   */
  jiraProjects: string,
}

export interface RequestUpdateApprovalStatus {
  /**
   * 审批流状态
   */
  status: planInstanceStatusEnum,
  /**
   * 用户邮箱
   */
  userEmail: string,
}
