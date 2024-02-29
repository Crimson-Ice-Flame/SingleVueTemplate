<template>
  <div>
    <n-card style="margin-bottom: 16px">
      <n-tabs type="line" default-value="chart" animated>
        <n-tab-pane name="chart" tab="數據圖">
          <n-space class="mbr_2" align="center">
            日期起迄
            <n-date-picker
              v-model:value="navigateChartSearch.dailyRangeVisitors"
              v-model:formatted-value="navigateChartSearch.dailyRangeVisitorsFormat"
              type="daterange"
              value-format="t"
              start-placeholder="起始日期"
              end-placeholder="結束日期"
              update-value-on-close
              :actions="null"
              :shortcuts="rangeShortcuts"
            />
            <n-button
              type="info"
              @click="
                getRangeVisitors(
                  navigateChartSearch.dailyRangeVisitorsFormat ??
                    millisecondsToSeconds(navigateChartSearch.dailyRangeVisitors)
                )
              "
              >查詢</n-button
            >
          </n-space>
          <div class="chart_line mbr_3">
            <lineData :data="userVisitData" chartId="lineFirst"></lineData>
          </div>

          <n-space class="mbr_2" align="center">
            日期(日)
            <n-date-picker
              v-model:value="navigateChartSearch.dailyLiveUsers"
              v-model:formatted-value="navigateChartSearch.dailyLiveUsersFormat"
              :actions="null"
              type="date"
              value-format="t"
              placeholder=""
            />
            <n-button
              type="info"
              @click="
                getDailyLiveUsers(
                  navigateChartSearch.dailyLiveUsersFormat ??
                    Math.floor(navigateChartSearch.dailyLiveUsers / 1000)
                )
              "
              >查詢</n-button
            >
          </n-space>
          <div class="chart_line mbr_4">
            <lineData :data="dailyLiveUsersData" chartId="lineSecond"></lineData>
          </div>

          <n-space class="mbr_4" align="center">
            訪問開始時間起迄（日/時）
            <n-date-picker
              v-model:value="navigateChartSearch.dateRangeAccess"
              v-model:formatted-value="navigateChartSearch.dateRangeAccessFormat"
              start-placeholder="起始日期時間"
              end-placeholder="結束日期時間"
              format="yyyy-MM-dd HH"
              type="datetimerange"
              value-format="t"
              :actions="null"
              :shortcuts="rangeShortcuts"
              update-value-on-close
            />
            <!-- <el-date-picker v-model="navigateChartSearch.dateRangeAccess"
              format="YYYY-MM-DD HH" value-format="X" time-format="HH" type="datetimerange"  clearable   /> -->
            <n-button
              type="info"
              @click="
                getRangeAccess(
                  navigateChartSearch.dateRangeAccessFormat ??
                    millisecondsToSeconds(navigateChartSearch.dateRangeAccess)
                )
              "
              >查詢</n-button
            >
          </n-space>
          <div class="chart_pie">
            <n-grid cols="1 400:2 600:3 1200:4 1600:5" item-responsive>
              <n-grid-item>
                <div class="pie_area mb_2">
                  <pieData :data="locationData" chartId="location"></pieData>
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="pie_area mb_2">
                  <pieData :data="osData" chartId="os"></pieData>
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="pie_area mb_2">
                  <pieData :data="adTypeData" chartId="adType"></pieData>
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="pie_area mb_2">
                  <pieData :data="headerButtonData" chartId="headerButton"></pieData>
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="pie_area mb_2">
                  <pieData :data="hotVideoData" chartId="hotVideo"></pieData>
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="pie_area mb_2">
                  <pieData :data="eventsData" chartId="events"></pieData>
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="pie_area mb_2">
                  <pieData :data="toolsData" chartId="tools"></pieData>
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="pie_area mb_2">
                  <pieData :data="floatButtonData" chartId="floatButton"></pieData>
                </div>
              </n-grid-item>
            </n-grid>
          </div>
        </n-tab-pane>
        <n-tab-pane name="table" tab="數據表格">
          <SearchTool
            :searchModel="searchData"
            :searchList="searchList"
            @handleSearchClick="onSearch"
          />
          <ViewTable
            :haveIndexColumn="true"
            :tableList="tableList"
            :tableData="tableData"
            class="blue"
          >
            <template #enter_at="value">
              <DateTime :timestamp="value.row.enter_at"></DateTime>
            </template>
            <template #access_type="value">
              <n-ellipsis expand-trigger="click" :line-clamp="3" :tooltip="false">
                <div v-html="getAccessTypeName(value.row.actions)"></div>
              </n-ellipsis>
            </template>
            <template #access_item="value">
              <n-ellipsis expand-trigger="click" :line-clamp="3" :tooltip="false">
                <div v-html="getAccessItemName(value.row.actions)"></div>
              </n-ellipsis>
            </template>
          </ViewTable>
          <PaginationVue :pageData="pageData" @changeSize="changeSize" @changePage="changePage" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import pieData from '@/components/chart/pieData.vue'
