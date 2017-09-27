/* eslint no-plusplus: 0 */
/* eslint one-var: 0 */
/* eslint no-eval: 0 */
/* eslint no-mixed-operators: 0 */
/* eslint consistent-return: 0 */
/* eslint no-throw-literal: 0 */
/* eslint no-useless-escape: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-new-func: 0 */
/* eslint max-len:0 */

const trimRe = /^\s+|\s+$/g;
const stripTagsRE = /<\/?[^>]+>/gi;

/**
 * 对大于指定长度部分的字符串，进行裁剪，增加省略号（“...”）的显示。
 * @param {String} value 要裁剪的字符串
 * @param {Number} len 允许的最大长度
 * @param {Boolean} word True表示尝试以一个单词来结束
 * @return {String} 转换后的文本
 */
export const ellipsis = (value, len, word) => {
  let ivalue = defaultValue(value, '');
  const iword = defaultValue(word, '');
  let ilen = len;
  if (this.length(ivalue) <= ilen) {
    return ivalue;
  }
  ilen -= this.length(iword);
  do {
    ivalue = ivalue.substr(0, ivalue.length - 1);
  } while (this.length(ivalue) > len);
  return ivalue + iword;
};

export const length = value => value.replace(/[^\x00-\xff]/g, 'rr').length;

/**
 *检查一个引用值是否为underfined，若是的话转换其为空值。
 * @param value 要检查的值
 * @returns {*} 转换成功为空白字符串，否则为原来的值
 */
export const undef = value => (value !== undefined ? value : '');

/**
 * 检查一个引用值是否为空，若是则转换到缺省值。
 * @param value 要检查的引用值
 * @param defaultValue 默认赋予的值（默认为""）
 * @return {*}
 */
export function defaultValue(value, defaultValue) {
  if (this.isArray(value) && value.length === 0) {
    return defaultValue || value;
  }
  return value !== undefined && value !== '' && value !== null ? value : (defaultValue || '');
}

/**
 * 为能在HTML显示的字符转义&、<、>以及'。
 * @param {String} value 要编码的字符串
 * @return {String} 编码后的文本
 */
