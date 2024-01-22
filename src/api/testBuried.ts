import instance from "@/api/index.js"


export default {

  // 获取项目数据
  getTestBuriedProjList(params: Object) {
    return instance({
      method: 'post',
      url: 'v1/buried/project/fetchList',
      data: params,
      // paramsSerializer(params) {
      //   return Qs.stringify(params, {arrayFormat: 'repeat'})
      // }
    })
  },

  // 获取事件
  getTestBuriedEventList(params: Object) {
    return instance({
      method: 'post',
      url: 'v1/buried/event/fetchList',
      data: params,

    })
  },
  // 获取枚举值
  getTestBuriedEnumList(params: Object) {
    return instance({
      method: 'post',
      url: 'v1/buried/event/fetchColumnEnum',
      data: params
    })
  },

  // 数据检查
  getTestBuriedCheckList(params: Object) {
    return instance({
      method: 'post',
      url: 'v1/buried/event/checkIsExistBuried',
      data: params,

    })
  },

}



