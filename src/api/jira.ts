import instance from '@/api/index'
import Qs from "qs";
import {RequestGetTestEpics} from './types/jira'

const urlPrefix = '/v1/jira/'
export default {
  // 获取所有工程
  getAllProject(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}projects`,
      params: params
    })
  },
  // 获取迭代
  getSprintByProject(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprints`,
      params: params
    })
  },
  // 根据迭代获取story
  getStoryBySprint(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}stories`,
      params: params
    })
  },
  // 获取最近一次迭代
  getLatestSprint(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprints/latest`,
      params: params
    })
  },
  // 获取指定迭代下所有版本的信息
  getVersionDetailsBySprint(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}version/details`,
      params: params
    })
  },

  // 获取bugsummary
  getBugSummary(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}bug/summary`,
      params: params
    })
  },

  //获取指定月份测试报告
  getTestMonthReport(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}month/report`,
      params: params
    })
  },

  //获取部门指定月份测试报告
  getTestDepartmentMonthReport(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}department/month/report`,
      params: params
    })
  },

  // 获取指定月份测试bug指标报告趋势
  getMonthTrendReport(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}month/quality/trend`,
      params: params
    })
  },

  // 获取指定月份bug解决时长趋势
  getMonthBugFixTimeTrend(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}month/bug_time/trend`,
      params: params
    })
  },

  //获取每条产线迭代维度近半年需求响应周期
  getBusinessSprintCycle(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}demand/business/sprint/cycle`,
      params: params
    })
  },

  // 获取项目半年的迭代维度下bug的平均解决、关闭时长
  getSprintBugFixTimeTrend(param: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprint/bug_time/trend`,
      params: param
    })
  },

  // 获取项目吞吐量
  getStoryThroughput(params: any) {
    return instance( {
      method: 'get',
      url: `${urlPrefix}sprint/story/throughput`,
      params: params
    })
  },

  // 获取交付周期半年内趋势
  getBusinessCycleTrend(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}demand/response/cycle`,
      params: params
    })
  },

  // epic搜索
  getTestEpics(params: RequestGetTestEpics) {
    return instance({
      method: 'get',
      url: `${urlPrefix}epics`,
      params: params,
      paramsSerializer(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  },

  // 获取sprint的各职能团队人天报告
  getSprintEstimateReport(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprint/estimate/report`,
      params: params
    })
  },

  // 获取占用研发/测试资源top10需求
  getStoryResourceRank(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprint/story/resource/rank`,
      params: params
    })
  },

  // 编辑职能团队总的sprint的人数、开发人天等
  editSprintTotalEstimate(sprId: string, params: any) {
    return instance({
      method: 'patch',
      url: `${urlPrefix}sprint/total/estimate/${sprId}`,
      data: params
    })
  },

  // 获取技术部月度资源报告
  getMonthResourceReport(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}month/resource/report`,
      params: params
    })
  },

  // 编辑月度资源报告
  editMonthResourceReport(rid: string, params: any) {
    return instance({
      method: 'patch',
      url: `${urlPrefix}month/resource/report/${rid}`,
      data: params
    })
  },

  // 编辑职能团队的sprint的人数、开发人天等
  editSprintEstimateReport(rid: string, params: any) {
    return instance({
      method: 'patch',
      url: `${urlPrefix}sprint/estimate/report/${rid}`,
      data: params
    })
  },

  // 获取研发测试投入及bugs
  getDevQaAndBug(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}develop/bug/statistical`,
      params: params
    })
  },

  // 获取子任务
  getSubTask(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprint/subtask`,
      params: params
    })
  },

  // 获取固定sprintid,暂时效能数据专用
  getSprintSpecific(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprint/specific`,
      params: params
    })
  },

  //获取每个迭代的story的提测规划
  getSprintStoryTestPlan(params: any) {
    return instance( {
      method: 'get',
      url: `${urlPrefix}sprint/story/test/planning`,
      params: params
    })
  },

  // 获取每个迭代的story的测规划
  getSprintStoryTestStatus(params: any) {
    return instance( {
      method: 'get',
      url: `${urlPrefix}sprint/story/test/status`,
      params: params
    })
  },

  // 获取迭代冲刺总览
  getSprintOverview() {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprint/story/overview`,
    })
  },

  //获取bug质量分
  getBugPoint(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprint/bug/point`,
      params: params
    })
  },

  //获取bug修复时长
  getBugFixTime(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprint/bug/fix/duration`,
      params: params
    })
  },

  //下载bug详情
  downloadBugDetails(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprint/bug/download`,
      params: params
    })
  },
  // 同步项目报告数据
  synReport(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprint/report/refresh`,
      params: params
    })
  },
  // 获取迭代异常
  getSprintExceptionsWarning(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}sprint/warning`,
      params: params
    })
  }
}
