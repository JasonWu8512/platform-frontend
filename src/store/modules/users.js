import {userApi} from "@/api"

export const SET_USERS = 'SET_USERS'

export default {
  state: {
    users: [],
    socketInfo: {
      usersUpdate: false,
    }
  },
  mutations: {
    [SET_USERS](state, users) {
      state.users = users
      state.socketInfo.usersUpdate = true
    },
  },
  actions: {
    async GET_USER({commit}) {
      await userApi.getUserBySearch()
        .then(({data}) => {
          data.forEach((obj) => {
            obj.text = obj.username
            obj.value = obj.username
          })
          commit(SET_USERS, data)
        })
    }
  }
}
