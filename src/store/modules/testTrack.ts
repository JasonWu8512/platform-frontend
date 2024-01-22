import {typeNodeData} from "@/api/types/testTrackType"

export const SET_MODULE_TREE = 'SET_MODULE_TREE'


export default {
  state: {
    treeNodes: [],
    socketInfo: {
      treeNodesUpdate: false,
    }
  },
  mutations: {
    [SET_MODULE_TREE](state: any, treeNodes: typeNodeData[]) {
      state.treeNodes = treeNodes
      state.socketInfo.treeNodesUpdate = true
    },
  },
}
