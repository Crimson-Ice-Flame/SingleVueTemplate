import type { ListData, PaginationOptions } from "./responseResult";

export interface DateRange {
    start_time: number | string;
    end_time: number | string;
}
export interface DailyReq {
    date: number | string;
}

export type VisitData = {
    date: string;
    count: number;
}
export type DailyData = {
    time: string;
    first: number;
    online: number;
}

export interface analysisReq extends DateRange{
    type : number;
}

export type PieData = {
    label: string;
    value: number;
}

export interface PagerRep extends ListData<any[]> {}

export interface PagerReq extends Partial<DateRange>, Partial<PaginationOptions>  {
    ip: string | null;
    location: string | null;
    os: string | null;
    user_type: number | null;
    access_type: string | null;
    access_item: string | null;
}