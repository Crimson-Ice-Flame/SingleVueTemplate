import type { ListData, PaginationOptions } from "./responseResult";

 export interface UserListResult extends ListData<UserList[]> {}

  export interface UserListReq extends Partial<PaginationOptions> {
    account: string | null;
    enabled: boolean | null;
    group_id: number | null;
  }
  export interface UserList {
    id: number;
    account: string;
    updated_at: Date | null;
    enabled: boolean;
    groups: Group[];
  }

  export interface Group {
    group_id: number;
    group_name: string;
  }

  export interface UserCreateReq {
    id?: number;
    account: string;
    nickname: string;
    password: string,
    permission_group_id_list: number[]
  }

  export interface UserUpdateReq {
    id?: number;
    nickname: string;
    auth_group: number[]
  }

  export interface UserResetPwReq {
    id: number;
    password: string;
  }

  // ModelForm
  export interface UserCreateModel {
    id?: number;
    account: string;
    nickname: string;
    password?: string,
    reenteredPassword?: string,
    permission_group_id_list: number[] | null
  }

  export interface UserResetPwModel {
    id: number | null;
    account: string | null;
    password: string | null,
    changePassword: string | null
  }