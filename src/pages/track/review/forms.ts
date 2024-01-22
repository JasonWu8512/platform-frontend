import {typeReviewData} from "@/api/types/testReviewType"
import {reviewStatusEnum} from "@/constant/TestReivew"

export const reviewForm: typeReviewData = {
  id: '',
  name: '',
  projId: '',
  projKey: [],
  projName: '',
  reviewerList: [],
  status: reviewStatusEnum.INIT,
  description: '',
  targetEnd: ''
}

export const reviewFormRules = {
  name: [
    {required: true, message: '请输入测试计划名称', trigger: 'blur'},
  ],
  projKey: [{required: true, message: '请选择所属项目', trigger: 'change'}],
  reviewerList: [{required: true, message: '请选择负责人', trigger: 'change'}],
  description: [{max: 200, message: '长度必须小于200', trigger: 'blur'}],
}
