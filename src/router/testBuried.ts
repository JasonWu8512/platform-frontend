import {PathName} from "@/constant/routeData"
import EventReview from "@/pages/track/buried/TestBuried.vue"

export default [
  {
    path: 'testBuried/event/list',
    name: PathName.TestTrackBuriedDataReview,
    component: EventReview,
    meta: {isUsingSocketInfo: true},
  }
]
