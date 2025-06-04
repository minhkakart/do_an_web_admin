import {IBaseDto} from "~/commons/interfaces";

export interface IVoucherListDto extends IVoucherDto {
    timesUsed: number;
    state: number;
    createdAt: string;
}
export interface IVoucherDto extends IBaseDto {
    code: string;
    description: string;
    value: number;
    discountType: number;
    minOrderValue: number;
    limit: number;
    startTime: string;
    endTime: string;
}
export interface IVoucherRequestCreate {
    code: string;
    description: string;
    value: number;
    discountType: number;
    minOrderValue: number;
    limit: number;
    startTime: string | null;
    endTime: string | null;
}
export interface IVoucherRequestUpdate extends IVoucherRequestCreate {
    id: number;
}