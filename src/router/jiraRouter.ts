import {PathName} from "@/constant/routeData"
import monthReport from "@/pages/jira/MonthReport.vue"
import projectTolerance from "@/pages/jira/projectTolerance.vue"
import VersionReport from "@/pages/jira/VersionReport.vue"

export default [
  // 版本报告
  {
    path: '/versionReport',
    name: PathName.VersionReport,
    component: VersionReport,
    meta: {isUsingSocketInfo: true},
  },
  // 月度报告
  {
    path: '/monthReport',
    name: PathName.MonthReport,
    component: monthReport,
    meta: {isUsingSocketInfo: true},
  },
  // 项目度量
  {
    path: '/projectTolerance',
    name: PathName.ProjectTolerance,
    component: projectTolerance,
    meta: {isUsingSocketInfo: true},
  }
]
