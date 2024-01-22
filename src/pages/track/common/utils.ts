import {typeModuleOption, typeNode} from "@/api/types/testTrackType";
import {decamelize} from "humps";

export function buildNodePath(node: typeNode, option: typeModuleOption, moduleOptions: typeModuleOption[]) {
  // 递归构建节点路径
  option.id = node.id
  option.path = option.path + '/' + node.name
  moduleOptions.push(option)
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      buildNodePath(node.children[i], {id: '', path: option.path}, moduleOptions)
    }
  }
}

export function getModuleOptions(nodes: typeNode[]) {
  let moduleOptions: typeModuleOption[] = []
  nodes.forEach((node: typeNode) => {
    buildNodePath(node, {id: '', path: ''}, moduleOptions)
  })
  sessionStorage.setItem(JSON.stringify(nodes), JSON.stringify(moduleOptions))
  return moduleOptions
}

export function getModuleByTreeId(nodes: typeNode[], nodeId: string): typeModuleOption {
  let tmp = sessionStorage.getItem(JSON.stringify(nodes))
  let moduleOptions: typeModuleOption[]
  if (tmp === null) {
    moduleOptions = getModuleOptions(nodes)
  } else {
    moduleOptions = JSON.parse(tmp)
  }
  const module = moduleOptions.find((moduleOption: typeModuleOption) => moduleOption.id === nodeId)
  return module || {id: '', path: '-'}
}


export function buildUploadFileParams(params: any): FormData {
  let data = new FormData()
  Object.keys(params).forEach((key) => {
    data.append(decamelize(key), params[key])
  })
  return data
}
