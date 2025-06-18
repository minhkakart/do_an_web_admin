export enum QueryKey {
    tableCategory = 0,
    tableProduct,
    tableEmployee,
    tableVoucher,
    tableBanner,
    listCategory,
    listSize,
}

export enum UserRole {
    Customer = 0,
    Employee,
    Admin
}

export enum TypeGender {
    Male,
    Female
}

export enum TypeDiscount {
    Percent = 1,
    Absolute
}

export enum BooleanType {
    False = 0,
    True
}

export enum VoucherState {
    NotUse = 0,
    InUse = 1
}

export enum ProductType {
    Main = 1,
    Topping
}