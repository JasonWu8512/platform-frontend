export interface RequestCreateAutoConfig {
  // 配置 id
  id?: string,
  // 配置名称
  name: string,
  // 配置标签
  tags?: string,
  // 通知群id
  notify_chat_ids?: string[],
  // 定时表达式
  crontab_schedule?: string,
  // 是否开启定时
  enable_auto_trigger: boolean,
  // 指定用例
  case?: string[],
  // 关联流水线id
  pipeline_id?: number
}

export interface RequestGetAutoConfigList {
  offset: number,
  limit: number,
  // 配置名称
  name?: string
}
