import {IBaseDto, IFormProps} from "~/commons/interfaces";

export interface IBannerDto extends IBaseDto {
    imageUrl: string;
    order: number;
    isActive: number;
    createdAt: string;
}

export interface IUpsertBannerRequest {
    id: number | null;
    imageUrl: string;
    order: number;
    isActive: number;
}

export interface IFormUpdateBanner extends IFormProps {
    data: IBannerDto
}