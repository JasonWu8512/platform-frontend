import {PathName} from "@/constant/routeData"
import testProject from "@/pages/track/project/trackProject.vue"

export default [
  {
    path: 'project',
    name: PathName.TestTrackProject,
    component: testProject,
    meta: {isUsingSocketInfo: true},
  }
]
