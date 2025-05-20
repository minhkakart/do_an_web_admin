export interface IBaseResponse<T> {
    error: IBaseResponseError;
    data: T;
}

export interface IBaseResponseError {
    code: number;
    message: string;
}

export interface IPageResponse<T> {
    items: T[];
    pagination: IPagination;
}

export interface IPagination {
    totalCount: number;
    totalPage: number;
}

export interface IBaseDto {
    id: number;
}

export interface IHttpRequest {
    http: () => any;
    showLoading?: boolean;
    onError?: (err: any) => void;
    showMessageSuccess?: boolean;
    showMessageFailed?: boolean;
    msgSuccess?: string;
}

export interface IMenu {
    path: string;
    pathActive: Array<string>;
    title: string;
    icon: any;
}