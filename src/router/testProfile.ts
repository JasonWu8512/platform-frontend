import {PathName} from "@/constant/routeData"
import ProfileReview from "@/pages/track/profile/TestProfile.vue"

export default [
  {
    path: 'testProfile/event/list',
    name: PathName.TestTrackProfileReview,
    component: ProfileReview,
    meta: {isUsingSocketInfo: true},
  }
]
