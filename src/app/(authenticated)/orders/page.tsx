'use client'
import React, {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import orderService from "~/services/apis/orderService";
import {OrderStatus, PaymentMethod, PaymentStatus, QueryKey} from "~/constants/config/enum";
import {IPageResponse} from "~/commons/interfaces";
import {IOrderListDto, IUserOrderDto} from "~/app/(authenticated)/orders/interfaces";
import Search from "~/components/commons/Search";
import DataWrapper from "~/components/commons/DataWrapper";
import Table from "~/components/commons/Table";
import Moment from "react-moment";
import Pagination from "~/components/commons/Pagination";
import {PageSize} from "~/constants/config";
import Loading from "~/components/commons/Loading";
import {Danger, Eye} from "iconsax-react";
import Dialog from "~/components/commons/Dialog";
import IconCustom from "~/components/commons/IconCustom";
import Popup from "~/components/commons/Popup";
import {SiTicktick} from "react-icons/si";
import {PiCookingPot} from "react-icons/pi";
import {GrDeliver} from "react-icons/gr";
import {FaRegCircleXmark} from "react-icons/fa6";

export default function Orders() {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PageSize[0]);
    const [keyword, setKeyword] = useState<string>('');
    const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
    const [idDetailOrder, setIdDetailOrder] = useState<number | null>(null);

    const queryClient = useQueryClient();

    const {data: listOrder, isLoading} = useQuery({
        queryFn: () => apiRequest({
            api: () => orderService.getListPageOrder({
                isPaging: true,
                page: page,
                size: pageSize,
                keyword: keyword
            })
        }),
        select(data: IPageResponse<IOrderListDto>) {
            return data;
        },
        queryKey: [QueryKey.lisPageOrder, page, pageSize, keyword]
    })

    const updateOrderStatus = useMutation({
        mutationFn: ({id, status, msg}: { id: number, status: OrderStatus, msg: string }) => apiRequest({
            api: () => orderService.updateOrderStatus({id, status}),
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: msg
        }),
        async onSuccess() {
            // Reset the cancel order ID
            setCancelOrderId(null);
            // Invalidate the query to refetch the data
            await queryClient.invalidateQueries({
                queryKey: [QueryKey.lisPageOrder, page, pageSize, keyword]
            });
        }
    })

    return (
        <>
            <Loading loading={updateOrderStatus.isPending}/>
            <div className="flex justify-between items-center gap-3 flex-wrap mb-3">
                <div className="flex gap-3 flex-wrap">
                    <div className="min-w-[400px]">
                        <Search placeholder='Nhập từ khóa tìm kiếm' keyword={keyword} setKeyword={setKeyword}/>
                    </div>
                </div>
            </div>
            <DataWrapper
                loading={isLoading}
                data={listOrder?.items || []}
                title='Danh đơn hàng trống'

            >
                <Table<IOrderListDto>
                    data={listOrder?.items || []}
                    rowKey={(row) => row.id}
                    column={[
                        {
                            title: 'STT',
                            render: (_, index) => <>{index + 1}</>,
                        },
                        {
                            title: 'Mã đơn hàng',
                            render: (row, _) => <>{row.code || '---'}</>,
                        },
                        {
                            title: 'Tên khách hàng',
                            render: (row, _) => <>{row?.customer?.fullName ?? "---"}</>,
                        },
                        {
                            title: 'Tổng tiền',
                            render: (row, _) => <>{row.finalAmount || '---'}</>,
                        },
                        {
                            title: 'Phương thức thanh toán',
                            render: (row, _) => {
                                switch (row.paymentMethod) {
                                    case PaymentMethod.Cash:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-600">Tiền mặt</span>;
                                    case PaymentMethod.Momo:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-pink-100 text-pink-600">Momo</span>
                                    case PaymentMethod.VnPay:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-600">VNPay</span>
                                    default:
                                        return <>---</>;
                                }
                            },
                        },
                        {
                            title: 'Trạng thái thanh toán',
                            render: (row, _) => {
                                switch (row.paymentStatus) {
                                    case PaymentStatus.Pending:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-600">Chưa thanh toán</span>;
                                    case PaymentStatus.Paid:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-600">Đã thanh toán</span>
                                    case PaymentStatus.Failed:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-600">Thất bại</span>
                                    default:
                                        return <>---</>;
                                }
                            },
                        },
                        {
                            title: 'Trạng thái đơn hàng',
                            render: (row, _) => {
                                switch (row.status) {
                                    case OrderStatus.Pending:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-600">Chờ xác nhận</span>;
                                    case OrderStatus.Approved:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-600">Đã xác nhận</span>;
                                    case OrderStatus.Making:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-600">Đang làm</span>;
                                    case OrderStatus.Delivering:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-orange-100 text-orange-600">Đang giao hàng</span>;
                                    case OrderStatus.Finished:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-600">Đã hoàn thành</span>;
                                    case OrderStatus.Cancelled:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-600">Đã hủy</span>;
                                    case OrderStatus.UserCanceled:
                                        return <span
                                            className="px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-600">Bị hủy</span>;
                                    default:
                                        return <>---</>;
                                }
                            },
                        },
                        {
                            title: 'Thời gian đặt hàng',
                            render: (row, _) => (
                                <>
                                    {row?.orderTime ? (
                                        <Moment date={row?.orderTime} format='DD/MM/YYYY HH:mm'/>
                                    ) : (
                                        '---'
                                    )}
                                </>
                            ),
                        },
                        {
                            title: 'Tác vụ',
                            fixedRight: true,
                            render: (row, _) => {
                                const stateTransition: Record<OrderStatus, OrderStatus | null> = {
                                    [OrderStatus.Pending]: OrderStatus.Approved,
                                    [OrderStatus.Approved]: OrderStatus.Making,
                                    [OrderStatus.Making]: OrderStatus.Delivering,
                                    [OrderStatus.Delivering]: OrderStatus.Finished,
                                    [OrderStatus.Finished]: null,
                                    [OrderStatus.Cancelled]: null,
                                    [OrderStatus.UserCanceled]: null
                                };

                                const nextStates = stateTransition[(row?.status ?? -1) as OrderStatus] || null;

                                const nextStatesActionElements = (ns: OrderStatus | null) => {
                                    switch (ns) {
                                        case OrderStatus.Approved:
                                            return (<IconCustom
                                                icon={<SiTicktick size='32' color='#155dfc'/>}
                                                tooltip='Xác nhận đơn'
                                                background='#dbeafe'
                                                onClick={() => updateOrderStatus.mutate({
                                                    id: row.id,
                                                    status: OrderStatus.Approved,
                                                    msg: 'Xác nhận đơn hàng thành công'
                                                })}
                                            />)
                                        case OrderStatus.Making:
                                            return (<IconCustom
                                                icon={<PiCookingPot size='32' color='#d08700'/>}
                                                tooltip='Làm đơn'
                                                background='#fef9c2'
                                                onClick={() => updateOrderStatus.mutate({
                                                    id: row.id,
                                                    status: OrderStatus.Making,
                                                    msg: 'Xác nhận làm đơn hàng thành công'
                                                })}
                                            />)
                                        case OrderStatus.Delivering:
                                            return (<IconCustom
                                                icon={<GrDeliver size='32' color='#f54900'/>}
                                                tooltip='Làm đơn'
                                                background='#ffedd4'
                                                onClick={() => updateOrderStatus.mutate({
                                                    id: row.id,
                                                    status: OrderStatus.Delivering,
                                                    msg: 'Xác nhận giao đơn hàng thành công'
                                                })}
                                            />)
                                        case OrderStatus.Finished:
                                            return (<IconCustom
                                                icon={<SiTicktick size='32' color='#00a63e'/>}
                                                tooltip='Hoàn thành đơn'
                                                background='#dcfce7'
                                                onClick={() => updateOrderStatus.mutate({
                                                    id: row.id,
                                                    status: OrderStatus.Finished,
                                                    msg: 'Xác nhận hoàn thành đơn hàng thành công'
                                                })}
                                            />)
                                        default:
                                            return <></>;
                                    }
                                }

                                return <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                    <IconCustom
                                        icon={<Eye size='32' color='#6170E3'/>}
                                        tooltip='Xem chi tiết'
                                        background='rgba(97, 112, 227, 0.10)'
                                        onClick={
                                            () => {
                                                setIdDetailOrder(row.id);
                                            }
                                        }
                                    />
                                    {nextStatesActionElements(nextStates)}
                                    {[OrderStatus.Pending,
                                        OrderStatus.Approved,
                                        OrderStatus.Making,
                                        OrderStatus.Delivering,]
                                        .includes(row.status) && (
                                        <IconCustom
                                            icon={<FaRegCircleXmark size='32' color='#e7000b'/>}
                                            tooltip='Hủy đơn'
                                            background='#ffe2e2'
                                            onClick={
                                                () => {
                                                    setCancelOrderId(row.id);
                                                }
                                            }
                                        />
                                    )}
                                </div>
                            },
                        },
                    ]}
                />
            </DataWrapper>
            <Pagination
                page={page}
                onSetPage={setPage}
                pageSize={pageSize}
                onSetPageSize={setPageSize}
                total={listOrder?.pagination?.totalCount || 0}
                dependencies={[pageSize, keyword]}
            />
            <Dialog
                type='warning'
                open={!!cancelOrderId}
                onClose={() => setCancelOrderId(null)}
                title='Hủy đơn hàng'
                note='Bạn có chắc chắn muốn hủy đơn hàng này?'
                icon={
                    <Danger size='76' color='#F46161' variant='Bold'/>
                }
                onSubmit={() => updateOrderStatus.mutate({
                    id: cancelOrderId!,
                    status: OrderStatus.Cancelled,
                    msg: 'Đã hủy đơn hàng'
                })}
            />

            <Popup open={!!idDetailOrder} onClose={() => setIdDetailOrder(null)}>
                <DetailOrder onClose={() => setIdDetailOrder(null)} id={idDetailOrder!}/>
            </Popup>
        </>
    );
}

