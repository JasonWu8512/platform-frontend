import instance from '@/api/index.js'
// @ts-ignore
import {RequestGetUserList} from "@/api/types/user.ts"

const urlPrefix = '/v1/'
export default {
  doLogin(params: any) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/login`,
      data: params
    })
  },
  resetPassword(id: string, params: any) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/${id}/change-password`,
      data: params
    })
  },
  //模糊搜索用户
  getUserBySearch(params?: RequestGetUserList) {
    return instance({
      method: 'get',
      url: `${urlPrefix}user`,
      params: params
    })
  },
  // 获取用户权限
  getUserPermissions(params: any) {
    return instance({
      method: 'get',
      url: `${urlPrefix}user/permissions`,
      params: params
    })
  },
  // 校验ssoauthcode
  authToken(params: any) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/auth_token`,
      data: params
    })
  },
  // sso AccountInfo
  ssoLogout(params: any) {
    return instance({
      method: 'post',
      url: `${urlPrefix}user/logout`,
      data: params
    })
  }
}