import lineData from '@/components/chart/lineData.vue'
import PaginationVue from '@/components/pagination/PaginationTool.vue'

// Types
import type { TableField } from '@/models/components/viewTable'
import type { PageDataType } from '@/models/components/pagination'
import type {
  DailyData,
  DailyReq,
  VisitData,
  DateRange,
  PieData,
  PagerReq
} from '@/models/api/navigate'

import {
  apiGetAnalysisData,
  apiGetDailyData,
  apiGetDateVisitData,
  apiListPager
} from '@/apis/navigate'

import {
  DeviceOptions,
  UserTypeOptions,
  VisitItemOptions,
  VisitTypeOptions
} from '@/utils/dropdownOptions'
import type { TimePickerProps } from 'naive-ui/es/time-picker'
import { showNotification } from '@/utils/common'

const userVisitData = ref<VisitData[]>([])
const dailyLiveUsersData = ref<DailyData[]>([])

function millisecondsToSeconds(dateRange: number[]): number[] | null {
  if (dateRange === null) {
    return null
  }
  return dateRange.map((date) => Math.floor(date / 1000))
}

const getRangeVisitors = (value: number[] | string[] | null) => {
  console.log(value)
  if (value === null) {
    showNotification('錯誤', '日進站人次，日期起迄不可為空', 'error')
    return
  }
  const query: DateRange = {
    start_time: value[0],
    end_time: value[1]
  }
  apiGetDateVisitData(query).then((res) => {
    if (res.status === 1) {
      userVisitData.value = res.result.map((item) => {
        return {
          date: dayjs(item.date).format('MM/DD'),
          count: item.count
        }
      })
    }
  })
}
const getDailyLiveUsers = (value: number | string) => {
  console.log(value)
  if (value === 0) {
    showNotification('錯誤', '日活躍人數，日期不可為空', 'error')
    return
  }
  const query: DailyReq = {
    date: value
  }
  apiGetDailyData(query).then((res) => {
    if (res.status === 1) {
      dailyLiveUsersData.value = res.result
    }
  })
}

const calcPercentData = (data: PieData[]) => {
  const sumTotal = data.reduce((acc, cur) => acc + cur.value, 0)
  return data.map((item) => {
    return {
      label: item.label,
      value: Math.round((item.value / sumTotal) * 100)
    }
  })
}

const locationData = ref<PieData[]>([])
const osData = ref<PieData[]>([])
const adTypeData = ref<PieData[]>([])
const headerButtonData = ref<PieData[]>([])
const hotVideoData = ref<PieData[]>([])
const eventsData = ref<PieData[]>([])
const toolsData = ref<PieData[]>([])
const floatButtonData = ref<PieData[]>([])