interface IDetailOrderProps {
    onClose: () => void;
    queryKeys?: QueryKey[];
    id: number;
}

function DetailOrder({id, onClose, queryKeys = []}: IDetailOrderProps) {
    const {data: orderDetail, isLoading} = useQuery({
        queryFn: () => apiRequest({
            api: () => orderService.getOrderDetail(id!),
            showMessageFailed: true
        }),
        select(data: IUserOrderDto) {
            return data;
        },
        queryKey: [QueryKey.orderDetail, id],
        enabled: !!id
    });

    if (isLoading) return <Loading loading={isLoading}/>;

    return (
        <div className="flex flex-col p-4 rounded-xl bg-white">
            <h2 className="text-lg font-semibold border-b border-gray-400">Chi tiết đơn hàng #{orderDetail?.code}</h2>
            <div className="mt-4">
                <h3 className="text-md font-semibold">Thông tin khách hàng</h3>
                <p><strong>Tên:</strong> {orderDetail?.customer?.fullName || '---'}</p>
                <p><strong>Số điện thoại:</strong> {orderDetail?.phoneNumber || '---'}</p>
                <p><strong>Địa chỉ giao hàng:</strong> {orderDetail?.shippingAddress || '---'}</p>
                <p><strong>Thời gian đặt hàng:</strong> <Moment date={orderDetail?.createdAt}
                                                                format='DD/MM/YYYY HH:mm'/></p>
                <p><strong>Trạng thái thanh toán:</strong> {
                    orderDetail?.paymentStatus === PaymentStatus.Paid ? 'Đã thanh toán' : 'Chưa thanh toán'
                }</p>
                <p><strong>Phương thức thanh toán:</strong> {
                    orderDetail?.paymentMethod === PaymentMethod
                        .Cash ? 'Tiền mặt' : orderDetail?.paymentMethod === PaymentMethod.Momo ? 'Momo' : 'VNPay'
                }</p>
                <p><strong>Tổng tiền:</strong> {orderDetail?.totalAmount || 0} VNĐ</p>
                <p><strong>Giảm giá:</strong> {orderDetail?.discountAmount || 0} VNĐ</p>
                <p><strong>Tổng thanh toán:</strong> {orderDetail?.finalAmount || 0} VNĐ</p>

                <h3 className="text-md font-semibold mt-4">Sản phẩm trong đơn hàng</h3>
                <table className="w-full border-collapse">
                    <thead>
                    <tr>
                        <th className="border px-2 py-1">Tên sản phẩm</th>
                        <th className="border px-2 py-1">Kích cỡ</th>
                        <th className="border px-2 py-1">Số lượng</th>
                        <th className="border px-2 py-1">Giá</th>
                        <th className="border px-2 py-1">Toppings</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderDetail?.products.map((product, index) => (
                        <tr key={index}>
                            <td className="border px-2 py-1">{product.productSize.product.name}</td>
                            <td className="border px-2 py-1">{product.productSize.size.name}</td>
                            <td className="border px-2 py-1">{product.quantity}</td>
                            <td className="border px-2 py-1">{product.price} VNĐ</td>
                            <td className="border px-2 py-1">
                                {product.toppings.map((topping, idx) => (
                                    <span key={idx}
                                          className="block">{topping.topping.name} (+{topping.price} VNĐ)</span>
                                ))}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-end">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}