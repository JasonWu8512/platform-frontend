import instance from "@/api/index"
import {
  RequestGetEventReview
} from "@/api/types/testBuriedAmp"
// import Qs from "qs";


export default {
  // 事件列表
  GetEventByUser(body: RequestGetEventReview) {
    return instance({
      method: 'post',
      url: 'v1/buried/event/getUserEvents',
      data: body,
      // params: params,
      // paramsSerializer(params) {
      //   return Qs.stringify(params, {arrayFormat: 'repeat'})
      // }
    })
  }
}