export function htmlEncode(value) {
  return !value ? value : String(value).replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

/**
 * 将&, <, >, and '字符从HTML显示的格式还原。
 * @param {String} value 解码的字符串
 * @return {String} 编码后的文本
 */
export function htmlDecode(value) {
  return !value ? value : String(value).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

/**
 * 裁剪一段文本的前后多余的空格。
 * @param {String} value 要裁剪的文本
 * @return {String} 裁剪后的文本
 */
export function trim(value) {
  return String(value).replace(trimRe, '');
}

/**
 * 返回一个从指定位置开始的指定长度的子字符串。
 * @param {String} value 原始文本
 * @param {Number} start 所需的子字符串的起始位置
 * @param {Number} length 在返回的子字符串中应包括的字符个数。
 * @return {String} 指定长度的子字符串
 */
export function substr(value, start, length) {
  return String(value).substr(start, length);
}

/**
 * 返回一个字符串，该字符串中的字母被转换为小写字母。
 * @param {String} value 要转换的字符串
 * @return {String} 转换后的字符串
 */
export function lowercase(value) {
  return String(value).toLowerCase();
}

/**
 * 返回一个字符串，该字符串中的字母被转换为大写字母。
 * @param {String} value 要转换的字符串
 * @return {String} 转换后的字符串
 */
export function uppercase(value) {
  return String(value).toUpperCase();
}

/**
 * 返回一个字符串，该字符串中的第一个字母转化为大写字母，剩余的为小写。
 * @param {String} value 要转换的字符串
 * @return {String} 转换后的字符串
 */
export function capitalize(value) {
  return !value ? value : value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
}

/**
 *格式化数字到美元货币
 * @param v {Number/String} 要格式化的数字
 * @returns {string} 已格式化的货币
 */
export function usMoney(v) {
  let iv = (Math.round((v - 0) * 100)) / 100;
  if ((iv === Math.floor(iv))) {
    iv = `${iv}.00`
  } else {
    iv = ((iv * 10 === Math.floor(iv * 10)) ? `${iv}0` : iv)
  }
  iv = String(iv);
  const ps = iv.split('.');
  let whole = ps[0];
  const sub = ps[1] ? `.${ps[1]}` : '.00';
  const r = /(\d+)(\d{3})/;
  while (r.test(whole)) {
    whole = whole.replace(r, '$1,$2');
  }
  iv = whole + sub;
  if (iv.charAt(0) === '-') {
    return `-$${iv.substr(1)}`;
  }
  return `$${iv}`;
}

/**
 * 将某个值解析成为一个特定格式的日期。
 * @param v 要格式化的值
 * @param {String} format （可选的）任何有效的日期字符串（默认为“月/日/年”）
 * @return {Function} 日期格式函数
 */
export function date(date, formatter = 'yyyy-MM-dd HH:mm:ss') {
  if (!date) return null;
  const chineseWeekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const addZeroLeft = (value, resultLength) => {
    let result = value.toString();
    if (result.length < resultLength) {
      let i = result.length;
      while (i++ < resultLength) {
        result = `0${result}`;
        if (result.length === resultLength) {
          break;
        }
      }
    }
    return result;
  };
    /**
     * 提取日期的年月日时分秒
     * @param {Object} d
     * @param {Object} isZero
     */
  const splitDate = (d, isZero) => {
    let yyyy,
      MM,
      dd,
      hh,
      HH,
      mm,
      ss,
      ms;// N
    if (isZero) {
      yyyy = d.getFullYear();
      MM = addZeroLeft(String(d.getMonth() + 1), 2);
      dd = addZeroLeft(String(d.getDate()), 2);
      HH = addZeroLeft(String(d.getHours()), 2);
      hh = parseInt(HH, 10) > 12 ? addZeroLeft(String(parseInt(HH, 10) - 12), 2) : HH;
      mm = addZeroLeft(String(d.getMinutes()), 2);
      ss = addZeroLeft(String(d.getSeconds()), 2);
      ms = addZeroLeft(String(d.getMilliseconds()), 3);
    } else {
      yyyy = d.getFullYear();
      MM = d.getMonth() + 1;
      dd = d.getDate();
      HH = d.getHours();
      hh = HH > 12 ? HH - 12 : HH;
      mm = d.getMinutes();
      ss = d.getSeconds();
      ms = d.getMilliseconds();
    }
    return {
      yyyy,
      MM,
      dd,
      HH,
      hh,
      mm,
      ss,
      ms,
      cw: chineseWeekNames[d.getDay()]
    };
  };
  if (typeof date === 'string') {
    if (date.indexOf('T') !== -1) {
      date = new Date(date);
    } else {
      const ds = date.split(/-|\s|:/);
      const x = [];
      ds.forEach((d, i) => {
        if (i === 1) {
          x.push(d * 1 - 1);
        } else {
          x.push(d * 1);
        }
      });
      date = eval(`new Date(${x.join(',')})`);
    }
  } else if (typeof date === 'number') {
    date = new Date(date);
  }
  const dateObject = splitDate(date, true);
  const formatters = ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss', 'ms', 'cw'];
  let formatValue = formatter;
  for (let i = 0; i < formatters.length; i++) {
    formatValue = replaceAll(formatValue, formatters[i], dateObject[formatters[i]]);
  }
  return formatValue.indexOf('yy') > -1 ? replaceAll(formatValue, 'yy', dateObject.yyyy.toString().substr(2, 2)) : formatValue;
}

export function replaceAll(value, raRegExp, replaceText) {
  if (typeof raRegExp === 'undefined' || raRegExp == null || !value || !replaceText) {
    return;
  }
  if (!(raRegExp instanceof RegExp)) {
    raRegExp = new RegExp(raRegExp, 'g');
  }
  return value.replace(raRegExp, replaceText);
}

/**
 * 剥去所有HTML标签。
 * @param v 要剥去的文本
 * @return {String} 剥去后的HTML标签
 */
export function stripTags(v) {
  return !v ? v : String(v).replace(this.stripTagsRE, '');
}


/**
 *剥去所有脚本（<script>...</script>）标签
 * @param v value 要剥去的文本
 * @returns {*} 剥去后的HTML标签
 */
export function stripScripts(v) {
  return !v ? v : String(v).replace(this.stripScriptsRe, '');
}

/**
 * 对文件大小进行简单的格式化（xxx bytes、xxx KB、xxx MB）
 * @param {Number/String} size 要格式化的数值
 * @return {String} 已格式化的值
 */
export function fileSize(size) {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size < 1048576) {
    return `${Math.round(((size * 10) / 1024)) / 10} KB`;
  }
  return `${Math.round(((size * 10) / 1048576)) / 10} MB`;
}

export const math = (() => {
  const fns = {};
  return function (v, a) {
    if (!fns[a]) {
      fns[a] = new Function('v', `return v ${a};`);
    }
    return fns[a](v);
  };
})();


/**
 * 依据某种（字符串）格式来转换数字。
 * <div style="margin-left:40px">例子 (123456.789):
 * <div style="margin-left:10px">
 * 0 - (123456) 只显示整数，没有小数位<br>
 * 0.00 - (123456.78) 显示整数，保留两位小数位<br>
 * 0.0000 - (123456.7890) 显示整数，保留四位小数位<br>
 * 0,000 - (123,456) 只显示整数，用逗号分开<br>
 * 0,000.00 - (123,456.78) 显示整数，用逗号分开，保留两位小数位<br>
 * 0,0.00 - (123,456.78) 快捷方法，显示整数，用逗号分开，保留两位小数位<br>
 * 在一些国际化的场合需要反转分组（,）和小数位（.），那么就在后面加上/i
 * 例如： 0.000,00/i
 * </div></div>
 *
 * @method format
 * @param {Number} v 要转换的数字。
 * @param {String} format 格式化数字的“模”。
 * @return {String} 已转换的数字。
 * @public
 */
export function number(v, format) {
  if (!format) {
    return v;
  }
  v *= 1;
  if (typeof v !== 'number' || isNaN(v)) {
    return '';
  }
  let comma = ',';
  let dec = '.';
  let i18n = false;

  if (format.substr(format.length - 2) === '/i') {
    format = format.substr(0, format.length - 2);
    i18n = true;
    comma = '.';
    dec = ',';
  }

  const hasComma = format.indexOf(comma) !== -1;
  let psplit = (i18n ? format.replace(/[^\d\,]/g, '') : format.replace(/[^\d\.]/g, '')).split(dec);

  if (psplit.length > 1) {
    v = v.toFixed(psplit[1].length);
  } else if (psplit.length > 2) {
    throw (`NumberFormatException: invalid format, formats should have no more than 1 period: ${format}`);
  } else {
    v = v.toFixed(0);
  }

  let fnum = v.toString();

  if (hasComma) {
    psplit = fnum.split('.');

    const cnum = psplit[0];
    const parr = [];
    const j = cnum.length;
    let m = Math.floor(j / 3);
    let n = cnum.length % 3 || 3;

    for (let i = 0; i < j; i += n) {
      if (i !== 0) {
        n = 3;
      }
      parr[parr.length] = cnum.substr(i, n);
      m -= 1;
    }
    console.log(m);
    fnum = parr.join(comma);
    if (psplit[1]) {
      fnum += dec + psplit[1];
    }
  }

  return format.replace(/[\d,?\.?]+/, fnum);
}

/**
 * 可选地为一个单词转为为复数形式。例如在模板中，{commentCount:plural("Comment")}这样的模板语言如果commentCount是1那就是 "1 Comment"；
 * 如果是0或者大于1就是"x Comments"。
 * @param v {Number} 参与比较的数
 * @param s {String} singular 单词的单数形式
 * @param  p {String} plural （可选的） 单词的复数部分（默认为加上's'）
 * @returns {string}
 */
export function plural(v, s, p) {
  return `${v} ${v === 1 ? s : (p || `${s}s`)}`;
}

export function parseQueryString(url) {
  const query = url.indexOf('?') > -1 ? url.replace(/^[^\?]{0,}\??/, '') : url;
  const data = {};
  if (!query) {
    return data;
  }
  const pairs = query.split(/[;&]/);
  for (let i = 0; i < pairs.length; i++) {
    const KeyVal = pairs[i].split('=');
    if (!KeyVal || KeyVal.length !== 2) {
      continue;
    }
    const key = decodeURIComponent(KeyVal[0]);// decodeURIComponent
    const val = decodeURIComponent(KeyVal[1]);// unescape
    if (data[key]) {
      if (Object.prototype.toString.call(data[key]) !== '[object Array]') {
        data[key] = [data[key]];
      }
      data[key].push(val);
    } else {
      data[key] = val;
    }
  }
  return data;
}

export function querystring(data) {
  return (data && Object.keys(data).map(key => `${key}=${data[key]}`).join('&')) || '';
}

/**
 * 将表单参数转为json格式
 * @param params
 * @returns {*}
 */
export function param(params) {
  if (typeof params === 'string') {
    params = this.parseQueryString(params);
  }
  const _t = /\[(\d+)\]$/;
  let obj = params;
  Object.key(params).forEach(p => {
    const setParams = (v, i, array) => {
      const _isarray = _t.test(v);
      let name,
        index;
      if (_isarray) { // is Array
        index = _t.exec(v)[1];
        name = v.substr(0, v.length - index.length - 2);
      } else {
        name = v;
      }
      if (array.length === i + 1 && !_isarray) {
        obj[name] = params[p];
      }
      if (_isarray) {
        obj = !obj[name] ? obj[name] = [] : obj[name];
        if (array.length !== i + 1) {
          obj = !obj[parseInt(index, 10)] ? obj[parseInt(index, 10)] = {} : obj[parseInt(index, 10)];
        } else {
          obj[parseInt(index, 10)] = params[p];
        }
      } else {
        obj = obj[name] == null ? obj[name] = {} : obj[name];
      }
    };
    if (p.indexOf('.') !== -1) {
      p.split('.').forEach(setParams);
      delete params[p];
    } else if (_t.test(p)) {
      setParams(p, 0, [p]);
      delete params[p];
    }
  })
  return params;
}

export function tableToExcel(table, name) {
    let uri = 'data:application/vnd.ms-excel;base64,',// eslint-disable-line
    // eslint-disable-next-line
        template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
                    <!--[if gte mso 9]>
                    <xml>
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheets>
                                <x:ExcelWorksheet>
                                    <x:Name>{worksheet}</x:Name>
                                    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                                </x:ExcelWorksheet>
                            </x:ExcelWorksheets>
                        </x:ExcelWorkbook>
                    </xml>
                    <![endif]-->
                    </head>
                    <body>
                    <?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>
                    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
                        {xml}
                    </Workbook>
                    </body>
                    </html>`,
        base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },// eslint-disable-line
        format = function (s, c) {// eslint-disable-line
      return s.replace(/{(\w+)}/g,
        (m, p) => c[p]);
    };
  if (!table) return false;
  const ctx = { worksheet: name || 'Worksheet', table };
  window.location.href = uri + base64(format(template, ctx));
}

export function xmlToExcel(xml, name) {
    let uri = 'data:application/vnd.ms-excel;base64,',// eslint-disable-line
    // eslint-disable-next-line
        template = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">{xml}</Workbook>`,
        base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); },// eslint-disable-line
        format = function (s, c) {// eslint-disable-line
      return s.replace(/{(\w+)}/g, (m, p) => {
        console.log(c[p]);
        return c[p];
      });
    };
  if (!xml) {
    return false;
  }
  const ctx = { worksheet: name || 'sheet', xml };
  console.log(uri + base64(format(template, ctx)));
  window.location.href = uri + base64(format(template, ctx));
}

