import TableSearchDatePicker from "@/common/components/search/TableSearchDatePicker.vue"
import TableSearchDateTimePicker from "@/common/components/search/TableSearchDateTimePicker.vue"
import TableSearchInput from "@/common/components/search/TableSearchInput.vue"
import TableSearchSelect from "@/common/components/search/TableSearchSelect.vue"
import {priorityType} from "@/constant/TestCase"

export default {
  TableSearchInput,
  TableSearchDatePicker,
  TableSearchDateTimePicker,
  TableSearchSelect
}
export const OPERATORS = {
  LIKE: {
    label: "包含",
    value: "like"
  },
  NOT_LIKE: {
    label: "不包含",
    value: "not like"
  },
  IN: {
    label: "属于",
    value: "in"
  },
  NOT_IN: {
    label: "不属于",
    value: "not in"
  },
  GT: {
    label: "大于",
    value: "gt"
  },
  GE: {
    label: "大于等于",
    value: "ge"
  },
  LT: {
    label: "小于",
    value: "lt"
  },
  LE: {
    label: "小于等于",
    value: "le"
  },
  EQ: {
    label: "等于",
    value: "eq"
  },
  BETWEEN: {
    label: "之间",
    value: "between"
  },
  CURRENT_USER: {
    label: "是当前用户",
    value: "current user"
  },
}

export const NAME = {
  key: "name", // 返回结果Map的key
  name: 'TableSearchInput', // Vue控件名称
  label: '名称', // 显示名称
  operator: { // 运算符设置
    value: OPERATORS.LIKE.value, // 如果未设置value初始值，则value初始值为options[0]
    options: [OPERATORS.LIKE, OPERATORS.NOT_LIKE] // 运算符候选项
  },
}

export const UPDATE_TIME = {
  key: "updateTime",
  name: 'TableSearchDateTimePicker',
  label: '更新时间',
  operator: {
    options: [OPERATORS.BETWEEN, OPERATORS.GT, OPERATORS.GE, OPERATORS.LT, OPERATORS.LE, OPERATORS.EQ]
  },
}
export const PROJECT_NAME = {
  key: "projectName",
  name: 'TableSearchInput',
  label: '所属项目',
  operator: {
    options: [OPERATORS.LIKE, OPERATORS.NOT_LIKE]
  },
}
export const TEST_NAME = {
  key: "testName",
  name: 'TableSearchInput',
  label: '所属测试',
  operator: {
    options: [OPERATORS.LIKE, OPERATORS.NOT_LIKE]
  },
}
export const CREATE_TIME = {
  key: "createTime",
  name: 'TableSearchDateTimePicker',
  label: '创建时间',
  operator: {
    options: [OPERATORS.BETWEEN, OPERATORS.GT, OPERATORS.GE, OPERATORS.LT, OPERATORS.LE, OPERATORS.EQ]
  },
}

export const STATUS = {
  key: "status",
  name: 'TableSearchSelect',
  label: '状态',
  operator: {
    options: [OPERATORS.IN, OPERATORS.NOT_IN]
  },
  options: [
    {label: "Saved", value: "Saved"}, {label: "Starting", value: "Starting"},
    {label: "Running", value: "Running"}, {label: "Reporting", value: "Reporting"},
    {label: "Completed", value: "Completed"}, {label: "Error", value: "Error"},
    {label: "Success", value: "Success"}
  ],
  props: { // 尾部控件的props，一般为element ui控件的props
    multiple: true
  }
}

export const CREATOR = {
  key: "creator",
  name: 'TableSearchSelect',
  label: '创建人',
  operator: {
    options: [OPERATORS.IN, OPERATORS.NOT_IN, OPERATORS.CURRENT_USER],
    change: function (component: { value: any }, value: string) { // 运算符change事件
      if (value === OPERATORS.CURRENT_USER.value) {
        component.value = value
      }
    }
  },
  options: { // 异步获取候选项
    url: "/user/list",
    labelKey: "name",
    valueKey: "id",
    showLabel: (option: { label: string; value: string }) => {
      return option.label + "(" + option.value + ")"
    }
  },
  props: {
    multiple: true
  },
  isShow: (operator: string) => {
    return operator !== OPERATORS.CURRENT_USER.value
  }
}

export const EXECUTOR = {
  key: "executor",
  name: 'TableSearchSelect',
  label: '执行人',
  operator: {
    options: [OPERATORS.IN, OPERATORS.NOT_IN, OPERATORS.CURRENT_USER],
    change: function (component: { value: any }, value: string) { // 运算符change事件
      if (value === OPERATORS.CURRENT_USER.value) {
        component.value = value
      }
    }
  },
  options: { // 异步获取候选项
    url: "/user/list",
    labelKey: "name",
    valueKey: "id",
    showLabel: (option: { label: string; value: string }) => {
      return option.label + "(" + option.value + ")"
    }
  },
  props: {
    multiple: true
  },
  isShow: (operator: string) => {
    return operator !== OPERATORS.CURRENT_USER.value
  }
}

