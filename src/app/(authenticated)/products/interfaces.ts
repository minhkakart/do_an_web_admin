import {IBaseDto} from "~/commons/interfaces";
import {ICategoryDto} from "~/app/(authenticated)/categories/interfaces";

export interface IFormProductProps {
    queryKeys: number[];
    onClose: () => void;
}

export interface IProductListDto extends IProductDto {
    starRate: number;
    numComment: number;
    numCommentDeleted: number;
}
export interface IProductDto extends IBaseDto {
    name: string;
    price: number;
    isAvailable: number;
    discount: number | null;
    discountType: number | null;
    createdAt: string;
    categories: ICategoryDto[];
}

export interface IProductDetailDto extends IProductDto {
    starRate: number;
    description: string;
    imageUrls: string[];
}

export interface ICreateProductRequest {
    name: string;
    description: string;
    price: number;
    discount: number | null;
    discountType: number | null;
    imageUrls: string[];
    categoryIds: number[];
}
export interface IUpdateProductRequest extends ICreateProductRequest {
    id: number;
}
