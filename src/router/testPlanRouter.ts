import {PathName} from "@/constant/routeData"
import smokeTestPlan from "@/pages/track/plan/SmokeTestPlan.vue"
import testPlan from "@/pages/track/plan/TestPlan.vue"
import testPlanView from "@/pages/track/plan/view/TestPlanView.vue"

export default [
  {
    path: 'testCasePlan/smoke/list',
    name: PathName.TestTrackCasePlan,
    component: smokeTestPlan,
    meta: {isUsingSocketInfo: true},
  },
  {
    path: 'testCasePlan/notSmoke/list',
    name: PathName.TestTrackNotSmokePlan,
    component: testPlan,
    meta: {isUsingSocketInfo: true}
  },
  {
    path: 'testCasePlan/:planId',
    name: PathName.TestTrackCasePlanView,
    component: testPlanView,
    meta: {isUsingSocketInfo: true},
  }
]
