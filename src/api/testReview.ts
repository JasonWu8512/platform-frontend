import instance from "@/api/index"
import {
  RequestCreateTestCaseReview,
  RequestGetTestCaseReviewList,
  RequestUpdateTestCaseReview
} from "@/api/types/testReview"
import Qs from "qs"

export default {
  // 创建评审
  createTestCaseReview(body: RequestCreateTestCaseReview) {
    return instance({
      method: 'post',
      url: 'v1/test/review',
      data: body,
    })
  },
  // 获取评审列表
  getTestCaseReviewList(params: RequestGetTestCaseReviewList) {
    return instance({
      method: 'get',
      url: 'v1/test/review',
      params: params,
      paramsSerializer(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    })
  },
  // 修改评审状态
  updateTestCaseReview(reviewId: string, body: RequestUpdateTestCaseReview) {
    return instance({
      method: 'patch',
      url: `v1/test/review/${reviewId}`,
      data: body,
    })
  },
  // 获取单个评审详情
  getTestCaseReviewDetail(reviewId: string) {
    return instance({
      method: 'get',
      url: `v1/test/review/${reviewId}`,
    })
  },
}
