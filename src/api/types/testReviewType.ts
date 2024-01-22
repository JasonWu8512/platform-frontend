import {reviewStatusEnum} from "@/constant/TestReivew"

export type typeReviewForm = {
  /**
   * 评审标题
   */
  name: string,
  /**
   * 评审所属项目ID
   */
  projId: string,
  /**
   * 项目枚举，可多选
   */
  projKey: string[],
  /**
   * 项目名称
   */
  projName?: string,
  /**
   * 负责人
   */
  reviewer: string[],
  /**
   * 测试状态
   */
  status: reviewStatusEnum,
  /**
   * 描述
   */
  description?: string,
  /**
   * 截止时间
   */
  targetEnd: string | null,
  /**
   * 一些额外的参数
   */
  // [propName: string]: any
}

export type typeReviewData = {
  /**
   * 评审标题
   */
  name: string,
  /**
   * 评审所属项目ID
   */
  projId: string,
  /**
   * 项目枚举，可多选
   */
  projKey: string[],
  /**
   * 项目名称
   */
  projName?: string,
  /**
   * 负责人
   */
  reviewerList?: string[],
  /**
   * 测试状态
   */
  status: reviewStatusEnum,
  /**
   * 描述
   */
  description: string | null,
  /**
   * 截止时间
   */
  targetEnd: string | null,
  /**
   * 创建时间
   */
  createdAt?: string,
  /**
   * id
   */
  id: string,
  /**
   * 一些额外的参数
   */
  // [propName: string]: any
}