export const TRIGGER_MODE = {
  key: "triggerMode",
  name: 'TableSearchSelect',
  label: 'commons.trigger_mode.name',
  operator: {
    options: [OPERATORS.IN, OPERATORS.NOT_IN]
  },
  options: [
    {label: "commons.trigger_mode.manual", value: "MANUAL"},
    {label: "commons.trigger_mode.schedule", value: "SCHEDULE"},
    {label: "commons.trigger_mode.api", value: "API"}
  ],
  props: {
    multiple: true
  }
}


export const PRIORITY = {
  key: "priority",
  name: 'TableSearchSelect',
  label: "用例等级",
  operator: {
    options: [OPERATORS.IN, OPERATORS.NOT_IN]
  },
  options: Object.entries(priorityType).map(([value, label]) => {
    return {label: label, value: value}
  }),
  props: {
    multiple: true
  }
}

export const TYPE = {
  key: "type",
  name: 'TableSearchSelect',
  label: "test_track.case.type",
  operator: {
    options: [OPERATORS.IN, OPERATORS.NOT_IN]
  },
  options: [
    {label: 'commons.functional', value: 'functional'},
    {label: 'commons.performance', value: 'performance'},
    {label: 'commons.api', value: 'api'}
  ],
  props: {
    multiple: true
  }
}

export const METHOD = {
  key: "method",
  name: 'TableSearchSelect',
  label: "test_track.case.method",
  operator: {
    options: [OPERATORS.IN, OPERATORS.NOT_IN]
  },
  options: [
    {label: 'test_track.case.manual', value: 'manual'},
    {label: 'test_track.case.auto', value: 'auto'}
  ],
  props: {
    multiple: true
  }
}

export const MODULE = {
  key: "module",
  name: 'TableSearchInput',
  label: "所属模块",
  operator: {
    value: OPERATORS.LIKE.value,
    options: [OPERATORS.LIKE, OPERATORS.NOT_LIKE]
  },
}

export const PRINCIPAL = {
  key: "principal",
  name: 'TableSearchSelect',
  label: 'test_track.plan.plan_principal',
  operator: {
    options: [OPERATORS.IN, OPERATORS.NOT_IN, OPERATORS.CURRENT_USER],
    change: function (component: { value: any }, value: string) { // 运算符change事件
      if (value === OPERATORS.CURRENT_USER.value) {
        component.value = value
      }
    }
  },
  options: { // 异步获取候选项
    url: "/user/list",
    labelKey: "name",
    valueKey: "id",
    showLabel: (option: { label: string; value: string }) => {
      return option.label + "(" + option.value + ")"
    }
  },
  props: {
    multiple: true
  },
  isShow: (operator: string) => {
    return operator !== OPERATORS.CURRENT_USER.value
  }
}

export const STAGE = {
  key: "stage",
  name: 'TableSearchSelect',
  label: "test_track.plan.plan_stage",
  operator: {
    options: [OPERATORS.IN, OPERATORS.NOT_IN]
  },
  options: [
    {label: 'test_track.plan.smoke_test', value: 'smoke'},
    {label: 'test_track.plan.regression_test', value: 'regression'},
    {label: 'test_track.plan.system_test', value: 'system'}
  ],
  props: {
    multiple: true
  }
}

export const TEST_PLAN_STATUS = {
  key: "status",
  name: 'TableSearchSelect',
  label: "test_track.plan.plan_status",
  operator: {
    options: [OPERATORS.IN, OPERATORS.NOT_IN]
  },
  options: [
    {label: 'test_track.plan.plan_status_prepare', value: 'Prepare'},
    {label: 'test_track.plan.plan_status_running', value: 'Underway'},
    {label: 'test_track.plan.plan_status_completed', value: 'Completed'}
  ],
  props: {
    multiple: true
  }
}

export const TEST_CONFIGS = [NAME, UPDATE_TIME, PROJECT_NAME, CREATE_TIME, STATUS, CREATOR]

export const REPORT_CONFIGS = [NAME, TEST_NAME, PROJECT_NAME, CREATE_TIME, STATUS, CREATOR, TRIGGER_MODE]

export const TEST_CASE_CONFIGS = [NAME, MODULE, PRIORITY, CREATE_TIME]
// export const TEST_CASE_CONFIGS = [NAME, MODULE, PRIORITY, CREATE_TIME, TYPE, UPDATE_TIME, METHOD, CREATOR, EXECUTOR]

export const TEST_PLAN_CONFIGS = [NAME, UPDATE_TIME, PROJECT_NAME, CREATE_TIME, PRINCIPAL, TEST_PLAN_STATUS, STAGE]
