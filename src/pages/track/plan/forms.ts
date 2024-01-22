import {typePackagingTestForm, typePlanForm} from "@/api/types/testPlanType"
import {planInstanceStatusEnum, planStatusEnum} from "@/constant/TestPlan"


export const planForm: typePlanForm = {
  status: planStatusEnum.INIT,
  name: '',
  projIds: [],
  projNames: [],
  owner: '',
  stage: '',
  description: '',
  targetStart: '',
  targetEnd: '',
  storyIds: [],
  sprintId: '',
  parent: '',
  pipelineIds: []
}

export const planRules = {
  name: [{required: true, message: '请输入测试计划名称', trigger: 'blur'}],
  projIds: [{required: true, message: '请选择所属项目', trigger: 'change'}],
  owner: [{required: true, message: '请选择负责人', trigger: 'change'}],
  stage: [{required: true, message: '请选择测试阶段', trigger: 'change'}],
  sprintId: [{required: true, message: '请选择关联迭代', trigger: 'change'}],
  description: [{max: 200, message: '长度必须小于200', trigger: 'blur'}],
  parent: [{required: true, message: '请选择对应功能测试计划', trigger: 'change'}],
  storyIds: [{required: true, message: '请选择对应提测需求', trigger: 'change'}]
}

export const packagingTestForm: typePackagingTestForm = {
  name: '',
  summary: '',
  influence: '',
  server: '',
  result: '',
  postpone: '',
  reason: '',
  status: planInstanceStatusEnum.INIT,
}

export const packagingTestRules = {
  name: [{required: true, message: '请输入提测需求名称', trigger: 'blur'}],
  server: [{required: true, message: '请输入提测服务及commit id', trigger: 'blur'}],
  result: [{required: true, message: '请输入冒烟结果链接', trigger: 'blur'}],
  postpone: [{required: true, message: '请选择是否延期', trigger: 'change'}],
}
