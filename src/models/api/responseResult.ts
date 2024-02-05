export interface Error {
  error_code: string;
  error_type: number;
  property_name: null;
}

export interface ResponseResult<T = any> extends Error {
  errors: Error[];
  result: T;
  status: number;
}
