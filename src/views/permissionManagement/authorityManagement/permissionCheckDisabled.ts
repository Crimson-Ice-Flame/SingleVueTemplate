/** 絕對要勾選的權限項目 */
export const alwaysCheck: {
  [key: string]: string[] 
} = {
  Home: ['PermissionAccessType_View']
};

/** 檢視 綁定 新增/刪除/編輯/覆核 的權限項目 */
export const checkWithView: string[] = [];


/** 權限名稱對應 */
export const permissionGroupMap = new Map([
  ["Page_Home", "首頁"],
  ["Page_Permission_Management", "權限管理"],
  ["Page_Account_Management", "帳號管理"],
  ['Page_Permission_Group_Management', '權限群組管理'],
  ['Page_Navigate_Web_Management', '導航網管理'],
  ['Page_Navigate_Web_Report', '數據報表']
]);
