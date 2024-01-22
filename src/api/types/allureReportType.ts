import {caseStatusEnum} from "@/constant/AllureReport"

/**
 * 用例详情
 */
export type typeTestDetail = {
  data: {
    detail: {
      /**
       * uid
       */
      uid: string,
      /**
       * 用例标题
       */
      name: string,
      /**
       * 执行时间
       */
      time: {
        start: number,
        duration: number,
      },
      /**
       * 参数
       */
      parameters: { name: string, value: string }[],
      /**
       * 完整路径
       */
      fullName: string,
      /**
       * 额外的
       */
      extra?: {
        categories?: [],
        severity: string,
        tags?: [],
        history?: [],
      },
      /**
       * 描述
       */
      description?: string,
      /**
       * epics
       */
      epics: string[],
      /**
       * 冒烟用例需要绑定对应的功能用例
       */
      parent?: string,
      /**
       * 用例执行状态
       */
      status: caseStatusEnum,
      /**
       * 错误日志
       */
      statusTrace: string,
      /**
       * 错误详情
       */
      statusMessage: string,
    }
  }
}

/**
 * 测试计划列表使用字段
 */
/** @ */
export type typeTestSuitData = {
  /**
   * name
   */
  name: string,
  /**
   * 用例执行结果数据
   */
  statistic: {
    passed: number,
    failed: number,
    skipped: number,
    broken: number,
    unknown: number,
    total: number,
  },
  /**
   * 子节点
   */
  children?: typeTestSuitData[],
  /**
   * uid
   */
  uid: string,
}
