import dayjs from 'dayjs';

/**
 * 呼叫 el-form 驗證欄位
 * @param elFormRef - 帶入要進行欄位驗證的 el-form 的 ref
 * @param {String} ruleProp - 帶入要被驗證的 prop
 */
export const elFormValidateField = (elFormRef: any, ruleProp: string) => {
  elFormRef.validateField(ruleProp, () => null);
};

/**
 * 驗證是有效日期
 * @param {Date} value
 * @returns {Boolean}
 */
export function isValidDateTime(value: string, isFuture = false): boolean {
  const valueDate = new Date(value);
  if (isFuture) {
    return valueDate.getTime() >= Date.now();
  } else {
    return valueDate.getTime() <= Date.now();
  }
}

/**
 * 驗證申請日不可是過去
 */
export const DateOfApplication = (rule: any, value: any, callback: any) => {
  const nowUnix = dayjs().startOf('day').unix(); // 取得現在日期0點的 Unix timestamp
  return value >= nowUnix;
};

/**
 * 檢核日期時間的區間
 * @param {String} startDate - 日期開始
 * @param {String} endDate - 日期結束
 * @param {boolean} equal - 日期是否可以相等
 */
export function checkDateRange(
  startDate: string,
  endDate: string,
  equal: boolean = false
): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return equal ? start <= end : start < end;
}

/**
 * 判斷第二個時間是否大於第一個時間，且是否有效。
 *
 * @param validDate - The first timestamp to check.
 * @param secondValidDate - The second timestamp to check.
 * @returns true: validDate < secondValidDate || secondValidDate valid;
 */
export function checkTimestampRange(validDate?: number, secondValidDate?: number): boolean {
  if (validDate === undefined || secondValidDate === undefined) return false;
  // secondValidDate有值，validDate沒值，代表validDate是無限小
  if (validDate === undefined && secondValidDate !== undefined) return true;
  return validDate < secondValidDate;
}

/**
 * 檢核起始值小於末值: true
 * @param {Number} startNumber - 起始值
 * @param {Number} endNumber - 末值
 * @param {boolean} equal - 日期是否可以相等
 */
export function checkNumberRange(
  startNumber: Number,
  endNumber: Number,
  equal: boolean = false
): boolean {
  return equal ? startNumber <= endNumber : startNumber < endNumber;
}

/**
 * 檢核一個字串陣列是否有重複
 * @param {String[]} strings - 字串陣列
 */
export function checkDuplicateStrings(strings: string[]): boolean {
  // 使用 Set 物件去除重複的字串
  const uniqueStrings = new Set(strings);
  console.log(strings.length === uniqueStrings.size);
  // 如果原本的陣列長度與 Set 物件的大小一樣，代表沒有重複的字串
  return strings.length === uniqueStrings.size;
}

/**
 * 驗證統一編號
 * @param {string} number
 * @returns {Boolean}
 */
export const checkTaxNumber = (taxId: string): boolean => {
  const reg = new RegExp('^\\d{8}$');
  if (!reg.test(taxId)) {
    console.log('Fail, 長度錯誤');
    return false;
  }

  const len = 8;
  const idArray = Array.from(taxId).map(c => parseInt(c));
  const weight = [1, 2, 1, 2, 1, 2, 4, 1];

  let sum = 0;
  for (let i = 0; i < len; i++) {
    const p = idArray[i] * weight[i];
    const s = Math.floor(p / 10) + (p % 10);
    sum += s;
  }

  const checkNumber = 5;
  const isLegal = sum % checkNumber === 0 || ((sum + 1) % checkNumber === 0 && idArray[6] === 7);

  if (!isLegal) {
    console.log('Fail, 不合法的統編驗證');
  }

  return isLegal;
};
/**
 * 驗證身分證&新舊居留證
 * @param {string} number
 * @returns {Boolean}
 */
