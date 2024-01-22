import {typeCaseForm, typeCaseStep} from "@/api/types/testTrackType"
import {caseTypeEnum, executionEnum, priorityEnum} from "@/constant/TestCase"

export const caseStep: typeCaseStep = {
  stepNumber: 1,
  actions: '',
  expectedresults: '',
}

export const caseForm: typeCaseForm = {
  name: '',
  module: '',
  maintainer: '',
  priority: priorityEnum.P3,
  caseType: caseTypeEnum.FUNCTIONAL,
  method: executionEnum.MANUAL,
  prerequisite: '',
  testId: '',
  otherTestName: '',
  steps: [caseStep],
  description: ''
}

export const caseFormRules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
  ],
  module: [{required: true, message: '请选择模块', trigger: 'change'}],
  maintainer: [{required: true, message: '请选择维护人', trigger: 'change'}],
  priority: [{required: true, message: '请选择用例等级', trigger: 'change'}],
  caseType: [{required: true, message: '请选择用例类型', trigger: 'change'}],
  testId: [{required: true, message: '请选择', trigger: 'change'}],
  method: [{required: true, message: '请选择测试方式', trigger: 'change'}],
  prerequisite: [{max: 500, message: '长度必须小于500', trigger: 'blur'}],
  description: [{max: 500, message: '长度必须小于500', trigger: 'blur'}]
}
