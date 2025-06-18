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
    sizePrices: {
        id: number;
        size: {
            id: number;
            name: string;
        },
        price: number;
    }[];
    bestSell: number;
    remarked: number;
    type: number;
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
    bestSell: number;
    remarked: number;
    type: number;
    sizePrices: {
        sizeId: number,
        price: number
    }[];
    imageUrls: string[];
    categoryIds: number[];
}

export interface IUpdateProductRequest extends ICreateProductRequest {
    id: number;
}

export interface ISizeDto extends IBaseDto {
    name: string;
}