export function isValidIDorRCNumber(str: string): boolean {
  if (str === null || str === '' || str.length !== 10) {
    return false;
  }

  const pidCharArray: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ];

  const pidIDInt: number[] = [
    1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11, 20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12,
    30
  ];

  const pidResidentFirstInt: number[] = [
    1, 10, 9, 8, 7, 6, 5, 4, 9, 3, 2, 2, 11, 10, 8, 9, 8, 7, 6, 5, 4, 3, 11, 3, 12, 10
  ];

  const pidResidentSecondInt: number[] = [
    0, 8, 6, 4, 2, 0, 8, 6, 2, 4, 2, 0, 8, 6, 0, 4, 2, 0, 8, 6, 4, 2, 6, 0, 8, 4
  ];

  str = str.toUpperCase();
  const strArr: string[] = str.split('');
  let verifyNum = 0;

  if (str.match(/[A-Z]{1}[1-2]{1}[0-9]{8}/)) {
    verifyNum = verifyNum + pidIDInt[pidCharArray.indexOf(strArr[0])];
    for (let i = 1, j = 8; i < 9; i++, j--) {
      verifyNum += Number(strArr[i]) * j;
    }
    verifyNum = (10 - (verifyNum % 10)) % 10;

    return verifyNum === Number(strArr[9]);
  }

  verifyNum = 0;
  if (str.match(/[A-Z]{1}[A-D]{1}[0-9]{8}/)) {
    verifyNum += pidResidentFirstInt[pidCharArray.indexOf(strArr[0])];
    verifyNum += pidResidentSecondInt[pidCharArray.indexOf(strArr[1])];
    for (let i = 2, j = 7; i < 9; i++, j--) {
      verifyNum += Number(strArr[i]) * j;
    }
    verifyNum = (10 - (verifyNum % 10)) % 10;

    return verifyNum === Number(strArr[9]);
  }

  verifyNum = 0;
  if (str.match(/[A-Z]{1}[89]{1}[0-9]{8}/)) {
    verifyNum += pidResidentFirstInt[pidCharArray.indexOf(strArr[0])];
    for (let i = 1, j = 8; i < 9; i++, j--) {
      verifyNum += Number(strArr[i]) * j;
    }
    verifyNum = (10 - (verifyNum % 10)) % 10;

    return verifyNum === Number(strArr[9]);
  }

  return false;
}
/**
 * 驗證Email
 * @param {string} number
 * @returns {Boolean}
 */
export const checkEmail = (num: string): boolean => {
  const reg = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4})*$/;
  return reg.test(num);
};

/**
 * 驗證Url
 * @param {string} number
 * @returns {Boolean}
 */
export const checkUrlString = (num: string): boolean => {
  const reg = /^https?:\/\/(?:[\w-]+\.)+[\w-]+(?:\/[\w-.\/?%&=]*)?$/;
  return reg.test(num);
};

export interface TimestampRange {
  start?: number;
  end?: number;
}

/**
 * 對日曆當月日期回傳是否禁選
 * @param {string} number -組件傳入的日期Timestamp
 * @param {TimestampRange} dateRange -判斷起訖區間 undefined不判斷
 * @param {Boolean} selectToday - 今天可以選擇時，是否能選
 * @returns {Boolean} -是否禁選
 */
export const dateDisabled = (
  number: any,
  dateRange: TimestampRange,
  selectToday: boolean = false
) => {
  // 判斷是不是Timestamp，不是的話需要轉檔
  const date = new Date(number).getTime() / 1000;
  const startDate =  dateRange.start;
  const endDate = dateRange.end;
  if (startDate && endDate) {
    return selectToday ? date > endDate || date < startDate : date >= endDate || date <= startDate;
  } else if (!startDate && endDate) {
    return selectToday ? date > endDate : date >= endDate;
  } else if (startDate && !endDate) {
    return selectToday ? date < startDate : date <= startDate;
  } else {
    return false;
  }
};
