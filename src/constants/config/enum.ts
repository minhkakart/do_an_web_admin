export enum QueryKey {
    tableCategory = 0,
    tableProduct,
    tableEmployee,
    tableVoucher,
    tableBanner,
    listCategory,
    listSize,
    lisPageOrder,
    orderDetail,
    getOverview,
}

export enum TYPE_DATE {
    ALL = -1,
    TODAY = 1,
    // YESTERDAY = 2,
    THIS_WEEK = 3,
    // LAST_WEEK = 4,
    THIS_MONTH = 5,
    // LAST_MONTH = 6,
    THIS_YEAR = 7,
    // LAST_7_DAYS = 8,
    LUA_CHON = 9,
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

export enum PaymentMethod {
    Cash = 1,
    Momo,
    VnPay
}

export enum PaymentStatus {
    Pending = 1,
    Paid,
    Failed
}

export enum OrderStatus {
    Pending = 0,
    Approved = 1,
    Making = 2,
    Delivering = 3,
    Finished = 4,
    Cancelled = 5,
    UserCanceled = 6,
}