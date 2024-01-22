import {PublicResourceList} from "@/api/types/publicResource"
import {reviewStatusEnum} from "@/constant/TestReivew"

export interface RequestCreateTestCaseReview {
  /**
   * 评审名称
   */
  name: string,
  /**
   * 项目ID
   */
  projId: string,
  /**
   * 项目枚举
   */
  projKey: string,
  /**
   * 项目中文名
   */
  projName: string,
  /**
   * 模块ID
   */
  treeId?: string,
  /**
   * 评审结束时间，空时传null
   */
  targetEnd: string | null,
  /**
   * 项目描述
   */
  description?: string,
  /**
   * 评审人
   */
  reviewer: string[],
  /**
   * 创建人
   */
  creator: string,
}

export interface RequestGetTestCaseReviewList extends PublicResourceList {
  /**
   * 计划名称
   */
  name?: string,
  /**
   * 项目列表id
   */
  projId?: string[],
  /**
   * 评审状态
   */
  status?: reviewStatusEnum
}

export interface RequestUpdateTestCaseReview {
  /**
   * 评审名称
   */
  name: string,
  /**
   * 评审结束时间
   */
  targetEnd: string | null,
  /**
   * 项目描述
   */
  description?: string,
  /**
   * 评审人
   */
  reviewer: string[],
  /**
   * 当前状态
   */
  status?: reviewStatusEnum,
}
