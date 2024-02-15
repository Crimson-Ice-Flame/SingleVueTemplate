export interface UserParam {
    account: string;
    password: string;
  }

  export interface LoginRep {
    access_token: string;
    expires_in: number;
    refresh_token: string;
  }
