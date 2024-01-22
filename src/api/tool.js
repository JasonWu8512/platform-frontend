import instance from '@/api/index.js'
const urlPrefix = '/v1/mock'
const dataToolUrlPrefix = '/v1/dataTool'
export default {
    // 获取所有域名mock状态
    getAllDomainStatus (params){
        return instance({
            method: 'get',
            url: `${urlPrefix}/status`,
            params: params
        })
    },

    // 更改mock状态
    updateMock(params) {
        return instance({
            method: 'post',
            url: `${urlPrefix}/status/update`,
            data: params
        })
    },
    // 获取数据处理
    getScenes(params) {
        return instance({
            method: 'get',
            url: `${dataToolUrlPrefix}/data/operation/query`,
            params: params
        })
    },
    // 处理数据
    preOperateData(params) {
        return instance({
            method: 'post',
            url: `${dataToolUrlPrefix}/data/operate`,
            data: params
        })
    },
    // 处理接口数据
    InterfaceOperateData(params) {
      return instance({
        method: 'post',
        url: `${dataToolUrlPrefix}/interface/operate`,
        data: params
      })
    }

}
