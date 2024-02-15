export interface Error {
  error_code: string;
  error_type: number;
  property_name: null;
}

export interface ResponseResult<T = any> extends Error {
[x: string]: any;
  errors: Error[];
  result: T;
  status: number;
}

export interface ListData<T = any> {
  page_data: T[];
  page_info: PageInfo;
}

export interface PaginationOptions {
  page_size: number;
  page: number;
}

type PageInfo = {
  current_page: number;
  page_size: number;
  page_count: number;
  total: number;
}
