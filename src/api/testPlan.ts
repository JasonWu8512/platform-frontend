import instance from "@/api/index"
import {
  RequestCreatePackagingTestApproval,
  RequestCreateTestCasePlan,
  RequestGetPackagingTestApproval,
  RequestGetTestCasePlanCaseList,
  RequestGetTestCasePlanList,
  RequestGetTestCasePlanUnRelateCaseList,
  RequestUpdateApprovalStatus,
  RequestUpdateTestCasePlan,
  RequestUpdateTestCasePlanCaseList
} from "@/api/types/testPlan"
import Qs from "qs"

export default {
  // 新增测试计划
  createTestCasePlan(body: RequestCreateTestCasePlan) {
    return instance({
      method: 'post',
      url: 'v1/test/plan',
      data: body,
    })
  },
  // 修改测试计划
  updateTestCasePlan(planId: string, body: RequestUpdateTestCasePlan) {
    return instance({
      method: 'patch',
      url: `v1/test/plan/${planId}`,
      data: body,
    })
  },
  // 删除测试计划
  deleteTestCasePlan(planId: string) {
    return instance({
      method: 'delete',
      url: `v1/test/plan/${planId}`,
    })
  },
  // 获取测试计划列表
  getTestCasePlanList(params: RequestGetTestCasePlanList) {
    return instance({
      method: 'get',
      url: 'v1/test/plan',
      params: params,
      paramsSerializer(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  },
  // 获取单个计划详情
  getTestCasePlanDetail(planId: string) {
    return instance({
      method: 'get',
      url: `v1/test/plan/${planId}`,
    })
  },
  // 获取计划关联的报告
  getTestCasePlanReport(planId: string) {
    return instance({
      method: 'get',
      url: `v1/test/plan/${planId}/report`,
    })
  },
  // 关联/取消关联计划和测试用例
  updateTestCasePlanCaseList(planId: string, body: RequestUpdateTestCasePlanCaseList) {
    return instance({
      method: 'post',
      url: `v1/test/plan/${planId}/case/relate`,
      data: body,
    })
  },
  // 获取计划关联的用例
  getTestCasePlanCaseList(planId: string, params: RequestGetTestCasePlanCaseList) {
    return instance({
      method: 'get',
      url: `v1/test/plan/${planId}/case`,
      params: params,
      paramsSerializer(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  },
  // 获取计划在某项目/模块下未关联的用例，主要是关联用例弹窗页面用到
  getTestCasePlanUnRelateCaseList(planId: string, params: RequestGetTestCasePlanUnRelateCaseList) {
    return instance({
      method: 'get',
      url: `/v1/test/plan/${planId}/case/no_relate`,
      params: params,
      paramsSerializer(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  },
  // 获取计划关联的用例树
  getTestCasePlanCaseTree(planId: string) {
    return instance({
      method: 'get',
      url: `v1/test/plan/${planId}/tree`,
    })
  },
  //获取计划关联的冒烟计划通过率
  getTestPlanSmokePassRate(planId: string) {
    return instance({
      method: 'get',
      url: `v1/test/plan/${planId}/smoke/pass_rate`,
    })
  },
  // 获取开发提测审批流详情
  getPackagingTestApproval(planId: string, params: RequestGetPackagingTestApproval) {
    return instance({
      method: 'get',
      url: `v1/test/plan/${planId}/smoke/packaging_test`,
      params: params,
    })
  },
  // 开发提测
  createPackagingTestApproval(planId: string, body: RequestCreatePackagingTestApproval) {
    return instance({
      method: 'post',
      url: `v1/test/plan/${planId}/smoke/packaging_test`,
      data: body,
    })
  },
  // 变更审批流状态
  updateApprovalStatus(planId: string, body: RequestUpdateApprovalStatus) {
    return instance({
      method: 'post',
      url: `v1/test/plan/${planId}/smoke/packaging_test/approval_status`,
      data: body,
    })
  },
  // 发送报告
  sendReportEmail(planId: string, body: any) {
    return instance({
      method: 'post',
      url: `v1/test/plan/${planId}/send_report`,
      data: body
    })
  },
  // sonar 结果
  getSonarResult(params: any){
    return instance({
      method: 'get',
      url: 'v1/sonar',
      params: params,
      paramsSerializer(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  }
 }
