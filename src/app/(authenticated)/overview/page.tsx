'use client'
import {Box, BoxTick, MoneyRecive} from "iconsax-react";
import React, {useState} from "react";
import {convertCoin} from "~/commons/funcs/convertCoin";
import BoxStatistical from "~/components/utils/BoxStatistical";
import FilterDateRange from "~/components/commons/FilterDateRange";
import {QueryKey, TYPE_DATE} from "~/constants/config/enum";
import {useQuery} from "@tanstack/react-query";
import moment from 'moment';
import overviewService from "~/services/apis/overviewService";
import {apiRequest} from "~/services";
import {IOverviewDto} from "~/app/(authenticated)/overview/intefaces";

export default function Overview() {
    const [typeDate, setTypeDate] = useState<TYPE_DATE>(TYPE_DATE.TODAY);
    const [date, setDate] = useState<{ from: Date | null; to: Date | null } | null>(null);

    const {data: overview} = useQuery({
        queryFn: () => apiRequest({
            api: () => overviewService.getOverview({
                fromDate: date?.from ? moment(date.from).startOf('day').format('YYYY-MM-DDTHH:mm:ss') : null,
                toDate: date?.to ? moment(date.to).endOf('day').format('YYYY-MM-DDTHH:mm:ss') : null,
            }),
            showMessageFailed: true,
        }),
        select(data: IOverviewDto) {
            return data;
        },
        queryKey: [QueryKey.getOverview, typeDate, date]
    })

    /*const dataBarChart = [
        {
            name: '1/5',
            'Đơn online': 53,
            'Đơn tại quầy': 84,
        },
        {
            name: '2/5',
            'Đơn online': 67,
            'Đơn tại quầy': 59,
        },
        {
            name: '3/5',
            'Đơn online': 35,
            'Đơn tại quầy': 97,
        },
        {
            name: '4/5',
            'Đơn online': 23,
            'Đơn tại quầy': 67,
        },
        {
            name: '5/5',
            'Đơn online': 74,
            'Đơn tại quầy': 61,
        },
        {
            name: '6/5',
            'Đơn online': 16,
            'Đơn tại quầy': 34,
        },
        {
            name: '7/5',
            'Đơn online': 45,
            'Đơn tại quầy': 85,
        },
        {
            name: '8/5',
            'Đơn online': 23,
            'Đơn tại quầy': 45,
        },
        {
            name: '9/5',
            'Đơn online': 23,
            'Đơn tại quầy': 62,
        },
    ];*/

    return (
        <div className="h-full flex flex-col justify-start items-start">
            <div className="flex items-center justify-between">
                <h4 className="text-[#141416] text-[24px] font-semibold">Báo cáo thống kê hệ thống</h4>
            </div>
            <FilterDateRange
                styleRounded={true}
                date={date}
                setDate={setDate}
                typeDate={typeDate}
                setTypeDate={setTypeDate}
            />
            <div className="my-5 w-full">
                <div className="flex flex-wrap gap-5">
                    <div className="w-[calc(50%-10px)]">
                        <BoxStatistical
                            value={convertCoin(overview?.pendingOrder!)}
                            text='Đơn đang chờ'
                            icon={<Box size='32' color='#4ECB71'/>}
                        />
                    </div>
                    <div className="w-[calc(50%-10px)]">
                        <BoxStatistical
                            value={convertCoin(overview?.processingOrder.totalOrder!)}
                            text='Đơn đang thực hiện'
                            icon={<Box size='32' color='#4ECB71'/>}
                        />
                    </div>
                    <div className="w-[calc(50%-10px)]">
                        <BoxStatistical
                            value={convertCoin(overview?.finishedOrder!)}
                            text='Đơn đã hoàn thành'
                            icon={<Box size='32' color='#4ECB71'/>}
                        />
                    </div>
                    <div className="w-[calc(50%-10px)]">
                        <BoxStatistical
                            value={convertCoin(overview?.cancelledOrder.totalOrder!)}
                            text='Đơn bị hủy'
                            icon={<Box size='32' color='#4ECB71'/>}
                        />
                    </div>
                    <div className="w-[calc(50%-10px)]">
                        <BoxStatistical
                            value={convertCoin(overview?.totalOrder!)}
                            text='Tổng số đơn'
                            icon={<BoxTick size='32' color='#3772FF'/>}
                        />
                    </div>
                    <div className="w-[calc(50%-10px)]">
                        <BoxStatistical
                            value={convertCoin(overview?.grossSale!)}
                            text='Doanh thu (VNĐ)'
                            icon={<MoneyRecive size='32' color='#4ECB71'/>}
                        />
                    </div>
                </div>
            </div>

            {/*<div className="px-5 py-3 rounded-sm border border-dashed border-[rgba(110,105,105,0.15)] bg-white min-h-[500px] w-full">*/}
            {/*    <ResponsiveContainer width='100%' height='100%'>*/}
            {/*        <BarChart*/}
            {/*            width={500}*/}
            {/*            height={300}*/}
            {/*            data={dataBarChart}*/}
            {/*            margin={{*/}

            {/*                top: 20,*/}
            {/*                right: 30,*/}
            {/*                left: 20,*/}
            {/*                bottom: 5,*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <CartesianGrid strokeDasharray="3 3" />*/}
            {/*            <XAxis dataKey="name" />*/}
            {/*            <YAxis />*/}
            {/*            <Tooltip />*/}
            {/*            <Legend />*/}
            {/*            <Bar dataKey="Đơn online" stackId="a" fill="#8884d8" />*/}
            {/*            <Bar dataKey="Đơn tại quầy" stackId="a" fill="#82ca9d" />*/}
            {/*        </BarChart>*/}
            {/*    </ResponsiveContainer>*/}
            {/*</div>*/}
        </div>
    );
}
