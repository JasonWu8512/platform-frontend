import {PAGINATION_SIZE} from "@/constant"

export interface PublicResourceList {
  offset?: number,
  limit?: typeof PAGINATION_SIZE,
}
