export enum PathName {
  // 首页
  Home = 'home',
  // Dashboard
  Dashboard = 'dashboard',


  // 测试跟踪
  TestTrack = 'test_track',
  // 项目
  TestTrackProject = 'test_track_project',
  // 测试用例项目
  TestTrackTestcaseProject = 'test_track_testcase_project',
  // 测试用例模块
  TestTrackTestcaseModule = 'test_track_testcase_module',
  // 用例评审
  TestTrackCaseReview = 'test_track_case_review',
  // 用例评审详情
  TestTrackCaseReviewView = 'test_track_case_review_view',
  // 冒烟用例计划
  TestTrackCasePlan = 'test_track_case_plan_smoke',
  TestTrackNotSmokePlan = 'test_track_case_plan_notsmoke',
  // 用例计划详情
  TestTrackCasePlanView = 'test_track_case_plan_view',
  // 计划报告
  TestTrackCasePlanReport = 'test_track_case_plan_report',
  // 数据埋点
  TestTrackBuriedDataReview = 'test_track_buried_data',
  TestTrackProfileReview = 'test_track_buried_profile',


  // Jira 相关
  // 质量数据
  QualityReport = 'quality_report',
  // 版本报告
  VersionReport = 'version_report',
  // 月度报告
  MonthReport = 'month_report',
  // 项目度量
  ProjectTolerance = 'project_tolerance',


  // 测试工具
  TestTool = 'test_tool',
  // 辅助工具
  Flower = 'flower',
  // pr合并通知
  PrMerged = 'prMerged',
  // jira联动PR配置
  PrMergeJira = 'PrMergeJira',
  // 审批流通知配置
  ApprovalNotify = 'approval_notify',
  // 阿波罗通知配置-国内
  ApolloNotify = 'apollo_notify',
    // 阿波罗通知配置-海外
  ApolloIntlNotify = 'apollo_intl_notify',

  // 数据工厂-国内
  Apollo = 'apollo',
  // 数据工厂-出海
  ApolloIntl = 'apolloIntl',
  //用户配置
  UserConfig = 'userConfig',
  //商品配置
  SpuConfig = 'SpuConfig',
  //订单配置
  OrderConfig = 'OrderConfig',
  //课程配置
  LessonConfig = 'LessonConfig',

  // 组织相关
  //gantt
  UserGantt = 'user_gantt',
  //效能数据
  EfficiencyData = 'efficiency_data',
  //月度资源报告
  MonthResourceReport = 'month_resource_report',
  //冲刺详情
  SprintDetail = 'sprint_detail',
  //冲刺预览
  SprintOverView = 'sprint_over_view',


  // 覆盖率相关
  Pipeline = 'pipeline',
  PipelineFullCoverageTrend = 'pipeline_full_coverage_trend',
  PipelineBuildRecord = 'pipeline_build_record',
  PipelineBuildRecordByPipelineId = 'pipeline_build_record_by_pipelineId',
  PipelineBuildConsole = 'pipeline_build_console',
  PipelineServerBuildRecord = 'pipeline_server_build_record',
  PipelineServerBuildRecordByPipelineId = 'pipeline_server_build_record_by_pipelineId',
  FullSonar = 'full_sonar',
  // git 分支管理
  GitLabProjects = 'git_lab_projects',
  GitLabProjectBranches = 'git_lab_project_branches',

  // 自动化模块相关
  AutoConfig = 'auto_config',
  AutoCaseBuildRecord = 'auto_case_build_record',
  AutoCaseBuildRecordByConfigId = 'auto_case_build_by_configId',
  AutoCaseReport = 'auto_case_report',

  // 修改密码
  SelfPassword = 'self_password',
  // 登录
  Login = 'login',
  // sso登录空白页
  SslLogin = 'ssoLogin',
}
