import {IBaseDto} from "~/commons/interfaces";
import {ISizeDto} from "~/app/(authenticated)/products/interfaces";

export interface IOrderListDto extends IBaseDto {
    code: string;
    customer: IUserInfo;
    finalAmount: number;
    paymentMethod: number;
    status: number;
    paymentStatus: number;
    orderTime: string;
}

interface IUserInfo extends IBaseDto {
    fullName: string;
    avatar: string;
    userRole: number;
}


export interface IUserOrderDto extends IBaseDto {
    code: string;
    phoneNumber: string;
    shippingAddress: string;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    paymentMethod: number;
    status: number;
    paymentStatus: number;
    orderTime: string;
    createdAt: string;
    customer: IUserInfo;
    products: IOrderProductDto[];
}
interface IOrderProductDto extends IBaseDto {
    productSize: IProductSizeDto;
    toppings: IOrderProductToppingDto[];
    quantity: number;
    price: number;
}
interface IProductSizeDto extends IBaseDto {
    product: IProductCartDto;
    size: ISizeDto;
    price: number;
}
interface IOrderProductToppingDto extends IBaseDto {
    topping: IProductToppingDto;
    price: number;
}
export interface IProductToppingDto extends IBaseDto {
    name: string,
    price: number,
    isAvailable: number,
    type: number,
}
export interface IProductCartDto extends IBaseDto {
    name: string;
    price: number;
    starRate: number;
    imageUrl: string;
    bestSell: number;
    remarked: number;
}