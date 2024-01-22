import {PublicResourceList} from "@/api/types/publicResource"
import {typeCaseStep} from "@/api/types/testTrackType"
import {caseTypeEnum, caseUpdateTypeEnum, executionEnum, priorityEnum} from "@/constant/TestCase"
import {planResultEnum} from "@/constant/TestPlan";
import {reviewCaseStatusEnum} from "@/constant/TestReivew"

// 项目ID
export interface ProjectRequest {
  projId: string
}

// 获取用例树
export interface RequestTestCaseModules extends ProjectRequest, PublicResourceList {
  name?: string
}

// 创建用例树
export interface RequestCreateTestCaseModules extends ProjectRequest {
  name: string,
  parent?: string
}

// 编辑用例树
export interface RequestUpdateTestCaseModules extends RequestCreateTestCaseModules {

}

// 导入XMind文件
export interface RequestUploadXMind extends ProjectRequest {
  treeId: string,
  caseFile: File
}

// 添加单个用例
export interface RequestCreateTestCase extends ProjectRequest {
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
  description?: string,
  /**
   * 前置条件
   */
  preconditions?: string,
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
  steps?: typeCaseStep[],
  /**
   * 维护人
   */
  qa: string,
  /**
   * 关联用例ID
   */
  testId?: string,
}

export interface UpdateTestCaseParams {
  /**
   * 模块树所属节点id
   */
  treeId?: string,
  /**
   * 用例名称
   */
  name?: string,
  /**
   * 备注
   */
  description?: string,
  /**
   * 前置条件
   */
  preconditions?: string,
  /**
   * 测试方式1手动2自动
   */
  executionType?: executionEnum,
  /**
   * 优先级int 1，2，3
   */
  importance?: priorityEnum,
  /**
   * 用例类型
   */
  caseType?: caseTypeEnum,
  /**
   * 步骤
   */
  steps?: typeCaseStep[],
  /**
   * 维护人
   */
  qa?: string,
  /**
   * 关联用例ID
   */
  testId?: string,
  /**
   * 用例评审状态
   */
  status?: reviewCaseStatusEnum,
}

// 编辑单个用例
export interface RequestUpdateTestCase {
  type: caseUpdateTypeEnum,
  /**
   * type为‘update_plan_status’时必传
   */
  planId?: string,
  /**
   * type为‘update_plan_status’时表示计划用例的执行状态，type为'update_review_status'表示用例的评审状态
   */
  status?: string,
  /**
   * type为update_plan_smoke_check时必填
   */
  smokeCheck?: planResultEnum,
  /**
   * type 为'update_plan_executor'必填，更新用例执行者
   */
  executor?: string,
  /**
   * type为'update_case'时必填
   */
  case?: UpdateTestCaseParams,
  /**
   * type为‘update_plan_status’必填,其它情况不填
   */
  stepActualResults?: string[],
  /**
   * type为‘update_plan_status’必填
   */
  stepActualStatus?: string[],
  /**
   * type为‘update_plan_status’必填
   */
  issueIds?: string[],
  /**
   * 评审ID
   */
  reviewId?: string,
}

// 批量编辑用例
export interface RequestUpdateTestCaseBatch {
  caseIds: string[],
  type: caseUpdateTypeEnum,
  /**
   * type为‘update_plan_status’时表示计划用例的执行状态，type为'update_review_status'表示用例的评审状态
   */
  status?: string,
  /**
   * type 为'update_plan_executor'必填，更新用例执行者
   */
  executor?: string,
  /**
   * type为'update_case'时必填
   */
  case?: UpdateTestCaseParams,
  /**
   * type 为'update_plan_status'、update_plan_executor时必填
   */
  planId?: string,
  /**
   * type为update_review_status
   */
  reviewId?: string,
}

// 获取用例列表
export interface RequestGetTestCaseList extends PublicResourceList {
  treeId?: string,
  projId?: string,
  /**
   * 用例名称
   */
  name?: string,
  /**
   * 评审状态
   */
  status?: reviewCaseStatusEnum[],
  /**
   * 评审人
   */
  reviewer?: string[],
  /**
   * 创建者
   */
  creator?: string[],
  /**
   * 优先级
   */
  importance?: priorityEnum[],
}
