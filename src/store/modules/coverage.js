import {coverageApi, organizationApi} from "@/api";
import {typeLarkChat} from "@/api/types/lark"

export const SET_GITPROJECT = 'SET_GITPROJECT'
export const SET_CHATS = 'SET_CHATS'

export default {
  state: {
    gitProjects: [],
    larkChats: [typeLarkChat],
    socketInfo: {
      gitprojectUpdate: false,
      larkChatsUpdate: false,
    },
  },
  mutations: {
    [SET_GITPROJECT](state, gitProjects) {
      state.gitProjects = gitProjects
      state.socketInfo.gitprojectUpdate = true
    },
    [SET_CHATS](state, larkChats) {
      state.larkChats = larkChats
      state.socketInfo.larkChatsUpdate = true
    }
  },
  actions: {
    async GET_GITPROJECT({commit}) {
      await coverageApi.getAllGitProjects()
        .then(res => {
          commit(SET_GITPROJECT, res.data)
        })
    },
    async GET_LARKCHATS({commit}) {
      await  organizationApi.getLarkRobotChats().then(res => {
        commit(SET_CHATS, res.data)
      })
    }
  }
}
