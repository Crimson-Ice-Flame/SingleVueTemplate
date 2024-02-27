// 通用SelectOptions
export type SelectOption = {
    label: string
    value: number
  }
  
  export const EnableOptions: SelectOption[] = [
    { label: '啟用', value: 1 },
    { label: '停用', value: 0 }
  ]

  export const UserTypeOptions: SelectOption[] = [
    { label: '新使用者', value: 1 },
    { label: '舊使用者', value: 2 }
  ]

  export const DeviceOptions: SelectOption[] = [
    { label: 'PC', value: 1 },
    { label: 'Android', value: 2 },
    { label: 'IOS', value: 3 }
  ]
  
  export const VisitTypeOptions: SelectOption[] = [
    { label: '按鈕', value: 1 },
    { label: '輪播圖', value: 2 },
    { label: '推薦線路', value: 3 },
    { label: '火熱節目', value: 4 },
    { label: '精選賽程', value: 5 },
  ]
  
  export const VisitItemOptions: SelectOption[] = [
    { label: '寰宇瀏覽器', value: 1 },
    { label: 'APP', value: 2 },
    { label: 'FUN樂園', value: 3 },
    { label: '合作夥伴', value: 4 },
    { label: '輪播圖', value: 5 },
    { label: '線路一', value: 6 },
    { label: '情社學園', value: 7 },
    { label: '彩球歐派金', value: 8 },
    { label: '性感女孩', value: 9 },
  ]
  