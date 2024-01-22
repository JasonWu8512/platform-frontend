import {PathName} from "@/constant/routeData"
import MonthResourceReport from "@/pages/Team/components/MonthResourceReport.vue"
import efficiency from "@/pages/Team/Efficiency.vue"
import organization from "@/pages/Team/Organization.vue"
import SprintDetail from "@/pages/Team/SprintDetails.vue"
import sprintOverview from "@/pages/Team/sprintOverview.vue"


export default [
  // 甘特图
  {
    path: '/user/gantt',
    name: PathName.UserGantt,
    component: organization,
    meta: {isUsingSocketInfo: true},
  },
  {
    path: '/efficiency/data',
    name: PathName.EfficiencyData,
    component: efficiency,
    meta: {isUsingSocketInfo: true},
  },
  {
    path: '/month/resource/report',
    name: PathName.MonthResourceReport,
    component: MonthResourceReport,
    meta: {isUsingSocketInfo: true},
  },
  {
    path: '/sprint/detail',
    name: PathName.SprintDetail,
    component: SprintDetail,
    meta: {isUsingSocketInfo: true}
  },
  {
    path: '/sprint/overview',
    name: PathName.SprintOverView,
    component: sprintOverview
  }
]
