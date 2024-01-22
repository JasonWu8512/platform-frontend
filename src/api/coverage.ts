import instance from '@/api/index'
import Qs from "qs"
const urlPrefix = 'v1/coverage'
const urlGitPrefix = 'v1/gitlab'
export default {
  // 获取所有git工程
  getAllGitProjects() {
    return instance({
      method: 'get',
      url: `${urlPrefix}/git/project`
    })
  },
  // 获取流水线详情
  getPipelineInfo(id: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/pipeline/${id}`,
    })
  },
  // 创建流水线
  createPipeline(params: Object) {
    return instance({
      method: 'post',
      url: `${urlPrefix}/pipeline`,
      data: params,
    })
  },
  // 编辑流水线
  updatePipeline(id: any, params: Object) {
    return instance({
      method: 'patch',
      url: `${urlPrefix}/pipeline/${id}`,
      data: params
    })
  },
  // 删除流水线
  deletePipeline(id: any) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}/pipeline/${id}`,
    })
  },
  // 获取流水线列表
  getPipelineList(params: Object) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/pipeline`,
      params: params,
      paramsSerializer(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  },
  // 获取某流水线服务端发版console
  getPipelineDeployConsole(id: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/pipeline/${id}/deploy/console`
    })
  },
  getPipelineCoverageConsole(id: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/pipeline/${id}/coverage/console`
    })
  },
  // 查看流水线的构建记录
  getJenkinsTasksHistory(params: Object) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/jenkins/task`,
      params: params
    })
  },
  // 触发服务构建
  triggerServerDeploy(params: Object) {
    return instance({
      method: 'post',
      url: `${urlPrefix}/jenkins/task/server/deploy`,
      data: params
    })
  },
  // 触发覆盖率报告构建
  triggerCoverageDeploy(params: Object) {
    return instance({
      method: 'post',
      url: `${urlPrefix}/jenkins/task`,
      data: params
    })
  },
  // 触发sonar构建
  triggerSonarBuild(params: Object) {
    return instance({
      method: 'post',
      url: `${urlPrefix}/jenkins/task/server/sonar`,
      data: params
    })
  },
  // 查看服务端发版记录
  getServerJenkinsDeployHistory(params: Object) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/jenkins/server/deploy/history`,
      params: params
    })
  },

  // gitlab 分支管理相关
  // 获取projects
  getGitlabProjects(params: any) {
    return instance({
      method: 'get',
      url: `${urlGitPrefix}/projects`,
      params: params
    })
  },
  // 获取指定工程的branches
  getGitlabProjectBranches(pid: string, params: any) {
    return instance({
      method: 'get',
      url: `${urlGitPrefix}/project/${pid}/branch`,
      params: params
    })
  },
  // 给指定工程创建分支
  createGitlabProjectBranch(pid: string, params: any) {
    return instance({
      method: 'post',
      url: `${urlGitPrefix}/project/${pid}/branch`,
      data: params
    })
  },
  // 删除指定分支
  deleteGitlabProjectBranch(pid: string, params: any) {
    return instance({
      method: 'delete',
      url: `${urlGitPrefix}/project/${pid}/branch`,
      params: params
    })
  } ,
  // 查看全量覆盖率趋势
  getFullCoverageReportTrend(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/full/report/trend`,
      params: params
    })
  }
  
}

export class coverageApi {
}