/**
 * 格式化数字货币
 * @param v {Number/String} 要格式化的数字
 * @returns {string} 已格式化的货币
 */
export function fmoney(v) {
  v = (Math.round((v - 0) * 100)) / 100;
  if (v === Math.floor(v)) {
    v = `${v}.00`;
  } else {
    v = (v * 10 === Math.floor(v * 10)) ? `${v}0` : v
  }
  v = String(v);
  const ps = v.split('.');
  let whole = ps[0];
  const sub = ps[1] ? `.${ps[1]}` : '.00';
  const r = /(\d+)(\d{3})/;
  while (r.test(whole)) {
    whole = whole.replace(r, '$1,$2');
  }
  v = whole + sub;
  if (v.charAt(0) === '-') {
    return `-${v.substr(1)}`;
  }
  return v;
}

export function addZeroLeft(value, resultLength) {
  let result = value.toString();
  if (result.length < resultLength) {
    let i = result.length;
    while (i++ < resultLength) {
      result = `0${result}`;
      if (result.length === resultLength) { break; }
    }
  }
  return result;
}

export function deleteProps(props, ...names) {
  names.forEach(name => {
    delete props[name];
  });
}

export function tree(list, {
  rootKey = item => item.layer === 1,
  sort = () => false,
  idKey = 'id',
  pidKey = 'parent_id',
  childrenKey = 'children',
  converter = item => ({ ...item })
}) {
  const start = new Date().getTime();
  try {
    return (nlist => nlist.filter(item => {
      nlist.filter(sitem => sitem[idKey] === (typeof pidKey === 'function' ? pidKey(item) : item[pidKey])).forEach(sitem => {
        if (!sitem[childrenKey]) {
          sitem[childrenKey] = [];
        }
        if (!sitem[childrenKey].some(cv => cv[idKey] === item[idKey])) {
          sitem[childrenKey].push(item);
        }
      });
      return rootKey(item);
    }))(list.map(converter).sort(sort));
  } finally {
    console.log('list -> tree 耗时', new Date().getTime() - start, 'ms');
  }
}
