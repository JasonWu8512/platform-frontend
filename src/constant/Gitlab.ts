// 用例树操作属性
export enum operationEnum {
  ADD = 'add',
  EDIT = 'edit',
  VIEW = 'view',
}

export const operationType = {
  [operationEnum.ADD]: '新建用例',
  [operationEnum.EDIT]: '编辑用例',
  [operationEnum.VIEW]: '查看用例',
}
