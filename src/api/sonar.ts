import instance from '@/api/index'

export default {
  //sonar 列表
  getAllSonarInfos(params: Object){
    return instance({
      method: "post",
      url: "v1/sonar",
      data: params
    })
  }
}

export class sonarApi{

}
