export interface RequestGetTestEpics {
  /**
   * @default: QA
   */
  search: string,
  /**
   * epic keys
   */
  epics: string,
}

export interface ResponseGetTestEpics {
  /**
   * epic key
   */
  key: string,
  /**
   * epic 名称
   */
  summary: string,
}

export type typeJiraProject = {
  /**
   * id
   */
  id: string,
  /**
   * key
   */
  key: string,
  /**
   * name
   */
  name: string,
}
