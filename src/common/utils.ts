export function formatTime(time: string | undefined | null, fmt: string = 'yyyy-MM-dd hh:mm:ss') {
  if (!time) return ''
  // @ts-ignore
  return new Date(time).format(fmt)
}

// @ts-ignore
Date.prototype.format = function (fmt: string) {
  let o = {
    "M+": this.getMonth() + 1,                      //月份
    "d+": this.getDate(),                           //日
    "h+": this.getHours(),                          //小时
    "m+": this.getMinutes(),                        //分
    "s+": this.getSeconds(),                        //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()                     //毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        // @ts-ignore
        (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))
      )
    }
  }

  return fmt
}

export function datePickerOptionsStart(pickerOptions: any = {}) {
  const now = new Date().getTime()
  pickerOptions = Object.assign({}, pickerOptions, {
    disabledDate: (time: Date) => {
      return time.getTime() < now
    }
  })
  return pickerOptions
}

//表格数据过滤
export function _filter(filters: Object, filterList: Object, key: string) {
  if (!filterList) {
    filterList = {}
  }
  Object.assign(filterList, filters)
  sessionStorage.setItem(key, JSON.stringify(filterList))
  // for (let key in filters) {
  //   if (filters.hasOwnProperty(key)) {
  //     Object.assign()
  //     filterList[key] = filters[key]
  //   }
  // }
}

//表格数据排序
// export function _sort(column, condition) {
//   column.prop = humpToLine(column.prop);
//   if (column.order === 'descending') {
//     column.order = 'desc';
//   } else {
//     column.order = 'asc';
//   }
//   if (!condition.orders) {
//     condition.orders = [];
//   }
//   let hasProp = false;
//   condition.orders.forEach(order => {
//     if (order.name === column.prop) {
//       order.type = column.order;
//       hasProp = true;
//     }
//   });
//   if (!hasProp) {
//     condition.orders.push({name: column.prop, type: column.order});
//   }
// }

export function goodDuration(duration: string | number | Date) {
  let date = new Date(duration)
  if (duration === 0) {
    return `0s`
  } else if (duration < 1000) {
    return `${date.getMilliseconds()}ms`
  } else if (duration === 1000) {
    return `1s`
  } else if (1000 < duration && duration < 60 * 1000) {
    return `${date.getSeconds()}s ${date.getMilliseconds()}ms`
  } else if (duration === 60 * 1000) {
    return `1m`
  } else if (60 * 1000 < duration && duration < 60 * 60 * 1000) {
    return `${date.getMinutes()}m ${date.getSeconds()}s`
  } else {
    return `${date.getHours()}h ${date.getMinutes()}m ${date.getSeconds()}s`
  }
}
