import { ElNotification } from 'element-plus';

import _ from 'lodash';

export type NotifyType = '' | 'success' | 'warning' | 'info' | 'error';
export type NotifyPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/** @brief 呼叫 Element Plus - Notification訊息窗
 * 適用於點選物件(按鈕)後所要顯示的對應訊息，例如：儲存鈕 - 顯示「儲存成功」or「儲存失敗」

 * @param { String } title 必填 - 訊息窗的顯示標題名稱
 * @param { String } message - 訊息窗的顯示內容
 * @param { NotifyType } type 必填 - 訊息窗的類型，允許值 'success' | 'warning' | 'info' | 'error'
 * @param { NotifyPosition } position 選填 - 訊息窗顯示的位置 'top-right' | 'top-left' | 'bottom-right'(預設) | 'bottom-left'
 * @param { Boolean } isHtml 選填 - 是否為 Html 字符串 (預設為 false)
 * @param { String } customClass 選填 - 指定訊息窗的class名稱，方便更改/覆蓋原本樣式
 * 
 * @author Vic
 * @date 2022/11/11
 */
export const showNotification = (
  title: string,
  message: string,
  type: NotifyType,
  position: NotifyPosition = 'bottom-right',
  isHtml: boolean = false,
  customClass?: string
) => {
  ElNotification({
    title: title,
    dangerouslyUseHTMLString: isHtml,
    message: message,
    type: type,
    position: position,
    customClass: customClass,
    duration: 5000
  });
};

// 數字轉換中文字
export const numberToChinese = (num: number) => {
  const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const chnUnitChar = ['', '十', '百', '千'];
  let strIns = '';
  let chnStr = '';
  let unitPos = 0;
  let zero = true;
  while (num > 0) {
    const v = num % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
      if (chnStr[0] === '一' && chnStr[1] === '十') {
        chnStr = chnStr.replace('一十', '十');
      }
    }
    unitPos++;
    num = Math.floor(num / 10);
  }
  return chnStr;
};

// i18n轉開頭大寫
export const Capitalized = (str: string) => {
  const words = str.split('_');
  let result = '';
  words.forEach(function (value) {
    const upperCaseValue = value[0].toUpperCase() + value.slice(1);
    if (result == '') result += upperCaseValue;
    else result += '_' + upperCaseValue;
  });
  return result;
};

// 檔案下載
export const downloadFile = (fileUrl: string, fileName: string) => {
  const xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    xhr.open('GET', fileUrl, true);
  }

  xhr.responseType = 'blob';
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      const objUrl = window.URL.createObjectURL(xhr.response);
      const aLinkDOM = document.createElement('a');

      aLinkDOM.href = objUrl;
      aLinkDOM.download = fileName;
      document.body.appendChild(aLinkDOM);
      aLinkDOM.click();
      document.body.removeChild(aLinkDOM);
      URL.revokeObjectURL(objUrl);
    }
  };
  xhr.send();
};

// 是否為數值類型且是時間戳（timestamp）的格式
export const isTimestamp = (value: number): boolean => {
  const regex = /^\d{10}$/;
  return regex.test(value.toString());
};

// 判斷是否為圖片網址
export const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|gif)$/i.test(url);
};

// 判斷是否為圖床網址
export const IsUploadURL = (url: string) => {
  const regex = /^https?:\/\/[a-z0-9\-\.]+\.[a-z]{2,}\/\S+$/;
  return regex.test(url);
};

// 檔案網址取得檔案名稱
export const FileLinkConvertFileName = (url: string) => {
  if (!url) return url;
  const field = url.split('/');
  return field[field.length - 1];
};

// 檔案網址下載
export const FileLinkDownload = (file: string) => {
  fetch(file)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = FileLinkConvertFileName(file);
      link.click();
    });
};

// FormValid 新增時，清空彈窗編輯資料
export const ClearFormModelData = <T extends object>(entity: T): Partial<T> => {
  const result: Partial<T> = {};
  Object.keys(entity).forEach(key => {
    // 利用 keyof T 取得介面中的屬性
    const k = key as keyof T;
    // 利用 Pick<T, K> 取得介面中的屬性值的子集
    result[k] = undefined;
  });
  return result;
};

// 判斷不同資料
export const isEqual = (oldArray: any, newArray: any) => {
  const result: boolean = !_.isEqual(oldArray, newArray);
  return result;
};


// 我要一個Function，可以把泛型的物件裡面的屬性都給Null
export function setNull<T extends Record<string, unknown>>(initialValue: T): T {
  return Object.fromEntries(Object.keys(initialValue).map(key => [key, null])) as T;
}

// 通用SelectOptions
type SelectOption = {
  label: string
  value: number
}

export const EnableOptions: SelectOption[] = [
  { label: '啟用', value: 1 },
  { label: '停用', value: 0 }
]
