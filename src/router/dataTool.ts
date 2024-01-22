import {PathName} from "@/constant/routeData"
import apollo from "@/pages/dataTools/apollo.vue"
import apolloIntl from "@/pages/dataTools/apolloIntl.vue"
import userConfig from "@/pages/dataTools/userConfig.vue";
import spuConfig from "@/pages/dataTools/spuConfig.vue";
import orderConfig from "@/pages/dataTools/orderConfig.vue";
import lessonConfig from "@/pages/dataTools/lessonConfig.vue";

export default [
  {
    path: '/apollo',
    name: PathName.Apollo,
    component: apollo
  },
  {
    path: '/apolloIntl',
    name: PathName.ApolloIntl,
    component: apolloIntl
  },
  {
    path: '/userConfig',
    name: PathName.UserConfig,
    component: userConfig,
  },
  {
    path: '/spuConfig',
    name: PathName.SpuConfig,
    component: spuConfig,
  },
  {
    path: '/orderConfig',
    name: PathName.OrderConfig,
    component: orderConfig,
  },
  {
    path: '/lessonConfig',
    name: PathName.LessonConfig,
    component: lessonConfig,
  },
]
