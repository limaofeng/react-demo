/**
 * 获取序号
 * @func getOrder
 * @param {object} [{page, per_page}] 包含当前页数和每页总数
 * @param {index} index 索引
 * @return {int} 序号
 */

export function getOrder(data, index) {
  const { page, per_page } = data;
  const order = (page - 1) * per_page + index + 1;
  return order;
}

/**
 * 过滤数据
 * @param {object} [datas] 需要过滤的数据
 * @param {array} [filters] 需要过滤的字段
 * @param {boolean} [isObject] 是否返回object,默认array
 */
export function filterHandle(datas, filters, isObject) {
  const resultArray = Object.keys(datas)
    .map(key => {
      for (const filter of filters) {
        if (key === filter) {
          return '';
        }
      }
      return { [key]: datas[key] };
    })
    .filter(v => v);

  const resultObject = {};

  if (isObject) {
    for (const data of resultArray) {
      Object.keys(data).forEach(key => (resultObject[key] = data[key]));
    }
    return resultObject;
  }
  return resultArray;
}

/**
 * 获取登陆用户信息
 * @param {string} [key] 需要或者key的值
 * @return {object|string} 返回用户所有或某个信息
 */
export function getUser(key) {
  const user = getLocalStortage('zbsg_admin_auth');
  const result = {};
  for (const key in user) {
    result[key] = user[key];
  }
  result.username = user.nickName || '';
  if (key) {
    return result[key];
  }
  return result;
}

/**
 * 获取localStorage值
 */
export function getLocalStortage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    console.error('localStorage get error');
  }
}

/**
 * 添加数据并更新列表
 * @param {object} [search, pager] 查询方法，是否包含pager对象
 */
export function updateList(props) {
  const { search, pager } = props;
  if (pager) {
    search({ current: 1 }, [], {});
  }
}

// 处理富文本编辑器制表符为空格
export function filterTAB(introduction = '') {
  return introduction.replace(/\t/g, '    ');
}

// 获取货物状态
export function getInvoiceStatus(key) {
  switch (key) {
    case 'create':
      return '新增';
      break;
    case 'pickFinsh':
      return '拣货完成';
      break;
    case 'pichPart':
      return '部分拣货';
      break;
    case 'reviewFinsh':
      return '复核完成';
      break;
    case 'reviewPart':
      return '部分复核';
      break;
    case 'transferFinsh':
      return '交接完成';
      break;
    case 'transferPart':
      return '部分交接';
      break;
    case 'close':
      return '关闭';
      break;
    case 'cancel':
      return '取消';
      break;
    case 'reversePickFinsh':
      return '反确认拣货';
      break;
    default:
      return ' ';
      break;
  }
}
// 筛选文件类型
export function filterDocumentType(key) {
  switch (key) {
    case 'saleOut':
      return '销售出库';
      break;
    case 'purchaseReturn':
      return '采购退货';
      break;
    case 'otherOut':
      return '其他出库';
      break;
    default:
      return ' ';
      break;
  }
}
// 处理传入数据
export function dataProces(value) {
  const filters = [];
  // 判断是否为空出库单号(输入框)
  if (value.depotOutNo) {
    filters.push({
      field: 'depotOutNo',
      matchType: 'like',
      value: value.depotOutNo
    });
  }
  if (value.shipName) {
    filters.push({
      field: 'shipName',
      matchType: 'like',
      value: value.shipName
    });
  }
  if (value.orderNo) {
    filters.push({
      field: 'orderNo',
      matchType: 'like',
      value: value.orderNo
    });
  }
  if (value.shipMobile) {
    filters.push({
      field: 'shipMobile',
      matchType: 'like',
      value: value.shipMobile
    });
  }

  // 判断是否寻选择框是否为空
  if (value.depotBillType) {
    filters.push({
      field: 'depotBillType',
      matchType: '',
      value: value.depotBillType
    });
  }
  if (value.ProductSize) {
    filters.push({
      field: 'depotOutItems.productType.',
      matchType: 'like',
      value: value.ProductSize
    });
  }
  if (value.depotOutStatus) {
    filters.push({
      field: 'depotOutStatus',
      matchType: 'like',
      value: value.depotOutStatus
    });
  }

  // 判断日期框
  function dataGet(value, type) {
    if (value[type]) {
      const startDay = `${value[type][0]._d.getFullYear()}-${value[type][0]._d.getMonth() + 1}-${value[
        type
      ][0]._d.getDate()}`;
      const endDay = `${value[type][1]._d.getFullYear()}-${value[type][1]._d.getMonth() + 1}-${value[
        type
      ][1]._d.getDate()}`;
      filters.push({
        field: `${type}`,
        matchType: 'between',
        value: `${startDay}~${endDay}`
      });
    }
  }
  dataGet(value, 'createTime');
  dataGet(value, 'pickTime');
  dataGet(value, 'reviewTime');
  dataGet(value, 'transferTime');
  dataGet(value, 'depotOutTime');

  return filters;
}

export function formatDateTime(inputTime) {
  const date = new Date(inputTime);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? `0${m}` : m;
  let d = date.getDate();
  d = d < 10 ? `0${d}` : d;
  let h = date.getHours();
  h = h < 10 ? `0${h}` : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  minute = minute < 10 ? `0${minute}` : minute;
  second = second < 10 ? `0${second}` : second;
  return `${y}-${m}-${d} ${h}:${minute}:${second}`;
}
