import type { ListData } from "./responseResult";

export interface UserParam {
    account: string;
    password: string;
  }

  export interface LoginRep {
    access_token: string;
    expires_in: number;
    refresh_token: string;
  }

 export interface UserListReq extends ListData<UserList[]> {}

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