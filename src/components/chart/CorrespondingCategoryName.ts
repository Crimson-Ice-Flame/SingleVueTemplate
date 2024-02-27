const ChartNameMap = new Map([
    ["count", "日進站人次"],
    ["online", "在線人數"],
    ["first", "首次進站"],
    ["location", "區域分布"],
    ["os", "作業系統占比"],
    ["adType", "點擊廣告類型"],
    ["headerButton", "上方按鈕"],
    ["hotVideo", "火熱節目"],
    ["events", "精選賽事"],
    ["tools", "推薦工具"],
    ["floatButton", "浮動按鈕"]
]);

  export function getChartName(item:string){
    return ChartNameMap.has(item) ? ChartNameMap.get(item) : item;
  }