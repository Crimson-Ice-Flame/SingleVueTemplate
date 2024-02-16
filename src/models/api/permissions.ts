import type { ListData, PaginationOptions } from "./responseResult";

export interface PermissionSearchParams extends Partial<PaginationOptions> {
  group_name: null | number;
  enabled: null | boolean;
}

export interface Permission {
  org_group_id: number;
  created_at: Date;
  org_name: string;
  group_name: string;
  use_count: number;
  update_at: Date;
  status: boolean;
}
export interface PermissionList {
  page_data: Permission[];
  page_info: PaginationOptions;
}

export interface PermissionStatus {
  org_group_id: number;
  status: boolean;
}

// Group Permission Set
export interface PermissionsSet {
  name: string;
  menu_permissions_data: any;
}
export interface PermissionsEdit extends PermissionsSet {
  org_group_id: number;
}
