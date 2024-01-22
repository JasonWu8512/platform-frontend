import instance from "@/api/index"
import {
  RequestCreateTestCase,
  RequestCreateTestCaseModules,
  RequestGetTestCaseList,
  RequestTestCaseModules,
  RequestUpdateTestCase,
  RequestUpdateTestCaseBatch,
  RequestUpdateTestCaseModules,
  RequestUploadXMind
} from "@/api/types/testTrack"
// @ts-ignore
import Qs from "qs"

export default {
  // 获取用例树
  getTestCaseModules(params: RequestTestCaseModules) {
    return instance({
      method: 'get',
      url: 'v1/test/case/tree',
      params: params
    })
  },
  // 编辑用例树
  updateTestCaseModules(nodeId: string, body: RequestUpdateTestCaseModules) {
    return instance({
      method: 'patch',
      url: `v1/test/case/tree/${nodeId}`,
      data: body
    })
  },
  // 新增用例树
  createTestCaseModules(body: RequestCreateTestCaseModules) {
    return instance({
      method: 'post',
      url: 'v1/test/case/tree',
      data: body
    })
  },
  // 删除用例树
  deleteTestCaseModules(nodeId: string) {
    return instance({
      method: 'delete',
      url: `v1/test/case/tree/${nodeId}`,
    })
  },
  // 导入XMind文件
  uploadXMind(body: RequestUploadXMind | FormData) {
    return instance({
      method: 'post',
      url: 'v1/test/manual/case/upload',
      data: body,
      headers: {'Content-Type': 'multipart/form-data'}
    })
  },
  // 编辑单个用例
  updateTestCase(caseId: string, body: RequestUpdateTestCase) {
    return instance({
      method: 'patch',
      url: `v1/test/manual/case/${caseId}/update`,
      data: body,
    })
  },
  // 批量编辑用例
  updateTestCaseBatch(body: RequestUpdateTestCaseBatch) {
    return instance({
      method: 'patch',
      url: 'v1/test/manual/case/batch',
      data: body
    })
  },
  // 获取用例列表
  getTestCaseList(params: RequestGetTestCaseList) {
    return instance({
      method: 'get',
      url: 'v1/test/manual/case/list',
      params: params,
      paramsSerializer(params: any) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  },
  // 添加单个用例
  createTestCase(body: RequestCreateTestCase) {
    return instance({
      method: 'post',
      url: 'v1/test/manual/case/add',
      data: body
    })
  },
}
