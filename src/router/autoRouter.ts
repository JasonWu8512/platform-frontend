import {PathName} from "@/constant/routeData"
import AutoConfigBuildRecord from "@/pages/auto/AutoConfigBuildRecord.vue"
import AutoConfigList from "@/pages/auto/AutoConfigList.vue"
import AutoReport from "@/pages/auto/components/AutoReport.vue"

export default [
  // 覆盖率
  {
    path: '/auto/config/list',
    name: PathName.AutoConfig,
    component: AutoConfigList,
    meta: {isUsingSocketInfo: true},
  },
  {
    path: '/auto/config/build/record',
    name: PathName.AutoCaseBuildRecord,
    component: AutoConfigBuildRecord,
    meta: {isUsingSocketInfo: false}
  },
  {
    path: '/auto/config/build/record/:configId',
    name: PathName.AutoCaseBuildRecordByConfigId,
    component: AutoConfigBuildRecord,
    meta: {isUsingSocketInfo: false}
  },
  {
    path: '/auto/build/report/:historyId',
    name: PathName.AutoCaseReport,
    component: AutoReport,
    meta: {isUsingSocketInfo: false}
  }
]
