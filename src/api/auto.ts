import instance from '@/api/index'

const urlPrefix = 'v1/auto/case'
export default {
  // 获取标签列表
  getAutoTags(params: Object) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/tag`,
      params: params
    })
  },
  // 获取自动化用例树
  getAutoCases(params: Object) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/tree`,
      params: params
    })
},
  // 获取配置集列表
  getAutoCaseConfigList(params: Object) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/config`,
      params: params
    })
  },
  // 创建或编辑自动化配置
  createOrEditAutoConfig(params: Object) {
    return instance({
      method: 'post',
      url: `${urlPrefix}/config`,
      data: params
    })
  },
  // 删除自动化配置
  deleteAutoConfig(id: string) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}/config/${id}`
    })
  },
  // 执行自动化case
  runAutoConfig(id: string) {
    return instance({
      method: 'post',
      url: `${urlPrefix}/config/run/${id}`
    })
  },
  // 获取接口自动化构建记录
  getAutoRunHistory(params: Object) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/run/history`,
      params: params
    })
  },
  // 获取allure 报告概览
  getAllureReport(historyId: string) {
    return instance({
      method: 'get',
      url: `/v1/auto/case/allure/${historyId}`,
    })
  },
  // 获取用例allure详情
  getAllureDetail(caseUid: string) {
    return instance({
      method: 'get',
      url: `${urlPrefix}/allure/detail/${caseUid}`
    })
  }


}
