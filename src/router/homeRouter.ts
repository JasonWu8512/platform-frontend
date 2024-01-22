import {PathName} from "@/constant/routeData";
import dashboard from "@/pages/dashboard/index.vue";
import selfPassword from "@/pages/login/selfPassword.vue";

export default [
  // Dashboard
  {
    path: '/dashboard',
    name: PathName.Dashboard,
    component: dashboard,
    meta: {isUsingSocketInfo: true},
  },
  //    修改密码
  {
    path: '/password',
    name: PathName.SelfPassword,
    component: selfPassword
  },
]
