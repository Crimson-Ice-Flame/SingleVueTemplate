import type {
  DailyReq,
  DailyData,
  DateRange,
  VisitData,
  PieData,
  PagerReq,
  PagerRep,
  analysisReq
} from '@/models/api/navigate'
import { post } from '@/utils/http'

export const apiGetDateVisitData = (req: DateRange) => {
  return post<VisitData[]>('/navigate/date_visit', req)
}

export const apiGetDailyData = (req: DailyReq) => {
  return post<DailyData[]>('/navigate/daily', req)
}

export const apiGetAnalysisData = (dateRange: DateRange, analysisType: number) => {
  const req: analysisReq = {
    start_time: dateRange.start_time,
    end_time: dateRange.end_time,
    type: analysisType
  }
  return post<PieData[]>('/navigate/analysis', req)
}

// 數據報表
export const apiListPager = (req: PagerReq) => {
  return post<PagerRep>('/navigate/pager', req)
}
