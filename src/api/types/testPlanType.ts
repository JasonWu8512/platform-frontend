import {typeCaseData} from "@/api/types/testTrackType"
import {
  planInstanceStatusEnum,
  planResultEnum,
  // planStageEnum,
  planStatusEnum
} from "@/constant/TestPlan"

/**
 * 测试计划创建/更新表单
 */
export type typePlanForm = {
  /**
   * 计划开始
   */
  targetStart?: string,
  /**
   * 用例标题
   */
  name: string,
  /**
   * 绑定项目列表
   */
  projIds: string[],
  /**
   * 绑定项目列表名称
   */
  projNames: string[],
  /**
   * 负责人
   */
  owner: string,
  /**
   * 测试阶段
   */
  stage: string,
  /**
   * 计划结束
   */
  targetEnd?: string,
  /**
   * 描述
   */
  description?: string,
  /**
   * storyIds
   */
  storyIds: string[],
  /**
   * pipelineIds,以获取sonar结果
   */
  pipelineIds: string[],
  /**
   * sprintId
   */
  sprintId: string,
  /**
   * 冒烟用例需要绑定对应的功能用例
   */
  parent?: string,
  /**
   * 计划状态
   */
  status: planStatusEnum,
}

/**
 * 测试计划列表使用字段
 */
/** @ */
export type typePlanData = {
  /**
   * id
   */
  id: string,
  /**
   * 计划名称
   */
  name: string,
  /**
   * 负责人名称
   */
  owner: string,
  /**
   * 计划状态枚举中文
   * @field planStageType
   */
  stageChinese: string,
  /**
   * 冒烟用例开发执行成功率
   */
  percentage?: number,
  /**
   * 冒烟用例测试验证成功率
   */
  checkPercentage?: number,
  /**
   * 计划开始
   */
  targetStart: string,
  /**
   * 计划结束
   */
  targetEnd: string,
  /**
   * 实际开始时间
   */
  actualStart: string | null,
  /**
   * 实际结束时间
   */
  actualEnd: string | null,
  /**
   * epics
   */
  epics: string[],
  /**
   * 冒烟执行确认状态
   */
  smokeCheck: planResultEnum,
  /**
   * 用例详情
   */
  caseDetail: typeCaseData,
  /**
   * 审批详情
   */
  approvalInstance: string,
  /**
   * 审批实例状态
   */
  instanceStatus: planInstanceStatusEnum,
  /**
   * 审批驳回次数
   */
  rejectCount: string,
}

/**
 * 开发提测表单
 */
export type typePackagingTestForm = {
  /**
   * 需求名称
   */
  name: string,
  /**
   * 技术概要链接
   */
  summary?: string,
  /**
   * 影响范围
   */
  influence?: string,
  /**
   * 前后端提测服务
   */
  server: string,
  /**
   * 冒烟结果
   */
  result: string,
  /**
   * 是否延期
   */
  postpone: string,
  /**
   * 延期原因
   */
  reason?: string,
  /**
   * 当前审批流审批状态
   */
  status?: planInstanceStatusEnum,
  /**
   * 审批驳回次数
   */
  rejectCount?: string,
}

/**
 * 开发提测使用字段
 */
/** @ */
export type typePackagingTestData = {
  /**
   * 需求名称
   */
  name: string,
  /**
   * 技术概要链接
   */
  summary: string,
  /**
   * 影响范围
   */
  influence: string,
  /**
   * 前后端提测服务
   */
  server: string,
  /**
   * 冒烟结果
   */
  result: string,
  /**
   * 是否延期
   */
  postpone: string,
  /**
   * 延期原因
   */
  reason: string,
  /**
   * 审批流实例code
   */
  instanceCode: string,
}
