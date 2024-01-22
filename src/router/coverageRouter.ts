import {PathName} from "@/constant/routeData"
import BuildConsole from "@/pages/coverage/components/BuildConsole.vue"
import DeployServerRecord from "@/pages/coverage/DeployServerRecord.vue"
import GitLabProjectBranches from "@/pages/coverage/GitLabProjectBranches.vue"
import GitLabProjects from "@/pages/coverage/GitLabProjects.vue"
import Pipeline from "@/pages/coverage/PipeLine.vue"
import PipelineBuildRecord from "@/pages/coverage/PipelineBuildRecord.vue"
import FullCoverageTrend from "@/pages/coverage/FullCoverageTrend.vue"
import FullSonar from "@/pages/coverage/FullSonar.vue"

export default [
  // 分支管理
  // git工程列表
  {
    path: 'gitLab/projects',
    name: PathName.GitLabProjects,
    component: GitLabProjects,
  },
  // git project 的分支列表
  {
    path: 'gitLab/project/branches',
    name: PathName.GitLabProjectBranches,
    component: GitLabProjectBranches,
  },
  // 覆盖率
  // 流水线列表
  {
    path: '/coverage/pipeline/list',
    name: PathName.Pipeline,
    component: Pipeline,
    meta: {isUsingSocketInfo: true},
  },
  // 工程覆盖率趋势
  {
    path: '/coverage/pipeline/report/trend',
    name: PathName.PipelineFullCoverageTrend,
    component: FullCoverageTrend,
  },
  // 覆盖率构建历史
  {
    path: '/coverage/pipeline/build/record',
    name: PathName.PipelineBuildRecord,
    component: PipelineBuildRecord,
    meta: {isUsingSocketInfo: false}
  },
  // 指定一条流水线的构建历史
  {
    path: '/coverage/pipeline/build/record/:pipelineId',
    name: PathName.PipelineBuildRecordByPipelineId,
    component: PipelineBuildRecord,
    meta: {isUsingSocketInfo: false}
  },
  // 服务端发版历史
  {
    path: '/coverage/pipeline/server/build/record',
    name: PathName.PipelineServerBuildRecord,
    component: DeployServerRecord,
    meta: {isUsingSocketInfo: false}
  },
  // 指定一条流水线的服务端发版历史
  {
    path: '/coverage/pipeline/server/build/record/:pipelineId',
    name: PathName.PipelineServerBuildRecordByPipelineId,
    component: DeployServerRecord,
    meta: {isUsingSocketInfo: false}
  },
  // jenkins构建日志
  {
    path: '/coverage/pipeline/console/:pipelineId',
    name: PathName.PipelineBuildConsole,
    component: BuildConsole,
    meta: {isUsingSocketInfo: false}
  },
  // sonar构建情况
  {
    path: '/coverage/sonar',
    name: PathName.FullSonar,
    component: FullSonar,
  }
]
