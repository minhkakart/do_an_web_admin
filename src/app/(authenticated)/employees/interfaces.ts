import {IBaseDto} from "~/commons/interfaces";

export interface IEmployeeDto extends IBaseDto {
    fullname: string;
    gender: number;
    phone: string;
    address: string;
    isLocked: number;
    createdAt: string;
}

export interface IEmployeeRequestCreate {
    fullname: string;
    username: string;
    gender: number;
    birthDate: Date | null;
    phone: string | null;
    address: string | null;
}

export interface IEmployeeRequestUpdate {
    id: number;
    fullname: string;
    gender: number;
    birthDate: string | null;
    phone: string | null;
    address: string | null;
}

export interface IEmployeeInfoDto extends IEmployeeDto {
    birthday: string;
}