import {PathName} from "@/constant/routeData"
import testCase from "@/pages/track/case/TestCase.vue"

export default [
  {
    path: 'testCaseProject/:projectId?/',
    name: PathName.TestTrackTestcaseProject,
    component: testCase,
    meta: {isUsingSocketInfo: true, keepAlive: true},
    children: [
      {
        path: 'module/:moduleId?/caseList',
        name: PathName.TestTrackTestcaseModule,
        component: testCase,
        meta: {isUsingSocketInfo: true, keepAlive: true},
      }
    ]
  }
]