enum analysisEnum {
  // 地區
  NavigateAnalysisType_Location = 1,
  /// 作業系統
  NavigateAnalysisType_OS,
  /// 點擊廣告類型
  NavigateAnalysisType_AdType,
  /// 上方按鈕
  NavigateAnalysisType_HeaderButton,
  /// 火熱節目
  NavigateAnalysisType_HotVideo,
  /// 精選賽事
  NavigateAnalysisType_Events,
  /// 推薦工具
  NavigateAnalysisType_Tools,
  /// 浮動按鈕
  NavigateAnalysisType_FloatButton
}
const getRangeAccess = (value: number[] | string[] | null) => {
  if (value === null) {
    showNotification('錯誤', '訪問開始時間起迄，日期起迄不可為空', 'error')
    return
  }
  const query: DateRange = {
    start_time: value[0],
    end_time: value[1]
  }
  Object.keys(analysisEnum).forEach((key) => {
    const type = analysisEnum[key as keyof typeof analysisEnum]
    apiGetAnalysisData(query, type).then((res) => {
      if (res.status === 1) {
        switch (type) {
          case analysisEnum.NavigateAnalysisType_Location:
            locationData.value = calcPercentData(res.result)
            break
          case analysisEnum.NavigateAnalysisType_OS:
            osData.value = calcPercentData(res.result)
            break
          case analysisEnum.NavigateAnalysisType_AdType:
            adTypeData.value = calcPercentData(res.result)
            break
          case analysisEnum.NavigateAnalysisType_HeaderButton:
            headerButtonData.value = calcPercentData(res.result)
            break
          case analysisEnum.NavigateAnalysisType_HotVideo:
            hotVideoData.value = calcPercentData(res.result)
            break
          case analysisEnum.NavigateAnalysisType_Events:
            eventsData.value = calcPercentData(res.result)
            break
          case analysisEnum.NavigateAnalysisType_Tools:
            toolsData.value = calcPercentData(res.result)
            break
          case analysisEnum.NavigateAnalysisType_FloatButton:
            floatButtonData.value = calcPercentData(res.result)
            break
        }
      }
    })
  })
}

type navigateChart = {
  dailyRangeVisitors: number[]
  dailyRangeVisitorsFormat: string[] | undefined
  dailyLiveUsers: number
  dailyLiveUsersFormat: string | undefined
  dateRangeAccess: number[]
  dateRangeAccessFormat: string[] | undefined
}
const now = dayjs()
const year = now.year()
const month = now.month()

const todayStart = now.startOf('day').valueOf()
const todayEnd = now.endOf('day').valueOf()
const getMonthFirstDay = dayjs().year(year).month(month).startOf('month').valueOf()
const getMonthLastDay = dayjs().year(year).month(month).endOf('month').valueOf()
const getPreMonthFirstDay = dayjs()
  .year(year)
  .month(month - 1)
  .startOf('month')
  .valueOf()
const getPreMonthLastDay = dayjs()
  .year(year)
  .month(month - 1)
  .endOf('month')
  .valueOf()

const navigateChartSearch = ref<navigateChart>({
  dailyRangeVisitors: [getMonthFirstDay, todayEnd],
  dailyRangeVisitorsFormat: undefined,
  dailyLiveUsers: todayStart,
  dailyLiveUsersFormat: undefined,
  dateRangeAccess: [getMonthFirstDay, todayEnd],
  dateRangeAccessFormat: undefined
})

const rangeShortcuts = {
  本月: () => {
    return [getMonthFirstDay, getMonthLastDay] as const
  },
  上一月: () => {
    return [getPreMonthFirstDay, getPreMonthLastDay] as const
  }
}

