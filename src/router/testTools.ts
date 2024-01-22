import {PathName} from "@/constant/routeData"
import approvalNotify from "@/pages/testTools/approvalNotify.vue"
import flower from '@/pages/testTools/flower.vue'
import testTools from '@/pages/testTools/index.vue'
import prMergeConfig from "@/pages/testTools/prMergeConfig.vue"
import prMergedNotify from "@/pages/testTools/prMergedNotify.vue"
import apolloNotify from "@/pages/testTools/apolloNotify.vue";
import apolloIntlNotify from "@/pages/testTools/apolloIntlNotify.vue";

export default [
  {
    path: '/testTool',
    name: PathName.TestTool,
    component: testTools
  },
  {
    path: '/flower',
    name: PathName.Flower,
    component: flower
  },
  {
    path: '/prMerged',
    name: PathName.PrMerged,
    component: prMergedNotify,
    meta: {isUsingSocketInfo: true},
  },
  {
    path: '/PrMergeJira',
    name: PathName.PrMergeJira,
    component: prMergeConfig,
    meta: {isUsingSocketInfo: true},
  },
  {
    path: '/ApprovalNotify',
    name: PathName.ApprovalNotify,
    component: approvalNotify,
    meta: {isUsingSocketInfo: true},
  },
  {
    path: '/ApolloNotify',
    name: PathName.ApolloNotify,
    component: apolloNotify,
    meta: {isUsingSocketInfo: true},
  },
  {
    path: '/ApolloIntlNotify',
    name: PathName.ApolloIntlNotify,
    component: apolloIntlNotify,
    meta: {isUsingSocketInfo: true},
  }
]
