export enum businessEnum {
  JLGL = 'jlgl',
  TRADE = 'trade',
  OMO = 'omo',
  READING = 'reading',
  CRM = 'crm',
  DATA = 'data',
  COURSE = 'course',
}

export const businessType = {
  [businessEnum.JLGL]: '叽里呱啦',
  [businessEnum.TRADE]: '交易中台',
  [businessEnum.OMO]: '增长中台',
  [businessEnum.READING]: '呱呱阅读',
  [businessEnum.CRM]: 'Crm',
  [businessEnum.DATA]: '数仓/AI',
  [businessEnum.COURSE]: '课程中台'
}

export enum terminalEnum {
  FE = 'FE',
  BE = 'BE',
  ME = 'ME',
}

export const terminalType = {
  [terminalEnum.BE]: '后端',
  [terminalEnum.FE]: '前端',
  [terminalEnum.ME]: '移动端',
}
