import {PathName} from "@/constant/routeData"
import testCaseReview from "@/pages/track/review/TestCaseReview.vue"
import testCaseReviewView from "@/pages/track/review/view/TestCaseReviewView.vue"

export default [
  {
    path: "testCaseReview/list",
    name: PathName.TestTrackCaseReview,
    component: testCaseReview,
    meta: {isUsingSocketInfo: true},
  },
  {
    path: 'testCaseReview/:reviewId?',
    name: PathName.TestTrackCaseReviewView,
    component: testCaseReviewView,
    meta: {isUsingSocketInfo: true},
  },
]
