import {PathName} from "@/constant/routeData"
import testTrack from "@/pages/track/TestTrack.vue"
import testBuried from "@/router/testBuried"
import testCaseRouter from "@/router/testCaseRouter"
import testPlanRouter from "@/router/testPlanRouter"
import testProfile from "@/router/testProfile"
import testProjectRouter from "@/router/testProjectRouter"
import testReviewRouter from "@/router/testReviewRouter"

export default [
  {
    path: "/testTrack",
    name: PathName.TestTrack,
    component: testTrack,
    children: [
      ...testProjectRouter,
      ...testCaseRouter,
      ...testReviewRouter,
      ...testPlanRouter,
      ...testBuried,
      ...testProfile,
    ],
  },
]
