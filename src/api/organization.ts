import instance from '@/api/index.js'


export default {
  // 获取组织架构
  getAceDepartment(params: any) {
    return instance({
      method: 'get',
      url: '/v1/ace/department',
      params: params
    })
  },
  // 获取部门成员
  getAccountByDepartment(params: any) {
    return instance({
      method: 'get',
      url: '/v1/ace/account',
      params: params
    })
  },
  // 获取指定人员甘特图数据
  getAccountTaskGantt(params: any, userIds: string) {
    return instance({
      method: 'get',
      url: `/v1/ace/account/task/gantt?${userIds}`,
      params: params
    })
  },
  // 获取机器人所在的群
  getLarkRobotChats(params: any) {
    return instance({
      method: 'get',
      url: '/v1/ace/chat',
      params: params
    })
  },
  // 获取冲刺详情数据
  getSubTaskGantt(params: any) {
    return instance({
      method: 'get',
      url: `/v1/jira/sprint/subTask/progress`,
      params: params
    })
  },
}
