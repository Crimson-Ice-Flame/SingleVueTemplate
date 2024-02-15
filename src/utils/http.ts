import router from '@/router';
// import {appLoadStore} from '@/store/modules/app';

import Axios, { type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import { showNotification } from '@/utils/common';

import type { ResponseResult, Error } from '@/models/api/responseResult';

// const loadStore = appLoadStore();

// 判斷 loading 畫面是否關閉的相關變數與方法
let loadingPath: string | null = null;
const closeLoading = (url: string | undefined) => {
  if (loadingPath == url) {
    loadingPath = null;
  }
};

// Sever 回傳的錯誤
const errorHandler = (error: AxiosError) => {
  if (error.response) {
    closeLoading(error.response.config.url);

    if (error.response.status === 401) {
      router.push({ name: 'login' });
    }
  }
};

// Sever 回傳成功，卻有 error 的訊息
const successErrorsHandler = (errors: any) => {
  let message = '';
  for (const error of errors) {
    const errorListChinese = {
      'E0001' : '帳號密碼錯誤錯誤',
      'E9999' : '伺服器錯誤',
    }
    // @ts-ignore
    const msg = `${errorListChinese[error.error_code]} ${error.property_name ?? ''}<br />`;
    message += msg;
  }
  showNotification(
    'Error',
    message,
    'error',
    'bottom-right',
    true
  );
};
const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'}
});

axios.interceptors.request.use(
  (config: any) => {
    config.headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json;charset=utf-8'
    };
    // 當畫面為 loading 時，儲存 api 路徑
    // if (loadStore.isLoading && config.url && loadingPath === null) {
    //   loadingPath = config.url;
    // }

    return config;
  },
  (error: AxiosError) => {
    closeLoading(error.config?.url);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use((response: AxiosResponse) => {
  closeLoading(response.config.url);

  if (response.data.errors && response.data.errors.length > 0) {
    successErrorsHandler(response.data.errors);
  }

  return response.data;
}, errorHandler);

export default axios;

export const get = <T = any, R = ResponseResult<T>>(
  url: string,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axios.get(url, config);
};
export const post = <T = any, R = ResponseResult<T>>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axios.post(url, data, config);
};
export const deleteHttp = <T = any, R = ResponseResult<T>>(
  url: string,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axios.delete(url, config);
};
export const put = <T = any, R = ResponseResult<T>>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axios.put(url, data, config);
};
export const patch = <T = any, R = ResponseResult<T>>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<R> => {
  return axios.patch(url, data, config);
};

export const buildParams = <T extends object>(request: T) => {
  let result = '';
  Object.entries(request).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }
    if (result !== '') {
      result += '&';
    }
    result += `${key}=${value}`;
  });
  return result;
};

// 取得是否含有指定的錯誤碼，然後回傳布林去做相對應的操作
export const FindTheCorrespondingErrorCode = (errorResult: Error[], errorCode: string): Boolean => {
  const find = errorResult.find(item => item.error_code === errorCode);
  return typeof find !== 'undefined';
};
