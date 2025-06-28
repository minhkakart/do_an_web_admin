export interface IOverviewDto {
    totalOrder: number;
    pendingOrder: number;
    processingOrder: IProcessingOrderDto;
    finishedOrder: number;
    cancelledOrder: ICancelledOrderDto;
    grossSale: number;
}
interface IProcessingOrderDto {
    totalOrder: number;
    approvedOrder: number;
    makingOrder: number;
    deliveringOrder: number;
}
interface ICancelledOrderDto {
    totalOrder: number;
    shopCanceledOrder: number;
    userCanceledOrder: number;
}