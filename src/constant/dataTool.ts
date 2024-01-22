// 不同科目对应的sp2xuId
export enum SpuClass {
  ENGLISH_ESHOP = 'eshop_3696',
  MATC_ESHOP = 'eshop_3697',
  ENGLISH_SAMPLE = 'mars_2819',
  MATC_SAMPLE = 'mars_2821',
  EMGLISH_MATC = 'mars_3388',
  ENGLISH_MONTH = 'eshop_3698',
}

export const ClassType = {
  [SpuClass.ENGLISH_ESHOP]: '英语正价课',
  [SpuClass.MATC_ESHOP]: '思维正价课',
  [SpuClass.ENGLISH_SAMPLE]: '英语体验课',
  [SpuClass.MATC_SAMPLE]: '思维体验课',
  [SpuClass.EMGLISH_MATC]: '联报体验课',
  [SpuClass.ENGLISH_MONTH]: '英语双月课',
}

export const SubjectType = {
  [SpuClass.ENGLISH_SAMPLE]: '英语',
  [SpuClass.MATC_SAMPLE]: '思维',
  [SpuClass.EMGLISH_MATC]: '英语+思维',
}

export enum Account {
  NEW_TURN= 'newTurn',
  PROMOTER = 'promoter',
  APP_NEW_USER = 'appNewUser',
  GETC_NEW = 'getcNew',
  MATC_NEW = 'matcNew',
  OLD_TURN = 'oldTurn',
  ENGLISH_128_AGE = '1001004',
  BABY_USER = 'bd_mobile_user',
  BABY_GUEST = 'bd_guest_user'
}

export const AccountType = {
  [Account.NEW_TURN]: '新机转',
  [Account.PROMOTER]: '推广人',
  [Account.APP_NEW_USER]: 'App全新用户',
  [Account.GETC_NEW]: '可购买9.9英语',
  [Account.MATC_NEW]: '可购买9.9思维',
  [Account.OLD_TURN]: '支持导流到老机转',
  [Account.ENGLISH_128_AGE]: '128英语(3岁)',
  [Account.BABY_USER]: 'bd手机号用户',
  [Account.BABY_GUEST]: 'bd游客用户'
}


export enum DataEnum {
  // REVIEW_PASS = 'reviewPass',
  RE_PURCHASE = 'rePurchase',
}

export const DataType = {
  // [DataEnum.REVIEW_PASS]: '复习闯关',
  [DataEnum.RE_PURCHASE]: '复购',
}

export enum ChannelEnum {
  TGR = '0',
  SATURN = '1',
  NOSTANDARD_GROUND = '2'
}

export const ChannelType = {
  [ChannelEnum.TGR]: '转推',
  [ChannelEnum.SATURN]: '下沉',
  [ChannelEnum.NOSTANDARD_GROUND]: '地推'
}

// 转推关系中科目对应的数据库字段
export enum SubEnum {
  ENGLISH = 0,
  MATC = 1,
  ENG_MATC = 2
}

export const SubType = {
  [SubEnum.ENGLISH]: '英语',
  [SubEnum.MATC]: '思维',
  [SubEnum.ENG_MATC]: '英语+思维'
}

export enum FanEnum {
  VALID_FAN = '0',
  INVALID_FAN = '-1'
}

export const FanType = {
  [FanEnum.VALID_FAN]: '有效锁粉',
  [FanEnum.INVALID_FAN]: '无效锁粉'
}
