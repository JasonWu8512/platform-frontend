import jiraApi from "@/api/jira"
import {typeJiraProject} from "@/api/types/jira"

const CHANGE_PROJECT = 'CHANGE_PROJECT'
const CHANGE_PROJECT_SPRINT = 'CHANGE_PROJECT_SPRINT'
const SET_MONTH = 'SET_MONTH'


export default {
  state: {
    projects: [typeJiraProject],
    projectSprints: [],
    defaultMonth: '',
    socketInfo: {
      projectsUpdate: false,
    }
  },
  mutations: {
    [CHANGE_PROJECT](state, projects) {
      state.projects = projects
      state.socketInfo.projectsUpdate = true
    },
    [CHANGE_PROJECT_SPRINT](state, projectSprints) {
      state.projectSprints = projectSprints
      state.socketInfo.projectsSprintUpdate = true
    },
    [SET_MONTH](state, defaultMonth) {
      state.defaultMonth = defaultMonth
    }
  },
  actions: {
    async GET_PROJECT({commit}) {
      await jiraApi.getAllProject()
        .then(({data}) => {
          data.datas.forEach(item => {
            item.text = item.name
            item.value = item.id
          })
          commit('CHANGE_PROJECT', data.datas)
        })
    },
    async GET_PROJECT_CLOSED_SPRINT({commit}) {
      await jiraApi.getAllProject({closed: 1}).then(({data}) => {
        commit('CHANGE_PROJECT_SPRINT', data.datas)
      })
    },
  }
}
