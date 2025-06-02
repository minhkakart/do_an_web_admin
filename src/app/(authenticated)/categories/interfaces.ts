export interface IFormCategoryProps {
    queryKeys: number[];
    onClose?: () => void;
}

export interface IFormCreateCategory {
    name: string;
    description: string;
}

export interface IFormUpdateCategory {
    id: number;
    name: string;
    description: string;
}

export interface ITableCategory {
    "numProduct": number,
    "createdAt": string,
    "name": string,
    "description": string | null,
    "id": number
}

export interface ICategoryDto {
    id: number;
    name: string;
    description: string;
}