// 數據表格查詢
const searchList = ref<any[]>([
  {
    elementName: 'nDatepicker',
    elementType: 'datetimerange',
    label: '日期起迄',
    name: 'dateRange',
    format: 'yyyy-MM-dd HH:mm',
    shortcuts: rangeShortcuts,
    datePickerActions: null,
    class: 'large'
  },
  {
    elementName: 'nSelect',
    name: 'user_type',
    label: '身分',
    selectOptions: UserTypeOptions,
    option_label: 'label',
    option_value: 'value'
  },
  {
    elementName: 'nInput',
    name: 'ip',
    label: 'IP'
  },
  {
    elementName: 'nInput',
    name: 'location',
    label: '區域'
  },
  {
    elementName: 'nInput',
    name: 'os',
    label: '設備'
  },
  {
    elementName: 'nInput',
    name: 'access_type',
    label: '訪問類型'
  },
  {
    elementName: 'nInput',
    name: 'access_item',
    label: '訪問項目'
  }
  // {
  //   elementName: 'nSelect',
  //   name: 'os',
  //   label: '設備',
  //   selectOptions: DeviceOptions,
  //   option_label: 'label',
  //   option_value: 'value'
  // },
  // {
  //   elementName: 'nSelect',
  //   name: 'access_type',
  //   label: '訪問類型',
  //   selectOptions: VisitTypeOptions,
  //   option_label: 'label',
  //   option_value: 'value'
  // },
  // {
  //   elementName: 'nSelect',
  //   name: 'access_item',
  //   label: '訪問項目',
  //   selectOptions: VisitItemOptions,
  //   option_label: 'label',
  //   option_value: 'value'
  // }
  // {
  //   label: '停留時間',
  //   elementName: 'nInput',
  //   name: 'account',
  // }
])

const getAccessTypeName = (value: any[] | null) => {
  // const findItem = VisitTypeOptions.find((item) => item.value === value);
  if (value === null || value.length === 0) {
    return '無'
  }
  return value
    .map((item) => {
      return item.access_type
    })
    .join('<br>')
}
const getAccessItemName = (value: any[] | null) => {
  // const findItem = VisitItemOptions.find((item) => item.value === value);
  if (value === null || value.length === 0) {
    return '無'
  }
  return value
    .map((item) => {
      return item.access_item
    })
    .join('<br>')
}

const searchData = ref<any>({
  ip: null,
  location: null,
  os: null,
  user_type: null,
  access_type: null,
  access_item: null,
  dateRange: [getMonthFirstDay, todayEnd]
})
const onSearch = () => {
  pageData.page = 1
  getList()
}

const getList = () => {
  const query: PagerReq = {
    start_time: searchData.value.dateRange
      ? Math.floor(searchData.value.dateRange[0] / 1000)
      : undefined,
    end_time: searchData.value.dateRange
      ? Math.floor(searchData.value.dateRange[1] / 1000)
      : undefined,
    ip: searchData.value.ip,
    location: searchData.value.location,
    os: searchData.value.os,
    user_type: searchData.value.user_type,
    access_type: searchData.value.access_type,
    access_item: searchData.value.access_item,
    page_size: pageData.page_size,
    page: pageData.page
  }
  apiListPager(query).then((res) => {
    if (res.status === 1) {
      tableData.value = res.result.page_data
      pageData.page_count = res.result.page_info.page_count
    }
  })
}

const tableList = ref<TableField[]>([
  { label: '身分', name: 'customer_type', sortable: true, width: 85 },
  { label: '訪問IP', name: 'ip' },
  { label: '國家', name: 'country' },
  { label: '區域', name: 'location' },
  { label: '訪問日期/時間', name: 'enter_at', elementName: 'slot' },
  { label: '訪問類型', name: 'access_type', elementName: 'slot' },
  { label: '訪問項目', name: 'access_item', elementName: 'slot' },
  { label: '瀏覽器', name: 'browser' },
  { label: '使用設備', name: 'os' }
])
const tableData = ref<any>([])

let pageData = reactive<PageDataType>({
  page_size: 10,
  page: 1,
  page_count: 1
})
const changeSize = (val: number) => {
  pageData.page_size = val
  pageData.page = 1
  getList()
}
const changePage = (val: number) => {
  pageData.page = val
  getList()
}

onMounted(() => {
  const defaultVisitDate = navigateChartSearch.value.dailyRangeVisitors.map((date) =>
    Math.floor(date / 1000)
  )
  getRangeVisitors(defaultVisitDate)
  getDailyLiveUsers(Math.floor(navigateChartSearch.value.dailyLiveUsers / 1000))
  getRangeAccess(defaultVisitDate)
})
</script>

<style scoped>
/* Your styles here */
.pie_area mb_2 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 371px;
}
</style>
